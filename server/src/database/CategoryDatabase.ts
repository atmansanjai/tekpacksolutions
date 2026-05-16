import type { CategoryFilter, CategoryInput, CategoryRepository, CategorySort } from '../Repository/CategoryRepository.js';
import { type ICategorySchema } from '../model/CategorySchema.js';
import mongoose, { type DeleteResult, type Model, type QueryFilter, type SortOrder, Types } from 'mongoose';
import { getRelationshipChanges } from './relationshipChanges.js';

class CategoryDatabase implements CategoryRepository {
  private CategoryModel: Model<ICategorySchema>;

  constructor(CategoryModel: Model<ICategorySchema>) {
    this.CategoryModel = CategoryModel;
  }

  private async applyMachineRelations(categoryId: string, machineIds?: string[]): Promise<void> {
    const currentMachineIds = (await mongoose.model('Machine').distinct('_id', { category: categoryId })).map((id) =>
      id.toString(),
    );
    const changes = getRelationshipChanges(currentMachineIds, machineIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeMachinesFromCategory(categoryId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addMachinesFromCategory(categoryId, changes.idsToAdd) : null,
    ]);
  }

  private async applySectorRelations(categoryId: string, sectorIds?: string[]): Promise<void> {
    const category = await this.CategoryModel.findById(categoryId).select('sector').lean();
    const currentSectorIds = (category?.sector ?? []).map((id) => id.toString());
    const changes = getRelationshipChanges(currentSectorIds, sectorIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeSectorsFromCategory(categoryId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addSectorsFromCategory(categoryId, changes.idsToAdd) : null,
    ]);
  }

  private async applyRelations(categoryId: string, relations: Pick<CategoryInput, 'machine' | 'sector'>): Promise<void> {
    await Promise.all([
      this.applyMachineRelations(categoryId, relations.machine),
      this.applySectorRelations(categoryId, relations.sector),
    ]);
  }

  async activateCategory(id: string): Promise<ICategorySchema | null> {
    return this.CategoryModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).lean();
  }

  async deactivateCategory(id: string): Promise<ICategorySchema | null> {
    return this.CategoryModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async deleteManyCategories(ids: string[]): Promise<DeleteResult> {
    return this.CategoryModel.deleteMany({ _id: { $in: ids } });
  }

  async addManyCategories(Categories: Partial<ICategorySchema>[]): Promise<ICategorySchema[]> {
    const docs = await this.CategoryModel.create(Categories);
    return docs.map((doc) => doc.toObject());
  }

  deleteAllCategories(): Promise<DeleteResult> {
    return this.CategoryModel.deleteMany();
  }

  async getCategoryById(id: string): Promise<ICategorySchema | null> {
    return this.CategoryModel.findById(id).lean();
  }

  async getCategoryBySlug(slug: string): Promise<ICategorySchema | null> {
    return this.CategoryModel.findOne({ slug }).lean();
  }

  async getAllCategories(
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: CategoryFilter,
    sort: CategorySort,
  ): Promise<{
    categories: ICategorySchema[];

    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }> {
    /**
     * # =====================
     *
     * FILTER QUERY
     */
    const filterQuery: QueryFilter<ICategorySchema> = {};

    if (filter) {
      if (filter.search) {
        filterQuery.name = {
          $regex: filter.search,
          $options: 'i',
        };
      }
      if (filter.isActive !== undefined) {
        filterQuery.isActive = filter.isActive;
      }
    }

    // pagination
    const paginationQuery: QueryFilter<ICategorySchema> = {
      ...filterQuery,
    };

    // sorting
    const sortField = sort?.field || '_id';

    const sortOrder = sort?.order === 'desc' ? -1 : 1;

    const isForwardPagination = Boolean(first);

    const hasLimit = Boolean(first || last);
    const limit = first || last;

    if (after) {
      paginationQuery._id = {
        ...(paginationQuery._id as object),
        $gt: new Types.ObjectId(after),
      };
    }

    if (before) {
      paginationQuery._id = {
        ...(paginationQuery._id as object),
        $lt: new Types.ObjectId(before),
      };
    }

    const mongoSortOrder = isForwardPagination ? sortOrder : -sortOrder;

    const sortQuery: Record<string, SortOrder> = {
      [sortField]: mongoSortOrder as SortOrder,
    };

    const query = this.CategoryModel.find(paginationQuery).sort(sortQuery);
    if (hasLimit) {
      query.limit(limit + 1);
    }

    const [categories, totalCount] = await Promise.all([
      await query.lean().exec() as unknown as ICategorySchema[],
      /** IMPORTANT: totalCount should NOT use paginationQuery */
      this.CategoryModel.countDocuments(filterQuery),
    ]);

    let hasNextPage = false;
    let hasPreviousPage = false;

    if (hasLimit) {
      if (isForwardPagination) {
        hasNextPage = categories.length > limit;

        if (hasNextPage) {
          categories.pop();
        }

        hasPreviousPage = Boolean(after);
      } else {
        hasPreviousPage = categories.length > limit;

        if (hasPreviousPage) {
          categories.pop();
        }

        categories.reverse();

        hasNextPage = Boolean(before);
      }
    }

    const startCursor = categories.length > 0 ? categories[0]!._id.toString() : null;

    const endCursor = categories.length > 0 ? categories[categories.length - 1]!._id.toString() : null;

    return {
      categories,

      pageInfo: {
        hasNextPage,

        hasPreviousPage,

        startCursor,

        endCursor,

        totalCount,
      },
    };
  }

  async removeCategory(id: string): Promise<ICategorySchema | null> {
    return this.CategoryModel.findByIdAndDelete(id).lean();
  }

  async removeMachineFromCategory(categoryId: string, machineId: string): Promise<ICategorySchema | null> {
    return this.removeMachinesFromCategory(categoryId, [machineId]);
  }

  async addMachineFromCategory(categoryId: string, machineId: string): Promise<ICategorySchema | null> {
    return this.addMachinesFromCategory(categoryId, [machineId]);
  }

  async removeMachinesFromCategory(categoryId: string, machineIds: string[]): Promise<ICategorySchema | null> {
    await mongoose.model('Machine').updateMany({ _id: { $in: machineIds } }, { $pull: { category: categoryId } });
    return this.CategoryModel.findById(categoryId).lean();
  }

  async addMachinesFromCategory(categoryId: string, machineIds: string[]): Promise<ICategorySchema | null> {
    await mongoose.model('Machine').updateMany({ _id: { $in: machineIds } }, { $addToSet: { category: categoryId } });
    return this.CategoryModel.findById(categoryId).lean();
  }

  async removeSectorFromCategory(categoryId: string, sectorId: string): Promise<ICategorySchema | null> {
    return this.removeSectorsFromCategory(categoryId, [sectorId]);
  }

  async addSectorFromCategory(categoryId: string, sectorId: string): Promise<ICategorySchema | null> {
    return this.addSectorsFromCategory(categoryId, [sectorId]);
  }

  async removeSectorsFromCategory(categoryId: string, sectorIds: string[]): Promise<ICategorySchema | null> {
    return this.CategoryModel.findByIdAndUpdate(
      categoryId,
      { $pull: { sector: { $in: sectorIds } } },
      { new: true },
    ).lean();
  }

  async addSectorsFromCategory(categoryId: string, sectorIds: string[]): Promise<ICategorySchema | null> {
    return this.CategoryModel.findByIdAndUpdate(
      categoryId,
      { $addToSet: { sector: { $each: sectorIds } } },
      { new: true },
    ).lean();
  }

  async saveCategory(Category: CategoryInput): Promise<ICategorySchema | null> {
    const { machine, sector, ...category } = Category;
    const doc = await this.CategoryModel.create(category);
    await this.applyRelations(doc._id.toString(), { machine, sector });
    return this.CategoryModel.findById(doc._id).lean();
  }

  async updateCategory(id: string, update: CategoryInput): Promise<ICategorySchema | null> {
    const { machine, sector, ...categoryUpdate } = update;
    const category = await this.CategoryModel.findOneAndUpdate(
      { _id: id },
      { $set: categoryUpdate },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (category) {
      await this.applyRelations(id, { machine, sector });
    }

    return this.CategoryModel.findById(id).lean();
  }
}

export default CategoryDatabase;

import type { SectorFilter, SectorInput, SectorRepository, SectorSort } from '../Repository/SectorRepository.js';
import { type ISectorSchema } from '../model/SectorSchema.js';
import mongoose, { type DeleteResult, type Model, type QueryFilter, type SortOrder, Types } from 'mongoose';
import { getRelationshipChanges } from './relationshipChanges.js';

class SectorDatabase implements SectorRepository {
  private SectorModel: Model<ISectorSchema>;

  constructor(SectorModel: Model<ISectorSchema>) {
    this.SectorModel = SectorModel;
  }

  async activateSector(id: string): Promise<ISectorSchema | null> {
    return this.SectorModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).lean();
  }

  async deactivateSector(id: string): Promise<ISectorSchema | null> {
    return this.SectorModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async deleteManySectors(ids: string[]): Promise<DeleteResult> {
    return this.SectorModel.deleteMany({ _id: { $in: ids } });
  }

  async addManySectors(Sectors: Partial<ISectorSchema>[]): Promise<ISectorSchema[]> {
    const docs = await this.SectorModel.create(Sectors);
    return docs.map((doc) => doc.toObject());
  }

  deleteAllSectors(): Promise<DeleteResult> {
    return this.SectorModel.deleteMany();
  }

  async getSectorById(id: string): Promise<ISectorSchema | null> {
    return this.SectorModel.findById(id).lean();
  }

  async getSectorBySlug(slug: string): Promise<ISectorSchema | null> {
    return this.SectorModel.findOne({ slug }).lean();
  }

  async getAllSectors(
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: SectorFilter,
    sort: SectorSort,
  ): Promise<{
    sectors: ISectorSchema[];

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
    const filterQuery: QueryFilter<ISectorSchema> = {};

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
    const paginationQuery: QueryFilter<ISectorSchema> = {
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

    const query = this.SectorModel.find(paginationQuery).sort(sortQuery);
    if (hasLimit) {
      query.limit(limit + 1);
    }
    const [sectors, totalCount] = await Promise.all([
      (await query.lean().exec()) as unknown as ISectorSchema[],
      /** IMPORTANT: totalCount should NOT use paginationQuery */
      this.SectorModel.countDocuments(filterQuery),
    ]);

    let hasNextPage = false;
    let hasPreviousPage = false;

    if (hasLimit) {
      if (isForwardPagination) {
        hasNextPage = sectors.length > limit;

        if (hasNextPage) {
          sectors.pop();
        }

        hasPreviousPage = Boolean(after);
      } else {
        hasPreviousPage = sectors.length > limit;

        if (hasPreviousPage) {
          sectors.pop();
        }

        sectors.reverse();

        hasNextPage = Boolean(before);
      }
    }

    const startCursor = sectors.length > 0 ? sectors[0]!._id.toString() : null;

    const endCursor = sectors.length > 0 ? sectors[sectors.length - 1]!._id.toString() : null;

    return {
      sectors,

      pageInfo: {
        hasNextPage,

        hasPreviousPage,

        startCursor,

        endCursor,

        totalCount,
      },
    };
  }

  async removeSector(id: string): Promise<ISectorSchema | null> {
    return this.SectorModel.findByIdAndDelete(id).lean();
  }

  async removeCategoryFromSector(sectorId: string, categoryId: string): Promise<ISectorSchema | null> {
    return this.removeCategoriesFromSector(sectorId, [categoryId]);
  }

  async addCategoryFromSector(sectorId: string, categoryId: string): Promise<ISectorSchema | null> {
    return this.addCategoriesFromSector(sectorId, [categoryId]);
  }

  async removeCategoriesFromSector(sectorId: string, categoryIds: string[]): Promise<ISectorSchema | null> {
    await mongoose.model('Category').updateMany({ _id: { $in: categoryIds } }, { $pull: { sector: sectorId } });
    return this.SectorModel.findById(sectorId).lean();
  }

  async addCategoriesFromSector(sectorId: string, categoryIds: string[]): Promise<ISectorSchema | null> {
    await mongoose.model('Category').updateMany({ _id: { $in: categoryIds } }, { $addToSet: { sector: sectorId } });
    return this.SectorModel.findById(sectorId).lean();
  }

  async removeSolutionFromSector(sectorId: string, solutionId: string): Promise<ISectorSchema | null> {
    return this.removeSolutionsFromSector(sectorId, [solutionId]);
  }

  async addSolutionFromSector(sectorId: string, solutionId: string): Promise<ISectorSchema | null> {
    return this.addSolutionsFromSector(sectorId, [solutionId]);
  }

  async removeSolutionsFromSector(sectorId: string, solutionIds: string[]): Promise<ISectorSchema | null> {
    await mongoose.model('Solution').updateMany({ _id: { $in: solutionIds } }, { $pull: { sector: sectorId } });
    return this.SectorModel.findById(sectorId).lean();
  }

  async addSolutionsFromSector(sectorId: string, solutionIds: string[]): Promise<ISectorSchema | null> {
    await mongoose.model('Solution').updateMany({ _id: { $in: solutionIds } }, { $addToSet: { sector: sectorId } });
    return this.SectorModel.findById(sectorId).lean();
  }

  async saveSector(Sector: SectorInput): Promise<ISectorSchema | null> {
    const { category, solution, ...sector } = Sector;
    const doc = await this.SectorModel.create(sector);
    await this.applyRelations(doc._id.toString(), { category, solution });
    return doc.toObject();
  }

  async updateSector(id: string, update: SectorInput): Promise<ISectorSchema | null> {
    const { category, solution, ...sectorUpdate } = update;
    const sector = await this.SectorModel.findOneAndUpdate(
      { _id: id },
      { $set: sectorUpdate },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (sector) {
      await this.applyRelations(id, { category, solution });
    }

    return sector;
  }

  private async applyCategoryRelations(sectorId: string, categoryIds?: string[]): Promise<void> {
    const currentCategoryIds = (await mongoose.model('Category').distinct('_id', { sector: sectorId })).map((id) =>
      id.toString(),
    );
    const changes = getRelationshipChanges(currentCategoryIds, categoryIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeCategoriesFromSector(sectorId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addCategoriesFromSector(sectorId, changes.idsToAdd) : null,
    ]);
  }

  private async applySolutionRelations(sectorId: string, solutionIds?: string[]): Promise<void> {
    const currentSolutionIds = (await mongoose.model('Solution').distinct('_id', { sector: sectorId })).map((id) =>
      id.toString(),
    );
    const changes = getRelationshipChanges(currentSolutionIds, solutionIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeSolutionsFromSector(sectorId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addSolutionsFromSector(sectorId, changes.idsToAdd) : null,
    ]);
  }

  private async applyRelations(sectorId: string, relations: Pick<SectorInput, 'category' | 'solution'>): Promise<void> {
    await Promise.all([
      this.applyCategoryRelations(sectorId, relations.category),
      this.applySolutionRelations(sectorId, relations.solution),
    ]);
  }
}

export default SectorDatabase;

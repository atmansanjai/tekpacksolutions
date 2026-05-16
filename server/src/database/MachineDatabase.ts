import type { MachineFilter, MachineInput, MachineRepository, MachineSort } from '../Repository/MachineRepository.js';
import { type IMachineSchema } from '../model/MachineSchema.js';
import { type DeleteResult, type Model, type QueryFilter, type SortOrder, Types } from 'mongoose';
import { getRelationshipChanges } from './relationshipChanges.js';

class MachineDatabase implements MachineRepository {
  private MachineModel: Model<IMachineSchema>;

  constructor(MachineModel: Model<IMachineSchema>) {
    this.MachineModel = MachineModel;
  }

  async activateMachine(id: string): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).lean();
  }

  async deactivateMachine(id: string): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async deleteManyMachines(ids: string[]): Promise<DeleteResult> {
    return this.MachineModel.deleteMany({ _id: { $in: ids } });
  }

  async addManyMachines(Machines: Partial<IMachineSchema>[]): Promise<IMachineSchema[]> {
    const docs = await this.MachineModel.create(Machines);
    return docs.map((doc) => doc.toObject());
  }

  deleteAllMachines(): Promise<DeleteResult> {
    return this.MachineModel.deleteMany();
  }

  async getMachineById(id: string): Promise<IMachineSchema | null> {
    return this.MachineModel.findById(id).lean();
  }

  async getMachineBySlug(slug: string): Promise<IMachineSchema | null> {
    return this.MachineModel.findOne({ slug }).lean();
  }

  async getAllMachines(
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: MachineFilter,
    sort: MachineSort,
  ): Promise<{
    machines: IMachineSchema[];
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
    const filterQuery: QueryFilter<IMachineSchema> = {};

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
    const paginationQuery: QueryFilter<IMachineSchema> = {
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

    const query = this.MachineModel.find(paginationQuery).sort(sortQuery);
    if (hasLimit) {
      query.limit(limit + 1);
    }

    const [machines, totalCount] = await Promise.all([
      (await query.lean().exec()) as unknown as IMachineSchema[],
      /** IMPORTANT: totalCount should NOT use paginationQuery */
      this.MachineModel.countDocuments(filterQuery),
    ]);

    let hasNextPage = false;
    let hasPreviousPage = false;

    if (hasLimit) {
      if (isForwardPagination) {
        hasNextPage = machines.length > limit;

        if (hasNextPage) {
          machines.pop();
        }

        hasPreviousPage = Boolean(after);
      } else {
        hasPreviousPage = machines.length > limit;

        if (hasPreviousPage) {
          machines.pop();
        }

        machines.reverse();

        hasNextPage = Boolean(before);
      }
    }

    const startCursor = machines.length > 0 ? machines[0]!._id.toString() : null;

    const endCursor = machines.length > 0 ? machines[machines.length - 1]!._id.toString() : null;

    return {
      machines,

      pageInfo: {
        hasNextPage,

        hasPreviousPage,

        startCursor,

        endCursor,

        totalCount,
      },
    };
  }

  async removeMachine(id: string): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndDelete(id).lean();
  }

  async removeSolutionFromMachine(machineId: string, solutionId: string): Promise<IMachineSchema | null> {
    return this.removeSolutionsFromMachine(machineId, [solutionId]);
  }

  async addSolutionFromMachine(machineId: string, solutionId: string): Promise<IMachineSchema | null> {
    return this.addSolutionsFromMachine(machineId, [solutionId]);
  }

  async removeSolutionsFromMachine(machineId: string, solutionIds: string[]): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(
      machineId,
      { $pull: { solution: { $in: solutionIds } } },
      { new: true },
    ).lean();
  }

  async addSolutionsFromMachine(machineId: string, solutionIds: string[]): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(
      machineId,
      { $addToSet: { solution: { $each: solutionIds } } },
      { new: true },
    ).lean();
  }

  async removeCategoryFromMachine(machineId: string, categoryId: string): Promise<IMachineSchema | null> {
    return this.removeCategoriesFromMachine(machineId, [categoryId]);
  }

  async addCategoryFromMachine(machineId: string, categoryId: string): Promise<IMachineSchema | null> {
    return this.addCategoriesFromMachine(machineId, [categoryId]);
  }

  async removeCategoriesFromMachine(machineId: string, categoryIds: string[]): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(
      machineId,
      { $pull: { category: { $in: categoryIds } } },
      { new: true },
    ).lean();
  }

  async addCategoriesFromMachine(machineId: string, categoryIds: string[]): Promise<IMachineSchema | null> {
    return this.MachineModel.findByIdAndUpdate(
      machineId,
      { $addToSet: { category: { $each: categoryIds } } },
      { new: true },
    ).lean();
  }

  async saveMachine(Machine: MachineInput): Promise<IMachineSchema | null> {
    const { category, solution, ...machine } = Machine;
    const doc = await this.MachineModel.create(machine);
    await this.applyRelations(doc._id.toString(), { category, solution });
    return this.MachineModel.findById(doc._id).lean();
  }

  async updateMachine(id: string, update: MachineInput): Promise<IMachineSchema | null> {
    const { category, solution, ...machineUpdate } = update;
    const machine = await this.MachineModel.findOneAndUpdate(
      { _id: id },
      { $set: machineUpdate },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (machine) {
      await this.applyRelations(id, { category, solution });
    }

    return this.MachineModel.findById(id).lean();
  }

  private async applySolutionRelations(machineId: string, solutionIds?: string[]): Promise<void> {
    const machine = await this.MachineModel.findById(machineId).select('solution').lean();
    const currentSolutionIds = (machine?.solution ?? []).map((id) => id.toString());
    const changes = getRelationshipChanges(currentSolutionIds, solutionIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeSolutionsFromMachine(machineId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addSolutionsFromMachine(machineId, changes.idsToAdd) : null,
    ]);
  }

  private async applyCategoryRelations(machineId: string, categoryIds?: string[]): Promise<void> {
    const machine = await this.MachineModel.findById(machineId).select('category').lean();
    const currentCategoryIds = (machine?.category ?? []).map((id) => id.toString());
    const changes = getRelationshipChanges(currentCategoryIds, categoryIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeCategoriesFromMachine(machineId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addCategoriesFromMachine(machineId, changes.idsToAdd) : null,
    ]);
  }

  private async applyRelations(
    machineId: string,
    relations: Pick<MachineInput, 'category' | 'solution'>,
  ): Promise<void> {
    await Promise.all([
      this.applyCategoryRelations(machineId, relations.category),
      this.applySolutionRelations(machineId, relations.solution),
    ]);
  }
}

export default MachineDatabase;

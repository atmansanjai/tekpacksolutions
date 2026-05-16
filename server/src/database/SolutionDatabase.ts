import type {
  SolutionFilter,
  SolutionInput,
  SolutionRepository,
  SolutionSort,
} from '../Repository/SolutionRepository.js';
import { type ISolutionSchema } from '../model/SolutionSchema.js';
import mongoose, { type DeleteResult, type Model, type QueryFilter, type SortOrder, Types } from 'mongoose';
import { getRelationshipChanges } from './relationshipChanges.js';

class SolutionDatabase implements SolutionRepository {
  private SolutionModel: Model<ISolutionSchema>;

  constructor(SolutionModel: Model<ISolutionSchema>) {
    this.SolutionModel = SolutionModel;
  }

  async activateSolution(id: string): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).lean();
  }

  async deactivateSolution(id: string): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async deleteManySolutions(ids: string[]): Promise<DeleteResult> {
    return this.SolutionModel.deleteMany({ _id: { $in: ids } });
  }

  async addManySolutions(Solutions: Partial<ISolutionSchema>[]): Promise<ISolutionSchema[]> {
    const docs = await this.SolutionModel.create(Solutions);
    return docs.map((doc) => doc.toObject());
  }

  deleteAllSolutions(): Promise<DeleteResult> {
    return this.SolutionModel.deleteMany();
  }

  async getSolutionById(id: string): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findById(id).lean();
  }

  async getSolutionBySlug(slug: string): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findOne({ slug }).lean();
  }

  async getAllSolutions(
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: SolutionFilter,
    sort: SolutionSort,
  ): Promise<{
    solutions: ISolutionSchema[];

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
    const filterQuery: QueryFilter<ISolutionSchema> = {};

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
    const paginationQuery: QueryFilter<ISolutionSchema> = {
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

    const query = this.SolutionModel.find(paginationQuery).sort(sortQuery);
    if (hasLimit) {
      query.limit(limit + 1);
    }

    const [solutions, totalCount] = await Promise.all([
      (await query.lean().exec()) as unknown as ISolutionSchema[],
      /** IMPORTANT: totalCount should NOT use paginationQuery */
      this.SolutionModel.countDocuments(filterQuery),
    ]);

    let hasNextPage = false;
    let hasPreviousPage = false;

    if (hasLimit) {
      if (isForwardPagination) {
        hasNextPage = solutions.length > limit;

        if (hasNextPage) {
          solutions.pop();
        }

        hasPreviousPage = Boolean(after);
      } else {
        hasPreviousPage = solutions.length > limit;

        if (hasPreviousPage) {
          solutions.pop();
        }

        solutions.reverse();

        hasNextPage = Boolean(before);
      }
    }

    const startCursor = solutions.length > 0 ? solutions[0]!._id.toString() : null;

    const endCursor = solutions.length > 0 ? solutions[solutions.length - 1]!._id.toString() : null;

    return {
      solutions,

      pageInfo: {
        hasNextPage,

        hasPreviousPage,

        startCursor,

        endCursor,

        totalCount,
      },
    };
  }

  async removeSolution(id: string): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findByIdAndDelete(id).lean();
  }

  async removeMachineFromSolution(solutionId: string, machineId: string): Promise<ISolutionSchema | null> {
    return this.removeMachinesFromSolution(solutionId, [machineId]);
  }

  async addMachineFromSolution(solutionId: string, machineId: string): Promise<ISolutionSchema | null> {
    return this.addMachinesFromSolution(solutionId, [machineId]);
  }

  async removeMachinesFromSolution(solutionId: string, machineIds: string[]): Promise<ISolutionSchema | null> {
    await mongoose.model('Machine').updateMany({ _id: { $in: machineIds } }, { $pull: { solution: solutionId } });
    return this.SolutionModel.findById(solutionId).lean();
  }

  async addMachinesFromSolution(solutionId: string, machineIds: string[]): Promise<ISolutionSchema | null> {
    await mongoose.model('Machine').updateMany({ _id: { $in: machineIds } }, { $addToSet: { solution: solutionId } });
    return this.SolutionModel.findById(solutionId).lean();
  }

  async removeSectorFromSolution(solutionId: string, sectorId: string): Promise<ISolutionSchema | null> {
    return this.removeSectorsFromSolution(solutionId, [sectorId]);
  }

  async addSectorFromSolution(solutionId: string, sectorId: string): Promise<ISolutionSchema | null> {
    return this.addSectorsFromSolution(solutionId, [sectorId]);
  }

  async removeSectorsFromSolution(solutionId: string, sectorIds: string[]): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findByIdAndUpdate(
      solutionId,
      { $pull: { sector: { $in: sectorIds } } },
      { new: true },
    ).lean();
  }

  async addSectorsFromSolution(solutionId: string, sectorIds: string[]): Promise<ISolutionSchema | null> {
    return this.SolutionModel.findByIdAndUpdate(
      solutionId,
      { $addToSet: { sector: { $each: sectorIds } } },
      { new: true },
    ).lean();
  }

  async saveSolution(Solution: SolutionInput): Promise<ISolutionSchema | null> {
    const { machine, sector, ...solution } = Solution;
    const doc = await this.SolutionModel.create(solution);
    await this.applyRelations(doc._id.toString(), { machine, sector });
    return this.SolutionModel.findById(doc._id).lean();
  }

  async updateSolution(id: string, update: SolutionInput): Promise<ISolutionSchema | null> {
    const { machine, sector, ...solutionUpdate } = update;
    const solution = await this.SolutionModel.findOneAndUpdate(
      { _id: id },
      { $set: solutionUpdate },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (solution) {
      await this.applyRelations(id, { machine, sector });
    }

    return this.SolutionModel.findById(id).lean();
  }

  private async applyMachineRelations(solutionId: string, machineIds?: string[]): Promise<void> {
    const currentMachineIds = (await mongoose.model('Machine').distinct('_id', { solution: solutionId })).map((id) =>
      id.toString(),
    );
    const changes = getRelationshipChanges(currentMachineIds, machineIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeMachinesFromSolution(solutionId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addMachinesFromSolution(solutionId, changes.idsToAdd) : null,
    ]);
  }

  private async applySectorRelations(solutionId: string, sectorIds?: string[]): Promise<void> {
    const solution = await this.SolutionModel.findById(solutionId).select('sector').lean();
    const currentSectorIds = (solution?.sector ?? []).map((id) => id.toString());
    const changes = getRelationshipChanges(currentSectorIds, sectorIds);

    if (!changes) {
      return;
    }

    await Promise.all([
      changes.idsToRemove.length > 0 ? this.removeSectorsFromSolution(solutionId, changes.idsToRemove) : null,
      changes.idsToAdd.length > 0 ? this.addSectorsFromSolution(solutionId, changes.idsToAdd) : null,
    ]);
  }

  private async applyRelations(
    solutionId: string,
    relations: Pick<SolutionInput, 'machine' | 'sector'>,
  ): Promise<void> {
    await Promise.all([
      this.applyMachineRelations(solutionId, relations.machine),
      this.applySectorRelations(solutionId, relations.sector),
    ]);
  }
}

export default SolutionDatabase;

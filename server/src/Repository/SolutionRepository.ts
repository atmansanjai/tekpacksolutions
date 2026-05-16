import { type ISolutionSchema } from '../model/SolutionSchema.js';
import type { DeleteResult } from 'mongoose';

export interface SolutionFilter {
  isActive?: boolean;
  search?: string;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SolutionSort {
  field: string;
  order: SortOrder;
}

export type SolutionInput = Omit<Partial<ISolutionSchema>, 'sector'> & {
  machine?: string[] | undefined;
  sector?: string[] | undefined;
};

export interface SolutionRepository {
  addManySolutions: (Solutions: Partial<ISolutionSchema>[]) => Promise<ISolutionSchema[]>;
  activateSolution: (id: string) => Promise<ISolutionSchema | null>;
  deactivateSolution: (id: string) => Promise<ISolutionSchema | null>;
  saveSolution: (Solution: SolutionInput) => Promise<ISolutionSchema | null>;
  getSolutionById: (id: string) => Promise<ISolutionSchema | null>;
  getSolutionBySlug: (slug: string) => Promise<ISolutionSchema | null>;
  getAllSolutions: (
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: SolutionFilter,
    sort: SolutionSort,
  ) => Promise<{
    solutions: ISolutionSchema[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }>;
  updateSolution: (id: string, update: SolutionInput) => Promise<ISolutionSchema | null>;
  removeSolution: (id: string) => Promise<ISolutionSchema | null>;
  removeMachineFromSolution: (solutionId: string, machineId: string) => Promise<ISolutionSchema | null>;
  addMachineFromSolution: (solutionId: string, machineId: string) => Promise<ISolutionSchema | null>;
  removeMachinesFromSolution: (solutionId: string, machineIds: string[]) => Promise<ISolutionSchema | null>;
  addMachinesFromSolution: (solutionId: string, machineIds: string[]) => Promise<ISolutionSchema | null>;
  removeSectorFromSolution: (solutionId: string, sectorId: string) => Promise<ISolutionSchema | null>;
  addSectorFromSolution: (solutionId: string, sectorId: string) => Promise<ISolutionSchema | null>;
  removeSectorsFromSolution: (solutionId: string, sectorIds: string[]) => Promise<ISolutionSchema | null>;
  addSectorsFromSolution: (solutionId: string, sectorIds: string[]) => Promise<ISolutionSchema | null>;
  deleteManySolutions: (ids: string[]) => Promise<DeleteResult>;
  deleteAllSolutions: () => Promise<DeleteResult>;
}

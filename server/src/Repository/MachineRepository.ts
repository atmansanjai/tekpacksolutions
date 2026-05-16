import { type IMachineSchema } from '../model/MachineSchema.js';
import type { DeleteResult } from 'mongoose';

export interface MachineFilter {
  isActive?: boolean;
  search?: string;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface MachineSort {
  field: string;
  order: SortOrder;
}

export type MachineInput = Omit<Partial<IMachineSchema>, 'category' | 'solution'> & {
  category?: string[] | undefined;
  solution?: string[] | undefined;
};

export interface MachineRepository {
  addManyMachines: (Machines: Partial<IMachineSchema>[]) => Promise<IMachineSchema[]>;
  activateMachine: (id: string) => Promise<IMachineSchema | null>;
  deactivateMachine: (id: string) => Promise<IMachineSchema | null>;
  saveMachine: (Machine: MachineInput) => Promise<IMachineSchema | null>;
  getMachineById: (id: string) => Promise<IMachineSchema | null>;
  getMachineBySlug: (slug: string) => Promise<IMachineSchema | null>;
  getAllMachines: (
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: MachineFilter,
    sort: MachineSort,
  ) => Promise<{
    machines: IMachineSchema[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }>;
  updateMachine: (id: string, update: MachineInput) => Promise<IMachineSchema | null>;
  removeMachine: (id: string) => Promise<IMachineSchema | null>;
  removeSolutionFromMachine: (machineId: string, solutionId: string) => Promise<IMachineSchema | null>;
  addSolutionFromMachine: (machineId: string, solutionId: string) => Promise<IMachineSchema | null>;
  removeSolutionsFromMachine: (machineId: string, solutionIds: string[]) => Promise<IMachineSchema | null>;
  addSolutionsFromMachine: (machineId: string, solutionIds: string[]) => Promise<IMachineSchema | null>;
  removeCategoryFromMachine: (machineId: string, categoryId: string) => Promise<IMachineSchema | null>;
  addCategoryFromMachine: (machineId: string, categoryId: string) => Promise<IMachineSchema | null>;
  removeCategoriesFromMachine: (machineId: string, categoryIds: string[]) => Promise<IMachineSchema | null>;
  addCategoriesFromMachine: (machineId: string, categoryIds: string[]) => Promise<IMachineSchema | null>;
  deleteManyMachines: (ids: string[]) => Promise<DeleteResult>;
  deleteAllMachines: () => Promise<DeleteResult>;
}

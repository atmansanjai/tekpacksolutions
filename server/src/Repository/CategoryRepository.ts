import { type ICategorySchema } from '../model/CategorySchema.js';
import type { DeleteResult } from 'mongoose';

export interface CategoryFilter {
  isActive?: boolean;
  search?: string;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface CategorySort {
  field: string;
  order: SortOrder;
}

export type CategoryInput = Omit<Partial<ICategorySchema>, 'sector'> & {
  machine?: string[] | undefined;
  sector?: string[] | undefined;
};

export interface CategoryRepository {
  activateCategory: (id: string) => Promise<ICategorySchema | null>;
  deactivateCategory: (id: string) => Promise<ICategorySchema | null>;
  saveCategory: (Category: CategoryInput) => Promise<ICategorySchema | null>;
  getCategoryById: (id: string) => Promise<ICategorySchema | null>;
  getCategoryBySlug: (slug: string) => Promise<ICategorySchema | null>;
  getAllCategories: (
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: CategoryFilter,
    sort: CategorySort,
  ) => Promise<{
    categories: ICategorySchema[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }>;
  updateCategory: (id: string, update: CategoryInput) => Promise<ICategorySchema | null>;
  removeCategory: (id: string) => Promise<ICategorySchema | null>;
  deleteManyCategories: (ids: string[]) => Promise<DeleteResult>;
  deleteAllCategories: () => Promise<DeleteResult>;
  removeMachineFromCategory: (categoryId: string, machineId: string) => Promise<ICategorySchema | null>;
  addMachineFromCategory: (categoryId: string, machineId: string) => Promise<ICategorySchema | null>;
  removeMachinesFromCategory: (categoryId: string, machineIds: string[]) => Promise<ICategorySchema | null>;
  addMachinesFromCategory: (categoryId: string, machineIds: string[]) => Promise<ICategorySchema | null>;
  removeSectorFromCategory: (categoryId: string, sectorId: string) => Promise<ICategorySchema | null>;
  addSectorFromCategory: (categoryId: string, sectorId: string) => Promise<ICategorySchema | null>;
  removeSectorsFromCategory: (categoryId: string, sectorIds: string[]) => Promise<ICategorySchema | null>;
  addSectorsFromCategory: (categoryId: string, sectorIds: string[]) => Promise<ICategorySchema | null>;
}

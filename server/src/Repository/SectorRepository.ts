import { type ISectorSchema } from '../model/SectorSchema.js';
import type { DeleteResult } from 'mongoose';

export interface SectorFilter {
  isActive?: boolean;
  search?: string;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SectorSort {
  field: string;
  order: SortOrder;
}

export type SectorInput = Partial<ISectorSchema> & {
  category?: string[] | undefined;
  solution?: string[] | undefined;
};

export interface SectorRepository {
  addManySectors: (sectors: Partial<ISectorSchema>[]) => Promise<ISectorSchema[]>;
  activateSector: (id: string) => Promise<ISectorSchema | null>;
  deactivateSector: (id: string) => Promise<ISectorSchema | null>;
  saveSector: (sector: SectorInput) => Promise<ISectorSchema | null>;
  getSectorById: (id: string) => Promise<ISectorSchema | null>;
  getSectorBySlug: (slug: string) => Promise<ISectorSchema | null>;
  getAllSectors: (
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: SectorFilter,
    sort: SectorSort,
  ) => Promise<{
    sectors: ISectorSchema[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }>;
  updateSector: (id: string, update: SectorInput) => Promise<ISectorSchema | null>;
  removeSector: (id: string) => Promise<ISectorSchema | null>;
  removeCategoryFromSector: (sectorId: string, categoryId: string) => Promise<ISectorSchema | null>;
  addCategoryFromSector: (sectorId: string, categoryId: string) => Promise<ISectorSchema | null>;
  removeCategoriesFromSector: (sectorId: string, categoryIds: string[]) => Promise<ISectorSchema | null>;
  addCategoriesFromSector: (sectorId: string, categoryIds: string[]) => Promise<ISectorSchema | null>;
  removeSolutionFromSector: (sectorId: string, solutionId: string) => Promise<ISectorSchema | null>;
  addSolutionFromSector: (sectorId: string, solutionId: string) => Promise<ISectorSchema | null>;
  removeSolutionsFromSector: (sectorId: string, solutionIds: string[]) => Promise<ISectorSchema | null>;
  addSolutionsFromSector: (sectorId: string, solutionIds: string[]) => Promise<ISectorSchema | null>;
  deleteManySectors: (ids: string[]) => Promise<DeleteResult>;
  deleteAllSectors: () => Promise<DeleteResult>;
}

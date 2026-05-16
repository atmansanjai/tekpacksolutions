import { type IAdminSchema } from '../model/AdminSchema.js';
import type { DeleteResult } from 'mongoose';

export interface AdminFilter {
  search?: string;
  isActive?: boolean;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface AdminSort {
  field: string;
  order: SortOrder;
}

export interface AdminRepository {
  addManyAdmins: (admins: Partial<IAdminSchema>[]) => Promise<IAdminSchema[]>;
  activateAdmin: (id: string) => Promise<IAdminSchema | null>;
  deactivateAdmin: (id: string) => Promise<IAdminSchema | null>;
  saveAdmin: (admin: Partial<IAdminSchema>) => Promise<IAdminSchema | null>;
  getAdmin: (email: string) => Promise<IAdminSchema | null>;
  getAdminById: (id: string) => Promise<IAdminSchema | null>;
  getAdminBySlug: (slug: string) => Promise<IAdminSchema | null>;
  getAdminByEmail: (email: string) => Promise<IAdminSchema | null>;
  getAllAdmins: (
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: AdminFilter,
    sort: AdminSort,
  ) => Promise<{
    admins: IAdminSchema[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string | null;
      endCursor: string | null;
      totalCount: number;
    };
  }>;
  updateAdmin: (email: string, update: Partial<IAdminSchema>) => Promise<IAdminSchema | null>;
  removeAdmin: (email: string) => Promise<IAdminSchema | null>;
  deleteManyAdmin: (ids: string[]) => Promise<DeleteResult>;
  deleteAllAdmins: () => Promise<DeleteResult>;
}

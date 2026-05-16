import type { AdminFilter, AdminRepository, AdminSort } from '../Repository/AdminRepository.js';
import { AdminRole, type IAdminSchema } from '../model/AdminSchema.js';
import { type DeleteResult, type Model, type QueryFilter, type SortOrder, Types } from 'mongoose';

class AdminDatabase implements AdminRepository {
  private adminModel: Model<IAdminSchema>;

  constructor(adminModel: Model<IAdminSchema>) {
    this.adminModel = adminModel;
  }

  getAdminByEmail(email: string): Promise<IAdminSchema | null> {
    return this.adminModel.findOne({ email }).lean();
  }

  async activateAdmin(id: string): Promise<IAdminSchema | null> {
    return this.adminModel.findByIdAndUpdate(id, { isActive: true }, { new: true }).lean();
  }

  async deactivateAdmin(id: string): Promise<IAdminSchema | null> {
    return this.adminModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  }

  async deleteManyAdmin(ids: string[]): Promise<DeleteResult> {
    return this.adminModel.deleteMany({ _id: { $in: ids } });
  }

  async addManyAdmins(admins: Partial<IAdminSchema>[]): Promise<IAdminSchema[]> {
    const docs = await this.adminModel.create(admins);
    return docs.map((doc) => doc.toObject());
  }

  deleteAllAdmins(): Promise<DeleteResult> {
    return this.adminModel.deleteMany({
      role: { $ne: AdminRole.ADMIN },
    });
  }

  async getAdmin(email: string): Promise<IAdminSchema | null> {
    return this.adminModel.findOne({ email }).lean();
  }

  async getAdminById(id: string): Promise<IAdminSchema | null> {
    return this.adminModel.findById(id).lean();
  }

  async getAdminBySlug(slug: string): Promise<IAdminSchema | null> {
    return this.adminModel.findOne({ slug }).lean();
  }

  async getAllAdmins(
    first: number,
    after: string | null,
    last: number,
    before: string | null,
    filter: AdminFilter,
    sort: AdminSort,
  ): Promise<{
    admins: IAdminSchema[];

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
    const filterQuery: QueryFilter<IAdminSchema> = {};

    if (filter) {
      if (filter.search) {
          filterQuery.email = {
            $regex: filter.search,
            $options: 'i',
          };
      }
      if (filter.isActive !== undefined){
        filterQuery.isActive = filter.isActive;
      }
    }

  // pagination
    const paginationQuery: QueryFilter<IAdminSchema> = {
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

    const query = this.adminModel.find(paginationQuery).sort(sortQuery);
    if (hasLimit) {
      query.limit(limit + 1);
    }

    const [admins, totalCount] = await Promise.all([
      await query.lean().exec() as unknown as IAdminSchema[],
      /** IMPORTANT: totalCount should NOT use paginationQuery */
      this.adminModel.countDocuments(filterQuery),
    ]);


    let hasNextPage = false;
    let hasPreviousPage = false;


    if (hasLimit) {
      if (isForwardPagination) {
        hasNextPage = admins.length > limit;

        if (hasNextPage) {
          admins.pop();
        }

        hasPreviousPage = Boolean(after);
      } else {

        hasPreviousPage = admins.length > limit;

        if (hasPreviousPage) {
          admins.pop();
        }

        admins.reverse();

        hasNextPage = Boolean(before);
      }
    }


    const startCursor = admins.length > 0 ? admins[0]!._id.toString() : null;

    const endCursor = admins.length > 0 ? admins[admins.length - 1]!._id.toString() : null;

    return {
      admins,

      pageInfo: {
        hasNextPage,

        hasPreviousPage,

        startCursor,

        endCursor,

        totalCount,
      },
    };
  }

  async removeAdmin(email: string): Promise<IAdminSchema | null> {
    return this.adminModel.findOneAndDelete({ email }).lean();
  }

  async saveAdmin(admin: Partial<IAdminSchema>): Promise<IAdminSchema | null> {
    return this.adminModel.create(admin);
  }

  async updateAdmin(email: string, update: Partial<IAdminSchema>): Promise<IAdminSchema | null> {
    return this.adminModel
      .findOneAndUpdate(
        { email },
        { $set: update },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean();
  }
}

export default AdminDatabase;

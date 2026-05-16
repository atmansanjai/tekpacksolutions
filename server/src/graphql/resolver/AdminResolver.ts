import { handle } from '../helper/handle.js';
import type { Context } from '../context/Context.js';
import { GraphQLError } from 'graphql';
import { decodeGlobalId, encodeGlobalId } from '../helper/globalId.js';
import type { IAdminSchema } from '../../model/AdminSchema.js';

export const adminResolver = {
  DateTime: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => ast.value,
  },

  EmailAddress: {
    serialize: (value: any) => value,
    parseValue: (value: any) => value,
    parseLiteral: (ast: any) => ast.value,
  },

  Query: {
    me: async (_parent: any, _args: any, { id, adminRepo }: Context) => {
      if (!id) throw new GraphQLError('Unauthorized', { extensions: { code: 'UNAUTHORIZED' } });

      const { decodedId } = decodeGlobalId(id);
      return await adminRepo.getAdminById(decodedId);
    },

    adminByEmail: async (_parent: any, { email }: { email: string }, { adminRepo }: Context) => {
      return await adminRepo.getAdminByEmail(email);
    },

    adminById: (_parent: any, { id }: { id: string }, { adminRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return adminRepo.getAdminById(decodedId);
    },

    adminBySlug: async (_parent: any, { slug }: { slug: string }, { adminRepo }: Context) => {
      return await adminRepo.getAdminBySlug(slug);
    },

    admins: async (_parent: any, args: any, { adminRepo }: Context) => {
      const input = args.adminConnectionInput;
      const afterId = input.after ? decodeGlobalId(input.after).decodedId : null;
      const beforeId = input.before ? decodeGlobalId(input.before).decodedId : null;
      const { admins, pageInfo } = await adminRepo.getAllAdmins(
        input.first,
        afterId,
        input.last,
        beforeId,
        input.filter,
        input.sort,
      );
      return {
        edges: admins.map((admin: IAdminSchema) => ({
          cursor: encodeGlobalId('Admin', admin._id.toString()),
          node: admin,
        })),
        pageInfo: {
          startCursor: pageInfo.startCursor ? encodeGlobalId('Admin', pageInfo.startCursor) : null,
          endCursor: pageInfo.endCursor ? encodeGlobalId('Admin', pageInfo.endCursor) : null,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          totalCount: pageInfo.totalCount,
        },
        admins: admins,
      };
    },
  },

  Mutation: {
    saveAdmin: (_parent: any, { input }: any, { adminRepo }: Context) =>
      handle(adminRepo.saveAdmin(input), 'Failed to save admin'),

    updateAdmin: (_parent: any, { id, input }: any, { adminRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(adminRepo.updateAdmin(decodedId, input), 'Update failed: Admin not found');
    },

    removeAdmin: (_parent: any, { id }: any, { adminRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(adminRepo.removeAdmin(decodedId), 'Delete failed: Admin not found');
    },

    activateAdmin: (_parent: any, { id }: any, { adminRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(adminRepo.activateAdmin(decodedId), 'Activation failed');
    },

    deactivateAdmin: (_parent: any, { id }: any, { adminRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(adminRepo.deactivateAdmin(decodedId), 'Deactivation failed');
    },
  },

  Admin: {
    id: (parent: any) => {
      const dbId = parent._id?.toString() || parent.id;
      return encodeGlobalId('Admin', dbId);
    },
    __typename: () => 'Admin',
  },
};

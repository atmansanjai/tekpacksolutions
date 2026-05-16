import type { GraphQLResolveInfo } from 'graphql/type/index.js';
import { decodeGlobalId } from '../helper/globalId.js';
import type { Context } from '../context/Context.js';
import { handle } from '../helper/handle.js';

export const nodeResolvers = {
  Node: {
    __resolveType(obj: any) {
      return obj.__typename || null;
    },
  },
  Query: {
    node: async (_parent: any, args: { id: string }, context: Context, _info: GraphQLResolveInfo): Promise<any> => {
      const { __typeName, decodedId } = decodeGlobalId(args.id);
      switch (__typeName) {
        case 'Admin': {
          const adminById = await handle(context.adminRepo.getAdminById(decodedId), `Admin ${args.id} not found`);
          return { ...adminById, __typename: 'Admin' };
        }
        case 'Category': {
          const categoryById = await handle(
            context.categoryRepo.getCategoryById(decodedId),
            `Category ${args.id} not found`,
          );
          return { ...categoryById, __typename: 'Category' };
        }
        case 'Sector': {
          const sectorById = await handle(context.sectorRepo.getSectorById(decodedId), `Sector ${args.id} not found`);
          return { ...sectorById, __typename: 'Sector' };
        }
        case 'Solution': {
          const solutionById = await handle(
            context.solutionRepo.getSolutionById(decodedId),
            `Solution ${args.id} not found`,
          );
          return { ...solutionById, __typename: 'Solution' };
        }
        case 'Machine': {
          const machineById = await handle(context.machineRepo.getMachineById(decodedId), `Machine ${args.id} not found`);
          return { ...machineById, __typename: 'Machine' };
        }
        default:
          return null;
      }
    },
  },
};

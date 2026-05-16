import type { Context } from '../context/Context.js';
import { decodeGlobalId, encodeGlobalId } from '../helper/globalId.js';
import type { ISectorSchema } from '../../model/SectorSchema.js';
import { handle } from '../helper/handle.js';
import { decodeRelationshipInput } from '../helper/decodeRelationshipInput.js';
import mongoose from 'mongoose';

export const SectorResolver = {
  Query: {
    sectorById: (_parent: any, { id }: { id: string }, { sectorRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return sectorRepo.getSectorById(decodedId);
    },

    sectorBySlug: async (_parent: any, { slug }: { slug: string }, { sectorRepo }: Context) => {
      return await sectorRepo.getSectorBySlug(slug);
    },

    sectors: async (_parent: any, args: any, { sectorRepo }: Context) => {
      const input = args.sectorConnectionInput;
      const afterId = input.after ? decodeGlobalId(input.after).decodedId : null;
      const beforeId = input.before ? decodeGlobalId(input.before).decodedId : null;
      const { sectors, pageInfo } = await sectorRepo.getAllSectors(
        input.first,
        afterId,
        input.last,
        beforeId,
        input.filter,
        input.sort,
      );
      return {
        edges: sectors.map((sector: ISectorSchema) => ({
          cursor: encodeGlobalId('Sector', sector._id.toString()),
          node: sector,
        })),
        pageInfo: {
          startCursor: pageInfo.startCursor ? encodeGlobalId('Sector', pageInfo.startCursor) : null,
          endCursor: pageInfo.endCursor ? encodeGlobalId('Sector', pageInfo.endCursor) : null,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          totalCount: pageInfo.totalCount,
        },
        sectors: sectors,
      };
    },
  },

  Mutation: {
    saveSector: (_parent: any, { input, sectorInput }: any, { sectorRepo }: Context) =>
      handle(sectorRepo.saveSector(decodeRelationshipInput(input ?? sectorInput)), 'Failed to save Sector'),

    updateSector: (_parent: any, { id, input, sectorInput }: any, { sectorRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(
        sectorRepo.updateSector(decodedId, decodeRelationshipInput(input ?? sectorInput)),
        'Update failed: Sector not found',
      );
    },

    removeSector: (_parent: any, { id }: any, { sectorRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(sectorRepo.removeSector(decodedId), 'Delete failed: Sector not found');
    },

    activateSector: (_parent: any, { id }: any, { sectorRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(sectorRepo.activateSector(decodedId), 'Activation failed');
    },

    deactivateSector: (_parent: any, { id }: any, { sectorRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(sectorRepo.deactivateSector(decodedId), 'Deactivation failed');
    },

    removeCategoryFromSector: (_parent: any, { sectorId, categoryId }: any, { sectorRepo }: Context) => {
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      return handle(
        sectorRepo.removeCategoryFromSector(decodedSectorId, decodedCategoryId),
        'Remove category from Sector failed',
      );
    },

    addCategoryFromSector: (_parent: any, { sectorId, categoryId }: any, { sectorRepo }: Context) => {
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      return handle(
        sectorRepo.addCategoryFromSector(decodedSectorId, decodedCategoryId),
        'Add category from Sector failed',
      );
    },

    removeSolutionFromSector: (_parent: any, { sectorId, solutionId }: any, { sectorRepo }: Context) => {
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      return handle(
        sectorRepo.removeSolutionFromSector(decodedSectorId, decodedSolutionId),
        'Remove solution from Sector failed',
      );
    },

    addSolutionFromSector: (_parent: any, { sectorId, solutionId }: any, { sectorRepo }: Context) => {
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      return handle(
        sectorRepo.addSolutionFromSector(decodedSectorId, decodedSolutionId),
        'Add solution from Sector failed',
      );
    },
  },

  Sector: {
    id: (parent: any) => {
      const rawId = parent._id || parent.id;
      if (!rawId) {
        throw new Error(`Sector.id missing. Received: ${JSON.stringify(parent)}`);
      }
      return encodeGlobalId('Sector', rawId.toString());
    },
    category: (parent: any) => {
      const sectorId = parent._id.toString();
      return mongoose.model('Category').find({ sector: sectorId }).lean().exec();
    },
    solution: (parent: any) => {
      const sectorId = parent._id.toString();
      return mongoose.model('Solution').find({ sector: sectorId }).lean().exec();
    },
    __typename: () => 'Sector',
  },
};

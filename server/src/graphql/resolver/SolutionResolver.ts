import type { Context } from '../context/Context.js';
import { decodeGlobalId, encodeGlobalId } from '../helper/globalId.js';
import { handle } from '../helper/handle.js';
import type { ISolutionSchema } from '../../model/SolutionSchema.js';
import { decodeRelationshipInput } from '../helper/decodeRelationshipInput.js';
import mongoose from 'mongoose';

export const SolutionResolver = {
  Query: {
    solutionById: (_parent: any, { id }: { id: string }, { solutionRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return solutionRepo.getSolutionById(decodedId);
    },

    solutionBySlug: async (_parent: any, { slug }: { slug: string }, { solutionRepo }: Context) => {
      return await solutionRepo.getSolutionBySlug(slug);
    },

    solutions: async (_parent: any, args: any, { solutionRepo }: Context) => {
      const input = args.solutionConnectionInput;
      const afterId = input.after ? decodeGlobalId(input.after).decodedId : null;
      const beforeId = input.before ? decodeGlobalId(input.before).decodedId : null;
      const { solutions, pageInfo } = await solutionRepo.getAllSolutions(
        input.first,
        afterId,
        input.last,
        beforeId,
        input.filter,
        input.sort,
      );

      return {
        edges: solutions.map((solution: ISolutionSchema) => ({
          cursor: encodeGlobalId('Solution', solution._id.toString()),
          node: solution,
        })),
        pageInfo: {
          startCursor: pageInfo.startCursor ? encodeGlobalId('Solution', pageInfo.startCursor) : null,
          endCursor: pageInfo.endCursor ? encodeGlobalId('Solution', pageInfo.endCursor) : null,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          totalCount: pageInfo.totalCount,
        },
        solutions,
      };
    },
  },

  Mutation: {
    saveSolution: (_parent: any, args: any, { solutionRepo }: Context) =>
      handle(
        solutionRepo.saveSolution(decodeRelationshipInput(args.input ?? args.solutionInput)),
        'Failed to save Solution',
      ),

    updateSolution: (_parent: any, { id, input, solutionInput }: any, { solutionRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(
        solutionRepo.updateSolution(decodedId, decodeRelationshipInput(input ?? solutionInput)),
        'Update failed: Solution not found',
      );
    },

    removeSolution: (_parent: any, { id }: any, { solutionRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(solutionRepo.removeSolution(decodedId), 'Delete failed: Solution not found');
    },

    activateSolution: (_parent: any, { id }: any, { solutionRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(solutionRepo.activateSolution(decodedId), 'Activation failed');
    },

    deactivateSolution: (_parent: any, { id }: any, { solutionRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(solutionRepo.deactivateSolution(decodedId), 'Deactivation failed');
    },

    removeMachineFromSolution: (_parent: any, { solutionId, machineId }: any, { solutionRepo }: Context) => {
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      return handle(
        solutionRepo.removeMachineFromSolution(decodedSolutionId, decodedMachineId),
        'Remove machine from Solution failed',
      );
    },

    addMachineFromSolution: (_parent: any, { solutionId, machineId }: any, { solutionRepo }: Context) => {
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      return handle(
        solutionRepo.addMachineFromSolution(decodedSolutionId, decodedMachineId),
        'Add machine from Solution failed',
      );
    },

    removeSectorFromSolution: (_parent: any, { solutionId, sectorId }: any, { solutionRepo }: Context) => {
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      return handle(
        solutionRepo.removeSectorFromSolution(decodedSolutionId, decodedSectorId),
        'Remove sector from Solution failed',
      );
    },

    addSectorFromSolution: (_parent: any, { solutionId, sectorId }: any, { solutionRepo }: Context) => {
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      return handle(
        solutionRepo.addSectorFromSolution(decodedSolutionId, decodedSectorId),
        'Add sector from Solution failed',
      );
    },
  },

  Solution: {
    id: (parent: any) => {
      const rawId = parent._id || parent.id;
      if (!rawId) {
        throw new Error(`Solution.id missing. Received: ${JSON.stringify(parent)}`);
      }
      return encodeGlobalId('Solution', rawId.toString());
    },
    sector: (parent: any) =>
      mongoose
        .model('Sector')
        .find({ _id: { $in: parent.sector ?? [] } })
        .lean(),
    machine: (parent: any) => {
      const solutionId = parent._id.toString();
      return mongoose.model('Machine').find({ solution: solutionId }).lean();
    },
    __typename: () => 'Solution',
  },
};

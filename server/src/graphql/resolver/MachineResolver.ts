import type { Context } from '../context/Context.js';
import { decodeGlobalId, encodeGlobalId } from '../helper/globalId.js';
import { handle } from '../helper/handle.js';
import type { IMachineSchema } from '../../model/MachineSchema.js';
import { decodeRelationshipInput } from '../helper/decodeRelationshipInput.js';
import mongoose from 'mongoose';

export const MachineResolver = {
  Query: {
    machineById: (_parent: any, { id }: { id: string }, { machineRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return machineRepo.getMachineById(decodedId);
    },

    machineBySlug: async (_parent: any, { slug }: { slug: string }, { machineRepo }: Context) => {
      return await machineRepo.getMachineBySlug(slug);
    },

    machines: async (_parent: any, args: any, { machineRepo }: Context) => {
      const input = args.machineConnectionInput;
      const afterId = input.after ? decodeGlobalId(input.after).decodedId : null;
      const beforeId = input.before ? decodeGlobalId(input.before).decodedId : null;
      const { machines, pageInfo } = await machineRepo.getAllMachines(
        input.first,
        afterId,
        input.last,
        beforeId,
        input.filter,
        input.sort,
      );

      return {
        edges: machines.map((machine: IMachineSchema) => ({
          cursor: encodeGlobalId('Machine', machine._id.toString()),
          node: machine,
        })),
        pageInfo: {
          startCursor: pageInfo.startCursor ? encodeGlobalId('Machine', pageInfo.startCursor) : null,
          endCursor: pageInfo.endCursor ? encodeGlobalId('Machine', pageInfo.endCursor) : null,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          totalCount: pageInfo.totalCount,
        },
        machines,
      };
    },
  },

  Mutation: {
    saveMachine: (_parent: any, args: any, { machineRepo }: Context) =>
      handle(machineRepo.saveMachine(decodeRelationshipInput(args.input ?? args.machineInput)), 'Failed to save Machine'),

    updateMachine: (_parent: any, { id, input, machineInput }: any, { machineRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(
        machineRepo.updateMachine(decodedId, decodeRelationshipInput(input ?? machineInput)),
        'Update failed: Machine not found',
      );
    },

    removeMachine: (_parent: any, { id }: any, { machineRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(machineRepo.removeMachine(decodedId), 'Delete failed: Machine not found');
    },

    activateMachine: (_parent: any, { id }: any, { machineRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(machineRepo.activateMachine(decodedId), 'Activation failed');
    },

    deactivateMachine: (_parent: any, { id }: any, { machineRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(machineRepo.deactivateMachine(decodedId), 'Deactivation failed');
    },

    removeSolutionFromMachine: (_parent: any, { machineId, solutionId }: any, { machineRepo }: Context) => {
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      return handle(
        machineRepo.removeSolutionFromMachine(decodedMachineId, decodedSolutionId),
        'Remove solution from Machine failed',
      );
    },

    addSolutionFromMachine: (_parent: any, { machineId, solutionId }: any, { machineRepo }: Context) => {
      const { decodedId: decodedSolutionId } = decodeGlobalId(solutionId);
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      return handle(
        machineRepo.addSolutionFromMachine(decodedMachineId, decodedSolutionId),
        'Add solution from Machine failed',
      );
    },

    removeCategoryFromMachine: (_parent: any, { machineId, categoryId }: any, { machineRepo }: Context) => {
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      return handle(
        machineRepo.removeCategoryFromMachine(decodedMachineId, decodedCategoryId),
        'Remove category from Machine failed',
      );
    },

    addCategoryFromMachine: (_parent: any, { machineId, categoryId }: any, { machineRepo }: Context) => {
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      return handle(
        machineRepo.addCategoryFromMachine(decodedMachineId, decodedCategoryId),
        'Add category from Machine failed',
      );
    },
  },

  Machine: {
    id: (parent: any) => {
      const rawId = parent._id || parent.id;
      if (!rawId) {
        throw new Error(`Machine.id missing. Received: ${JSON.stringify(parent)}`);
      }
      return encodeGlobalId('Machine', rawId.toString());
    },
    specification: (parent: any) => parent.spec,
    category: (parent: any) => mongoose.model('Category').find({ _id: { $in: parent.category ?? [] } }).lean(),
    solution: (parent: any) => mongoose.model('Solution').find({ _id: { $in: parent.solution ?? [] } }).lean(),
    __typename: () => 'Machine',
  },
};

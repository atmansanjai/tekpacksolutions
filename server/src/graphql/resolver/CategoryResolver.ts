import type { Context } from '../context/Context.js';
import { decodeGlobalId, encodeGlobalId } from '../helper/globalId.js';
import type { ICategorySchema } from '../../model/CategorySchema.js';
import { handle } from '../helper/handle.js';
import { decodeRelationshipInput } from '../helper/decodeRelationshipInput.js';
import mongoose from 'mongoose';

export const CategoryResolver = {
  Query: {
    categoryById: (_parent: any, { id }: { id: string }, { categoryRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return categoryRepo.getCategoryById(decodedId);
    },

    categoryBySlug: async (_parent: any, { slug }: { slug: string }, { categoryRepo }: Context) => {
      return await categoryRepo.getCategoryBySlug(slug);
    },

    categories: async (_parent: any, args: any, { categoryRepo }: Context) => {
      const input = args.categoryConnectionInput;
      const afterId = input.after ? decodeGlobalId(input.after).decodedId : null;
      const beforeId = input.before ? decodeGlobalId(input.before).decodedId : null;
      const { categories, pageInfo } = await categoryRepo.getAllCategories(
        input.first,
        afterId,
        input.last,
        beforeId,
        input.filter,
        input.sort,
      );
      return {
        edges: categories.map((Category: ICategorySchema) => ({
          cursor: encodeGlobalId('Category', Category._id.toString()),
          node: Category,
        })),
        pageInfo: {
          startCursor: pageInfo.startCursor ? encodeGlobalId('Category', pageInfo.startCursor) : null,
          endCursor: pageInfo.endCursor ? encodeGlobalId('Category', pageInfo.endCursor) : null,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          totalCount: pageInfo.totalCount,
        },
        categories: categories,
      };
    },
  },

  Mutation: {
    saveCategory: (_parent: any, { input, categoryInput }: any, { categoryRepo }: Context) =>
      handle(categoryRepo.saveCategory(decodeRelationshipInput(input ?? categoryInput)), 'Failed to save Category'),

    updateCategory: (_parent: any, { id, input, categoryInput }: any, { categoryRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(
        categoryRepo.updateCategory(decodedId, decodeRelationshipInput(input ?? categoryInput)),
        'Update failed: Category not found',
      );
    },

    removeCategory: (_parent: any, { id }: any, { categoryRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(categoryRepo.removeCategory(decodedId), 'Delete failed: Category not found');
    },

    activateCategory: (_parent: any, { id }: any, { categoryRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(categoryRepo.activateCategory(decodedId), 'Activation failed');
    },

    deactivateCategory: (_parent: any, { id }: any, { categoryRepo }: Context) => {
      const { decodedId } = decodeGlobalId(id);
      return handle(categoryRepo.deactivateCategory(decodedId), 'Deactivation failed');
    },

    removeMachineFromCategory: (_parent: any, { categoryId, machineId }: any, { categoryRepo }: Context) => {
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      return handle(
        categoryRepo.removeMachineFromCategory(decodedCategoryId, decodedMachineId),
        'Remove machine from Category failed',
      );
    },

    addMachineFromCategory: (_parent: any, { categoryId, machineId }: any, { categoryRepo }: Context) => {
      const { decodedId: decodedMachineId } = decodeGlobalId(machineId);
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      return handle(
        categoryRepo.addMachineFromCategory(decodedCategoryId, decodedMachineId),
        'Add machine from Category failed',
      );
    },

    removeSectorFromCategory: (_parent: any, { categoryId, sectorId }: any, { categoryRepo }: Context) => {
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      return handle(
        categoryRepo.removeSectorFromCategory(decodedCategoryId, decodedSectorId),
        'Remove sector from Category failed',
      );
    },

    addSectorFromCategory: (_parent: any, { categoryId, sectorId }: any, { categoryRepo }: Context) => {
      const { decodedId: decodedSectorId } = decodeGlobalId(sectorId);
      const { decodedId: decodedCategoryId } = decodeGlobalId(categoryId);
      return handle(
        categoryRepo.addSectorFromCategory(decodedCategoryId, decodedSectorId),
        'Add sector from Category failed',
      );
    },
  },

  Category: {
    id: (parent: any) => {
      const dbId = parent._id?.toString() || parent.id;
      return encodeGlobalId('Category', dbId);
    },
    sector: (parent: any) =>
      mongoose
        .model('Sector')
        .find({ _id: { $in: parent.sector ?? [] } })
        .lean(),
    machine: (parent: any) => {
      const categoryId = parent._id.toString();
      return mongoose.model('Machine').find({ category: categoryId }).lean();
    },
    __typename: () => 'Category',
  },
};

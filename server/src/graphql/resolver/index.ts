import { adminResolver } from './AdminResolver.js';
import { nodeResolvers } from './NodeResolver.js';
import { mergeResolvers } from '@graphql-tools/merge';
import { SectorResolver } from './SectorResolver.js';
import { CategoryResolver } from './CategoryResolver.js';
import { MachineResolver } from './MachineResolver.js';
import { SolutionResolver } from './SolutionResolver.js';

export const resolvers = mergeResolvers([
  nodeResolvers,
  adminResolver,
  SectorResolver,
  CategoryResolver,
  MachineResolver,
  SolutionResolver,
]);

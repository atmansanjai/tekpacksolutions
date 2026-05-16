import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import type { IAdminSchema } from '../../model/AdminSchema.js';

export function authDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (authDirective) {
        const { role: requiredRole } = authDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          const user: Partial<IAdminSchema> = context.user;

          if (!user) {
            throw new Error('Access Denied. Authentication required');
          }

          if (requiredRole && user.role !== requiredRole) {
            throw new Error(`Access Denied. Required role: ${requiredRole}`);
          }
          return resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}

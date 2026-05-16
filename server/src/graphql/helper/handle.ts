// helper/handle.ts
import { GraphQLError } from 'graphql';

export async function handle<T>(
  promise: Promise<T | null | undefined>,
  errorMsg: string = 'Resource not found',
  errorCode: string = 'NOT_FOUND',
): Promise<T> {
  try {
    const result = await promise;
    if (!result) {
      throw new GraphQLError(errorMsg, {
        extensions: { code: errorCode, http: { status: 404 } },
      });
    }
    return result;
  } catch (error: any) {
    // If it's already a GraphQLError we threw above, just rethrow it
    if (error instanceof GraphQLError) throw error;

    // Handle MongoDB Specific Errors
    if (error.name === 'CastError') {
      // Invalid ObjectId format
      throw new GraphQLError(`Invalid ID format: ${error.value}`, {
        extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } },
      });
    }
    if (error.code === 11000) {
      // Duplicate Key (e.g. unique email)
      throw new GraphQLError('A record with this unique value already exists.', {
        extensions: { code: 'CONFLICT', http: { status: 409 } },
      });
    }

    // Generic fallback for actual crashes
    throw new GraphQLError('Internal Server Error', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', detail: error.message },
    });
  }
}

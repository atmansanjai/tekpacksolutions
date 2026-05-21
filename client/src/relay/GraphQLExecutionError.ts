export class GraphQLExecutionError extends Error {
  public graphQLErrors: any[];
  constructor(errors: any[]) {
    super(`GraphQL Execution failed with ${errors.length} error(s).`);
    this.name = "GraphQLExecutionError";
    this.graphQLErrors = errors;
  }
}

import { decodeGlobalId } from './globalId.js';

type RelationshipInput = Record<string, unknown>;

const relationshipFields = ['category', 'sector', 'solution', 'machine'];

export const decodeRelationshipInput = <TInput extends RelationshipInput>(input: TInput): TInput => {
  const decodedInput: RelationshipInput = { ...input };

  for (const field of relationshipFields) {
    const value = decodedInput[field];

    if (Array.isArray(value)) {
      decodedInput[field] = value.map((id) => decodeGlobalId(String(id)).decodedId);
    }
  }

  return decodedInput as TInput;
};

export type SupportedType = 'Admin' | 'Category' | 'Sector' | 'Solution' | 'Machine';

/** Encodes a database ID into a Relay Global ID */
export const encodeGlobalId = (__typeName: SupportedType, encodeId: string): string => {
  return Buffer.from(`${__typeName}:${encodeId}`).toString('base64');
};

/** Decodes a Relay Global ID back into its Type and Database ID */
export const decodeGlobalId = (globalId: string): { __typeName: string; decodedId: string } => {
  const decoded = Buffer.from(globalId, 'base64').toString('utf-8');
  const [__typeName, decodedId] = decoded.split(':');

  if (!__typeName || !decodedId) {
    throw new Error('Invalid Global ID format');
  }

  return { __typeName, decodedId };
};

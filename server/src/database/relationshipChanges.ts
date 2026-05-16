export interface RelationshipChanges {
  idsToAdd: string[];
  idsToRemove: string[];
}

export const getRelationshipChanges = (currentIds: string[], nextIds?: string[]): RelationshipChanges | null => {
  if (!nextIds) {
    return null;
  }

  const uniqueCurrentIds = [...new Set(currentIds.map((id) => id.toString()))];
  const uniqueNextIds = [...new Set(nextIds.map((id) => id.toString()))];
  const currentIdSet = new Set(uniqueCurrentIds);
  const nextIdSet = new Set(uniqueNextIds);

  return {
    idsToAdd: uniqueNextIds.filter((id) => !currentIdSet.has(id)),
    idsToRemove: uniqueCurrentIds.filter((id) => !nextIdSet.has(id)),
  };
};

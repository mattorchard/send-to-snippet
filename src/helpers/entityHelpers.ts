import { Entity, EntityId, Updateable, Upsertable } from "../types/Domain";
import { createId } from "./idHelpers";

export const deleteEntity = <T extends Entity>(
  entities: T[],
  idToDelete: EntityId
) => entities.filter((entity) => entity.id !== idToDelete);

const insertEntity = <T extends Entity>(
  entities: T[],
  entityToInsert: Upsertable<T>
): T[] => [
  {
    id: createId(),
    createdAt: new Date(),
    ...entityToInsert,
    updatedAt: new Date(),
  } as T,
  ...entities,
];

const updateEntity = <T extends Entity>(
  entities: T[],
  entityToUpdate: Updateable<T>
): T[] =>
  entities.map((entity) =>
    entity.id === entityToUpdate.id
      ? { ...entity, ...entityToUpdate, updatedAt: new Date() }
      : entity
  );

export const upsertEntity = <T extends Entity>(
  entities: T[],
  entityToUpsert: Upsertable<T>
): T[] =>
  entityToUpsert.id
    ? updateEntity(entities, entityToUpsert as Updateable<T>)
    : insertEntity(entities, entityToUpsert);

export const bulkUpsert = <T extends Entity>(
  entities: T[],
  entityPatches: Upsertable<T>[]
) => {
  let newEntities = entities;
  for (const patch of entityPatches) {
    newEntities = upsertEntity(newEntities, patch);
  }
  return newEntities;
};

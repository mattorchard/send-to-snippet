import { useMemo, useState } from "preact/hooks";

interface Entity {
  id: string;
}

export const useSelectedEntity = <T extends Entity>(entities: T[] | null) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => entities?.find((entity) => entity.id === selectedId) ?? null,
    [selectedId, entities]
  );
  return [selected, setSelectedId] as const;
};

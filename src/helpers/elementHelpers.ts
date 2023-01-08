export const closestElement = (
  node: EventTarget | null | undefined,
  query: string
) => {
  if (!node) return null;
  if (node instanceof Element) return node.closest(query);
  if (node instanceof Node) return node.parentElement?.closest(query) ?? null;
  return null;
};

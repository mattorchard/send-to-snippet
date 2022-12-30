export const toRichJsonString = (data: unknown) =>
  JSON.stringify(data, richObjectReplacer, 2);

const richObjectReplacer = (key: string, value: unknown) => {
  if (value instanceof Map) {
    return { type: "[object Map]", value: Object.fromEntries(value.entries()) };
  }
  if (value instanceof Set) {
    return { type: "[object Set]", value: [...value] };
  }
  return value;
};

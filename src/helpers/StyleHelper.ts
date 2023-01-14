const appendModifier = (prefix: string, modifier: string) =>
  `${prefix}--${modifier}`;

export const bem = (
  prefix: string,
  modifiers: Array<string> | Record<string, any>,
  extras?: string
) => {
  const classList = [extras, prefix];
  if (Array.isArray(modifiers)) {
    for (const modifierName of modifiers) {
      classList.push(appendModifier(prefix, modifierName));
    }
  } else {
    for (const [modifierName, isModifierEnabled] of Object.entries(modifiers)) {
      if (isModifierEnabled)
        classList.push(appendModifier(prefix, modifierName));
    }
  }
  return classList.join(" ");
};

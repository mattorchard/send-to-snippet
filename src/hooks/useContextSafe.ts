import { Context } from "preact";
import { useContext } from "preact/hooks";

export const useContextSafe = <V>(context: Context<V | undefined>): V => {
  const value = useContext(context);
  if (value === undefined)
    throw new Error(`Cannot use ${context.displayName} outside of provider`);
  return value;
};

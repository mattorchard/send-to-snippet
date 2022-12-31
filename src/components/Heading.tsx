import { h, FunctionComponent } from "preact";
import { ValueOf } from "../types/UtilityTypes";
import { Box, BoxProps } from "./Box";

const levelToElement = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

export type HeadingLevel = keyof typeof levelToElement;

interface HeadingProps extends BoxProps<ValueOf<typeof levelToElement>> {
  level: HeadingLevel;
  visualLevel?: HeadingLevel;
}

export const Heading: FunctionComponent<HeadingProps> = ({
  level,
  visualLevel: explicitVisualLevel,
  ...boxProps
}) => {
  const asElement = levelToElement[level];
  const visualLevel = levelToElement[explicitVisualLevel ?? level];
  return (
    <Box
      {...boxProps}
      className={`${visualLevel} ${boxProps.className}`}
      as={asElement}
    />
  );
};

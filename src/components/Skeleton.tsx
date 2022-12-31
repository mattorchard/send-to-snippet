import { h, FunctionComponent } from "preact";
import { Box, BoxProps } from "./Box";

interface SkeletonProps extends BoxProps<"div"> {
  height?: number;
  label?: string;
}

export const Skeleton: FunctionComponent<SkeletonProps> = ({
  height = 1,
  label = "Loading",
  ...boxProps
}) => (
  <Box
    {...boxProps}
    className={`skeleton ${boxProps.className}`}
    style={{ ...boxProps.style, height: `${height}rem` }}
  >
    <span className="sr-only">{label}</span>
  </Box>
);

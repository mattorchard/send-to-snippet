import { h, FunctionComponent } from "preact";

const directionToAngle = {
  up: 360,
  right: 90,
  down: 180,
  left: 270,
} as const;

export const Triangle: FunctionComponent<{
  direction: keyof typeof directionToAngle;
}> = ({ direction }) => {
  const angle = directionToAngle[direction];

  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      className="triangle"
      style={{ "--triangle__angle": angle }}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
      ></path>
    </svg>
  );
};

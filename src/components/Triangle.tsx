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
      viewBox="0 0 100 100"
      className="triangle"
      style={{ "--triangle__angle": angle }}
    >
      <path
        d="M0,0 L50,86.6, L100,0"
        stroke="currentColor"
        fill="none"
        strokeWidth="10"
      />
    </svg>
  );
};

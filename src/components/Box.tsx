import { h, Ref, ComponentProps, JSX } from "preact";
import { forwardRef } from "preact/compat";

type PaddingType = JSX.CSSProperties["paddingTop"];
type MarginType = JSX.CSSProperties["marginTop"];

interface BoxOwnProps<E extends JSX.ElementType = JSX.ElementType> {
  as?: E;
  className?: string;
  alignItems?: JSX.CSSProperties["alignItems"];
  justifyContent?: JSX.CSSProperties["justifyContent"];
  flexDirection?: JSX.CSSProperties["flexDirection"];
  inline?: boolean;
  gap?: JSX.CSSProperties["gap"];
  flexGrow?: JSX.CSSProperties["flexGrow"];
  p?: PaddingType;
  px?: PaddingType;
  py?: PaddingType;
  pt?: PaddingType;
  pr?: PaddingType;
  pb?: PaddingType;
  pl?: PaddingType;
  m?: MarginType;
  mx?: MarginType;
  my?: MarginType;
  mt?: MarginType;
  mr?: MarginType;
  mb?: MarginType;
  ml?: MarginType;
  style?: JSX.CSSProperties;
}

export type BoxProps<E extends JSX.ElementType> = BoxOwnProps<E> &
  Omit<ComponentProps<E>, keyof BoxOwnProps>;

const defaultElement = "div";

const applySizingUnit = (value: PaddingType | MarginType) =>
  typeof value === "number" ? `${value}rem` : value;


export const Box: <E extends JSX.ElementType = typeof defaultElement>(
  props: BoxProps<E>
) => JSX.Element | null = forwardRef(
  (
    {
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      gap,
      flexGrow,
      inline,
      flexDirection,
      alignItems,
      justifyContent,
      style,
      className,
      as: As = "div",
      ...props
    }: BoxOwnProps,
    ref: Ref<Element>
  ) => {
    const combinedStyle = {
      marginTop: applySizingUnit(mt ?? my ?? m),
      marginRight: applySizingUnit(mr ?? mx ?? m),
      marginBottom: applySizingUnit(mb ?? my ?? m),
      marginLeft: applySizingUnit(ml ?? mx ?? m),
      paddingTop: applySizingUnit(pt ?? py ?? p),
      paddingRight: applySizingUnit(pr ?? px ?? p),
      paddingBottom: applySizingUnit(pb ?? py ?? p),
      paddingLeft: applySizingUnit(pl ?? px ?? p),
      gap: applySizingUnit(gap),
      flexGrow,
      display: inline ? "inline-flex" : "flex",
      flexDirection,
      alignItems,
      justifyContent,
      ...(typeof style === "object" ? style : undefined),
    };

    return (
      <As ref={ref} {...props} className={className} style={combinedStyle} />
    );
  }
);

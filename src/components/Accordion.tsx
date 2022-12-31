import { FunctionComponent, h, JSX } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { bem } from "../helpers/StyleHelper";
import { Renderable } from "../types/UtilityTypes";
import { Heading, HeadingLevel } from "./Heading";
import { Triangle } from "./Triangle";

interface AccordionProps<IdType> {
  headingLevel: HeadingLevel;
  sections: AccordionSectionDetails<IdType>[];
  expandedId: IdType | null;
  onChange: (expandedId: IdType) => void;
}

interface AccordionSectionDetails<IdType> {
  id: IdType;
  header: Renderable;
  content: Renderable;
}

export const Accordion: <IdType>(
  props: AccordionProps<IdType>
) => JSX.Element | null = ({
  sections,
  expandedId,
  headingLevel,
  onChange,
}) => (
  <div className="accordion">
    {sections.map((section) => {
      const isExpanded = section.id === expandedId;
      return (
        <section
          key={section.id}
          className={bem("accordion__section", {
            "is-expanded": isExpanded,
          })}
        >
          <Heading level={headingLevel} className="accordion__section__heading">
            <button
              type="button"
              className="accordion__section__heading__button"
              onClick={() => onChange(section.id)}
            >
              {section.header}
              <Triangle direction={isExpanded ? "down" : "up"} />
            </button>
          </Heading>
          <Inertable
            className="accordion__section__content"
            isInert={!isExpanded}
          >
            {section.content}
          </Inertable>
        </section>
      );
    })}
  </div>
);

const Inertable: FunctionComponent<{ className: string; isInert: boolean }> = ({
  className,
  isInert,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(undefined!);
  useLayoutEffect(() => {
    if (isInert) {
      ref.current.setAttribute("inert", "");
    } else {
      ref.current.removeAttribute("inert");
    }
  }, [isInert]);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

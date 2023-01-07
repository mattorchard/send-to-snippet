import { h, FunctionComponent } from "preact";
import { bem } from "../helpers/StyleHelper";
import { Renderable } from "../types/UtilityTypes";
interface OverlapperProps {
  sections: Array<{
    content: Renderable;
    isActive: boolean;
    key?: string | number;
  }>;
}

export const Overlapper: FunctionComponent<OverlapperProps> = ({
  sections,
}) => (
  <div className="overlapper">
    {sections.map(({ content, isActive, key }, index) => (
      <div
        key={key ?? index}
        className={bem(`overlapper__content`, { "is-active": isActive })}
      >
        {content}
      </div>
    ))}
  </div>
);

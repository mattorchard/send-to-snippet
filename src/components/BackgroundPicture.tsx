import { h, FunctionComponent } from "preact";
// @ts-ignore
import srcXl from "../assets/jr-korpa-xl.jpg";
// @ts-ignore
import srcLg from "../assets/jr-korpa-lg.jpg";
// @ts-ignore
import srcMd from "../assets/jr-korpa-md.jpg";
// @ts-ignore
import srcSm from "../assets/jr-korpa-sm.jpg";
import { memo } from "preact/compat";

export const BackgroundPicture: FunctionComponent = memo(() => {
  const srcSet = [
    `${srcXl} 6000w`,
    `${srcLg} 2400w`,
    `${srcMd} 1920w`,
    `${srcSm} 640w`,
  ].join();
  return (
    <picture className="background-picture" draggable={false}>
      <source srcset={srcSet} />
      <img src={srcMd} alt="" />
    </picture>
  );
});

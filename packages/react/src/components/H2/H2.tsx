import type { NButtonEmits, NButtonProps } from "@nuco/core";
import type { Props } from "../NucoWrapper";
import { NucoWrapper } from "../NucoWrapper";

type ElementType = HTMLHeadingElement;

// eslint-disable-next-line ts/no-empty-object-type
export const H2 = (props: Props<ElementType, {}, NButtonEmits>) => {
  return NucoWrapper<ElementType, NButtonProps, NButtonEmits>({ elementName: "n-h2", props });
};

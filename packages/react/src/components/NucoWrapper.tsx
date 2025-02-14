"use client";

import type { ElementNames } from "@nuco/core";
import type { JSX, ReactNode, SyntheticEvent } from "react";
import { resisterElement } from "@nuco/core";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { jsx as _jsx } from "react/jsx-runtime";

type Upper<T extends string> = `on${Capitalize<T>}`;

type EventHandlers<RefType extends HTMLElement, ElementEmits extends string | never> = {
  [K in Upper<ElementEmits>]?: (e: SyntheticEvent<RefType>) => void;
};

export type Props<RefType extends HTMLElement, ElementProps extends Record<string, unknown>, ElementEmits extends string> = ElementProps & EventHandlers<RefType, ElementEmits> & { children?: ReactNode | undefined };

type WrapperProps<RefType extends HTMLElement, ElementProps extends Record<string, unknown>, ElementEmits extends string> = {
  elementName: ElementNames;
  props: Props<RefType, ElementProps, ElementEmits>;
};

function splitProps<RefType extends HTMLElement, ElementProps extends Record<string, unknown>, ElementEmits extends string>(
  inputProps: Props<RefType, ElementProps, ElementEmits>,
) {
  const emits: EventHandlers<RefType, ElementEmits> = {};
  const props: ElementProps = {} as ElementProps;

  Object.keys(inputProps).forEach((key) => {
    if (key.startsWith("on")) {
      emits[key as Upper<ElementEmits>] = inputProps[key] as (e: SyntheticEvent<RefType>) => void;
    }
    else {
      props[key as keyof ElementProps] = inputProps[key] as ElementProps[keyof ElementProps];
    }
  });

  return { emits, props };
}

export const NucoWrapper = <RefType extends HTMLElement, ElementProps extends Record<string, unknown>, ElementEmits extends string>({ elementName, props }: WrapperProps<RefType, ElementProps, ElementEmits>) => {
  const ref = useRef<RefType | null>(null);
  const { emits, props: elementProps } = useMemo(() => splitProps(props), [props]);

  useLayoutEffect(() => {
    // customElements.whenDefined(elementName).then(() => console.info(`${elementName} is defined with React`));
    resisterElement(elementName);
  }, []);

  useEffect(() => {
    const currentRef = ref.current;

    const manageEventListener = (action: "add" | "remove") => {
      Object.keys(emits).forEach((key) => {
        const eventName = key as Upper<ElementEmits>;
        const handler = emits[eventName];

        const onCustomEvent = (event: CustomEvent) => {
          if (!event.detail)
            return;
          handler?.(event.detail[1]);
        };

        if (currentRef) {
          currentRef[`${action}EventListener`](eventName, onCustomEvent as EventListener);
        }
      });
    };

    manageEventListener("add");
    return () => manageEventListener("remove");
  }, [emits]);

  return _jsx(
    elementName as any,
    {
      ...elementProps,
      ref,
    },
    void 0,
  ) as JSX.Element;
};

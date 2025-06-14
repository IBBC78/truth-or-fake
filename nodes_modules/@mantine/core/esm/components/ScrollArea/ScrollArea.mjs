'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { rem } from '../../core/utils/units-converters/rem.mjs';
import '@mantine/hooks';
import { createVarsResolver } from '../../core/styles-api/create-vars-resolver/create-vars-resolver.mjs';
import 'clsx';
import '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../core/MantineProvider/use-props/use-props.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import { useStyles } from '../../core/styles-api/use-styles/use-styles.mjs';
import { Box } from '../../core/Box/Box.mjs';
import { factory } from '../../core/factory/factory.mjs';
import '../../core/DirectionProvider/DirectionProvider.mjs';
import { ScrollAreaCorner } from './ScrollAreaCorner/ScrollAreaCorner.mjs';
import { ScrollAreaRoot } from './ScrollAreaRoot/ScrollAreaRoot.mjs';
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar/ScrollAreaScrollbar.mjs';
import { ScrollAreaThumb } from './ScrollAreaThumb/ScrollAreaThumb.mjs';
import { ScrollAreaViewport } from './ScrollAreaViewport/ScrollAreaViewport.mjs';
import classes from './ScrollArea.module.css.mjs';

const defaultProps = {
  scrollHideDelay: 1e3,
  type: "hover",
  scrollbars: "xy"
};
const varsResolver = createVarsResolver(
  (_, { scrollbarSize, overscrollBehavior }) => ({
    root: {
      "--scrollarea-scrollbar-size": rem(scrollbarSize),
      "--scrollarea-over-scroll-behavior": overscrollBehavior
    }
  })
);
const ScrollArea = factory((_props, ref) => {
  const props = useProps("ScrollArea", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    scrollbarSize,
    vars,
    type,
    scrollHideDelay,
    viewportProps,
    viewportRef,
    onScrollPositionChange,
    children,
    offsetScrollbars,
    scrollbars,
    onBottomReached,
    onTopReached,
    overscrollBehavior,
    ...others
  } = props;
  const [scrollbarHovered, setScrollbarHovered] = useState(false);
  const [verticalThumbVisible, setVerticalThumbVisible] = useState(false);
  const [horizontalThumbVisible, setHorizontalThumbVisible] = useState(false);
  const getStyles = useStyles({
    name: "ScrollArea",
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const localViewportRef = useRef(null);
  const combinedViewportRef = useMergeRefs([viewportRef, localViewportRef]);
  useEffect(() => {
    if (!localViewportRef.current) {
      return;
    }
    if (offsetScrollbars !== "present") {
      return;
    }
    const element = localViewportRef.current;
    const observer = new ResizeObserver(() => {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = element;
      setVerticalThumbVisible(scrollHeight > clientHeight);
      setHorizontalThumbVisible(scrollWidth > clientWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [localViewportRef, offsetScrollbars]);
  return /* @__PURE__ */ jsxs(
    ScrollAreaRoot,
    {
      getStyles,
      type: type === "never" ? "always" : type,
      scrollHideDelay,
      ref,
      scrollbars,
      ...getStyles("root"),
      ...others,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaViewport,
          {
            ...viewportProps,
            ...getStyles("viewport", { style: viewportProps?.style }),
            ref: combinedViewportRef,
            "data-offset-scrollbars": offsetScrollbars === true ? "xy" : offsetScrollbars || void 0,
            "data-scrollbars": scrollbars || void 0,
            "data-horizontal-hidden": offsetScrollbars === "present" && !horizontalThumbVisible ? "true" : void 0,
            "data-vertical-hidden": offsetScrollbars === "present" && !verticalThumbVisible ? "true" : void 0,
            onScroll: (e) => {
              viewportProps?.onScroll?.(e);
              onScrollPositionChange?.({ x: e.currentTarget.scrollLeft, y: e.currentTarget.scrollTop });
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (scrollTop - (scrollHeight - clientHeight) >= -0.6) {
                onBottomReached?.();
              }
              if (scrollTop === 0) {
                onTopReached?.();
              }
            },
            children
          }
        ),
        (scrollbars === "xy" || scrollbars === "x") && /* @__PURE__ */ jsx(
          ScrollAreaScrollbar,
          {
            ...getStyles("scrollbar"),
            orientation: "horizontal",
            "data-hidden": type === "never" || offsetScrollbars === "present" && !horizontalThumbVisible ? true : void 0,
            forceMount: true,
            onMouseEnter: () => setScrollbarHovered(true),
            onMouseLeave: () => setScrollbarHovered(false),
            children: /* @__PURE__ */ jsx(ScrollAreaThumb, { ...getStyles("thumb") })
          }
        ),
        (scrollbars === "xy" || scrollbars === "y") && /* @__PURE__ */ jsx(
          ScrollAreaScrollbar,
          {
            ...getStyles("scrollbar"),
            orientation: "vertical",
            "data-hidden": type === "never" || offsetScrollbars === "present" && !verticalThumbVisible ? true : void 0,
            forceMount: true,
            onMouseEnter: () => setScrollbarHovered(true),
            onMouseLeave: () => setScrollbarHovered(false),
            children: /* @__PURE__ */ jsx(ScrollAreaThumb, { ...getStyles("thumb") })
          }
        ),
        /* @__PURE__ */ jsx(
          ScrollAreaCorner,
          {
            ...getStyles("corner"),
            "data-hovered": scrollbarHovered || void 0,
            "data-hidden": type === "never" || void 0
          }
        )
      ]
    }
  );
});
ScrollArea.displayName = "@mantine/core/ScrollArea";
const ScrollAreaAutosize = factory((props, ref) => {
  const {
    children,
    classNames,
    styles,
    scrollbarSize,
    scrollHideDelay,
    type,
    dir,
    offsetScrollbars,
    viewportRef,
    onScrollPositionChange,
    unstyled,
    variant,
    viewportProps,
    scrollbars,
    style,
    vars,
    onBottomReached,
    onTopReached,
    ...others
  } = useProps("ScrollAreaAutosize", defaultProps, props);
  return /* @__PURE__ */ jsx(Box, { ...others, ref, style: [{ display: "flex", overflow: "auto" }, style], children: /* @__PURE__ */ jsx(Box, { style: { display: "flex", flexDirection: "column", flex: 1 }, children: /* @__PURE__ */ jsx(
    ScrollArea,
    {
      classNames,
      styles,
      scrollHideDelay,
      scrollbarSize,
      type,
      dir,
      offsetScrollbars,
      viewportRef,
      onScrollPositionChange,
      unstyled,
      variant,
      viewportProps,
      vars,
      scrollbars,
      onBottomReached,
      onTopReached,
      children
    }
  ) }) });
});
ScrollArea.classes = classes;
ScrollAreaAutosize.displayName = "@mantine/core/ScrollAreaAutosize";
ScrollAreaAutosize.classes = classes;
ScrollArea.Autosize = ScrollAreaAutosize;

export { ScrollArea, ScrollAreaAutosize };
//# sourceMappingURL=ScrollArea.mjs.map

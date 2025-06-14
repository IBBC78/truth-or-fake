'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var react = require('@floating-ui/react');
var rem = require('../../core/utils/units-converters/rem.cjs');
require('@mantine/hooks');
var createVarsResolver = require('../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
require('clsx');
require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
var Box = require('../../core/Box/Box.cjs');
var factory = require('../../core/factory/factory.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');
var ScrollAreaCorner = require('./ScrollAreaCorner/ScrollAreaCorner.cjs');
var ScrollAreaRoot = require('./ScrollAreaRoot/ScrollAreaRoot.cjs');
var ScrollAreaScrollbar = require('./ScrollAreaScrollbar/ScrollAreaScrollbar.cjs');
var ScrollAreaThumb = require('./ScrollAreaThumb/ScrollAreaThumb.cjs');
var ScrollAreaViewport = require('./ScrollAreaViewport/ScrollAreaViewport.cjs');
var ScrollArea_module = require('./ScrollArea.module.css.cjs');

const defaultProps = {
  scrollHideDelay: 1e3,
  type: "hover",
  scrollbars: "xy"
};
const varsResolver = createVarsResolver.createVarsResolver(
  (_, { scrollbarSize, overscrollBehavior }) => ({
    root: {
      "--scrollarea-scrollbar-size": rem.rem(scrollbarSize),
      "--scrollarea-over-scroll-behavior": overscrollBehavior
    }
  })
);
const ScrollArea = factory.factory((_props, ref) => {
  const props = useProps.useProps("ScrollArea", defaultProps, _props);
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
  const [scrollbarHovered, setScrollbarHovered] = React.useState(false);
  const [verticalThumbVisible, setVerticalThumbVisible] = React.useState(false);
  const [horizontalThumbVisible, setHorizontalThumbVisible] = React.useState(false);
  const getStyles = useStyles.useStyles({
    name: "ScrollArea",
    props,
    classes: ScrollArea_module,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const localViewportRef = React.useRef(null);
  const combinedViewportRef = react.useMergeRefs([viewportRef, localViewportRef]);
  React.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ScrollAreaRoot.ScrollAreaRoot,
    {
      getStyles,
      type: type === "never" ? "always" : type,
      scrollHideDelay,
      ref,
      scrollbars,
      ...getStyles("root"),
      ...others,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ScrollAreaViewport.ScrollAreaViewport,
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
        (scrollbars === "xy" || scrollbars === "x") && /* @__PURE__ */ jsxRuntime.jsx(
          ScrollAreaScrollbar.ScrollAreaScrollbar,
          {
            ...getStyles("scrollbar"),
            orientation: "horizontal",
            "data-hidden": type === "never" || offsetScrollbars === "present" && !horizontalThumbVisible ? true : void 0,
            forceMount: true,
            onMouseEnter: () => setScrollbarHovered(true),
            onMouseLeave: () => setScrollbarHovered(false),
            children: /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaThumb.ScrollAreaThumb, { ...getStyles("thumb") })
          }
        ),
        (scrollbars === "xy" || scrollbars === "y") && /* @__PURE__ */ jsxRuntime.jsx(
          ScrollAreaScrollbar.ScrollAreaScrollbar,
          {
            ...getStyles("scrollbar"),
            orientation: "vertical",
            "data-hidden": type === "never" || offsetScrollbars === "present" && !verticalThumbVisible ? true : void 0,
            forceMount: true,
            onMouseEnter: () => setScrollbarHovered(true),
            onMouseLeave: () => setScrollbarHovered(false),
            children: /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaThumb.ScrollAreaThumb, { ...getStyles("thumb") })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ScrollAreaCorner.ScrollAreaCorner,
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
const ScrollAreaAutosize = factory.factory((props, ref) => {
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
  } = useProps.useProps("ScrollAreaAutosize", defaultProps, props);
  return /* @__PURE__ */ jsxRuntime.jsx(Box.Box, { ...others, ref, style: [{ display: "flex", overflow: "auto" }, style], children: /* @__PURE__ */ jsxRuntime.jsx(Box.Box, { style: { display: "flex", flexDirection: "column", flex: 1 }, children: /* @__PURE__ */ jsxRuntime.jsx(
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
ScrollArea.classes = ScrollArea_module;
ScrollAreaAutosize.displayName = "@mantine/core/ScrollAreaAutosize";
ScrollAreaAutosize.classes = ScrollArea_module;
ScrollArea.Autosize = ScrollAreaAutosize;

exports.ScrollArea = ScrollArea;
exports.ScrollAreaAutosize = ScrollAreaAutosize;
//# sourceMappingURL=ScrollArea.cjs.map

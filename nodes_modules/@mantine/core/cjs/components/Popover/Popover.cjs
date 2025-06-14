'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var hooks = require('@mantine/hooks');
var getDefaultZIndex = require('../../core/utils/get-default-z-index/get-default-z-index.cjs');
var getSize = require('../../core/utils/get-size/get-size.cjs');
var createVarsResolver = require('../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
require('clsx');
var useResolvedStylesApi = require('../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
var Mantine_context = require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
require('../../core/Box/Box.cjs');
var DirectionProvider = require('../../core/DirectionProvider/DirectionProvider.cjs');
require('../Floating/FloatingArrow/FloatingArrow.cjs');
var getFloatingPosition = require('../Floating/get-floating-position/get-floating-position.cjs');
var Overlay = require('../Overlay/Overlay.cjs');
require('../Portal/Portal.cjs');
var OptionalPortal = require('../Portal/OptionalPortal.cjs');
var Transition = require('../Transition/Transition.cjs');
var Popover_context = require('./Popover.context.cjs');
var PopoverDropdown = require('./PopoverDropdown/PopoverDropdown.cjs');
var PopoverTarget = require('./PopoverTarget/PopoverTarget.cjs');
var usePopover = require('./use-popover.cjs');
var Popover_module = require('./Popover.module.css.cjs');

const defaultProps = {
  position: "bottom",
  offset: 8,
  positionDependencies: [],
  transitionProps: { transition: "fade", duration: 150 },
  middlewares: { flip: true, shift: true, inline: false },
  arrowSize: 7,
  arrowOffset: 5,
  arrowRadius: 0,
  arrowPosition: "side",
  closeOnClickOutside: true,
  withinPortal: true,
  closeOnEscape: true,
  trapFocus: false,
  withRoles: true,
  returnFocus: false,
  withOverlay: false,
  hideDetached: true,
  clickOutsideEvents: ["mousedown", "touchstart"],
  zIndex: getDefaultZIndex.getDefaultZIndex("popover"),
  __staticSelector: "Popover",
  width: "max-content"
};
const varsResolver = createVarsResolver.createVarsResolver((_, { radius, shadow }) => ({
  dropdown: {
    "--popover-radius": radius === void 0 ? void 0 : getSize.getRadius(radius),
    "--popover-shadow": getSize.getShadow(shadow)
  }
}));
function Popover(_props) {
  const props = useProps.useProps("Popover", defaultProps, _props);
  const {
    children,
    position,
    offset,
    onPositionChange,
    // Scheduled for removal in 9.0
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    positionDependencies,
    opened,
    transitionProps,
    onExitTransitionEnd,
    onEnterTransitionEnd,
    width,
    middlewares,
    withArrow,
    arrowSize,
    arrowOffset,
    arrowRadius,
    arrowPosition,
    unstyled,
    classNames,
    styles,
    closeOnClickOutside,
    withinPortal,
    portalProps,
    closeOnEscape,
    clickOutsideEvents,
    trapFocus,
    onClose,
    onDismiss,
    onOpen,
    onChange,
    zIndex,
    radius,
    shadow,
    id,
    defaultOpened,
    __staticSelector,
    withRoles,
    disabled,
    returnFocus,
    variant,
    keepMounted,
    vars,
    floatingStrategy,
    withOverlay,
    overlayProps,
    hideDetached,
    ...others
  } = props;
  const getStyles = useStyles.useStyles({
    name: __staticSelector,
    props,
    classes: Popover_module,
    classNames,
    styles,
    unstyled,
    rootSelector: "dropdown",
    vars,
    varsResolver
  });
  const { resolvedStyles } = useResolvedStylesApi.useResolvedStylesApi({ classNames, styles, props });
  const [dropdownVisible, setDropdownVisible] = React.useState(opened ?? defaultOpened ?? false);
  const positionRef = React.useRef(position);
  const arrowRef = React.useRef(null);
  const [targetNode, setTargetNode] = React.useState(null);
  const [dropdownNode, setDropdownNode] = React.useState(null);
  const { dir } = DirectionProvider.useDirection();
  const env = Mantine_context.useMantineEnv();
  const uid = hooks.useId(id);
  const popover = usePopover.usePopover({
    middlewares,
    width,
    position: getFloatingPosition.getFloatingPosition(dir, position),
    offset: typeof offset === "number" ? offset + (withArrow ? arrowSize / 2 : 0) : offset,
    arrowRef,
    arrowOffset,
    onPositionChange,
    positionDependencies,
    opened,
    defaultOpened,
    onChange,
    onOpen,
    onClose,
    onDismiss,
    strategy: floatingStrategy,
    dropdownVisible,
    setDropdownVisible,
    positionRef,
    disabled
  });
  hooks.useClickOutside(
    () => {
      if (closeOnClickOutside) {
        popover.onClose();
        onDismiss?.();
      }
    },
    clickOutsideEvents,
    [targetNode, dropdownNode]
  );
  const reference = React.useCallback(
    (node) => {
      setTargetNode(node);
      popover.floating.refs.setReference(node);
    },
    [popover.floating.refs.setReference]
  );
  const floating = React.useCallback(
    (node) => {
      setDropdownNode(node);
      popover.floating.refs.setFloating(node);
    },
    [popover.floating.refs.setFloating]
  );
  const onExited = React.useCallback(() => {
    transitionProps?.onExited?.();
    onExitTransitionEnd?.();
    setDropdownVisible(false);
    positionRef.current = position;
  }, [transitionProps?.onExited, onExitTransitionEnd]);
  const onEntered = React.useCallback(() => {
    transitionProps?.onEntered?.();
    onEnterTransitionEnd?.();
  }, [transitionProps?.onEntered, onEnterTransitionEnd]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Popover_context.PopoverContextProvider,
    {
      value: {
        returnFocus,
        disabled,
        controlled: popover.controlled,
        reference,
        floating,
        x: popover.floating.x,
        y: popover.floating.y,
        arrowX: popover.floating?.middlewareData?.arrow?.x,
        arrowY: popover.floating?.middlewareData?.arrow?.y,
        opened: popover.opened,
        arrowRef,
        transitionProps: { ...transitionProps, onExited, onEntered },
        width,
        withArrow,
        arrowSize,
        arrowOffset,
        arrowRadius,
        arrowPosition,
        placement: popover.floating.placement,
        trapFocus,
        withinPortal,
        portalProps,
        zIndex,
        radius,
        shadow,
        closeOnEscape,
        onDismiss,
        onClose: popover.onClose,
        onToggle: popover.onToggle,
        getTargetId: () => `${uid}-target`,
        getDropdownId: () => `${uid}-dropdown`,
        withRoles,
        targetProps: others,
        __staticSelector,
        classNames,
        styles,
        unstyled,
        variant,
        keepMounted,
        getStyles,
        resolvedStyles,
        floatingStrategy,
        referenceHidden: hideDetached && env !== "test" ? popover.floating.middlewareData.hide?.referenceHidden : false
      },
      children: [
        children,
        withOverlay && /* @__PURE__ */ jsxRuntime.jsx(
          Transition.Transition,
          {
            transition: "fade",
            mounted: popover.opened,
            duration: transitionProps?.duration || 250,
            exitDuration: transitionProps?.exitDuration || 250,
            children: (transitionStyles) => /* @__PURE__ */ jsxRuntime.jsx(OptionalPortal.OptionalPortal, { withinPortal, children: /* @__PURE__ */ jsxRuntime.jsx(
              Overlay.Overlay,
              {
                ...overlayProps,
                ...getStyles("overlay", {
                  className: overlayProps?.className,
                  style: [transitionStyles, overlayProps?.style]
                })
              }
            ) })
          }
        )
      ]
    }
  );
}
Popover.Target = PopoverTarget.PopoverTarget;
Popover.Dropdown = PopoverDropdown.PopoverDropdown;
Popover.displayName = "@mantine/core/Popover";
Popover.extend = (input) => input;

exports.Popover = Popover;
//# sourceMappingURL=Popover.cjs.map

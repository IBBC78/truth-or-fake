'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useCallback } from 'react';
import { useId, useClickOutside } from '@mantine/hooks';
import { getDefaultZIndex } from '../../core/utils/get-default-z-index/get-default-z-index.mjs';
import { getRadius, getShadow } from '../../core/utils/get-size/get-size.mjs';
import { createVarsResolver } from '../../core/styles-api/create-vars-resolver/create-vars-resolver.mjs';
import 'clsx';
import { useResolvedStylesApi } from '../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.mjs';
import { useStyles } from '../../core/styles-api/use-styles/use-styles.mjs';
import { useMantineEnv } from '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../core/MantineProvider/use-props/use-props.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import '../../core/Box/Box.mjs';
import { useDirection } from '../../core/DirectionProvider/DirectionProvider.mjs';
import '../Floating/FloatingArrow/FloatingArrow.mjs';
import { getFloatingPosition } from '../Floating/get-floating-position/get-floating-position.mjs';
import { Overlay } from '../Overlay/Overlay.mjs';
import '../Portal/Portal.mjs';
import { OptionalPortal } from '../Portal/OptionalPortal.mjs';
import { Transition } from '../Transition/Transition.mjs';
import { PopoverContextProvider } from './Popover.context.mjs';
import { PopoverDropdown } from './PopoverDropdown/PopoverDropdown.mjs';
import { PopoverTarget } from './PopoverTarget/PopoverTarget.mjs';
import { usePopover } from './use-popover.mjs';
import classes from './Popover.module.css.mjs';

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
  zIndex: getDefaultZIndex("popover"),
  __staticSelector: "Popover",
  width: "max-content"
};
const varsResolver = createVarsResolver((_, { radius, shadow }) => ({
  dropdown: {
    "--popover-radius": radius === void 0 ? void 0 : getRadius(radius),
    "--popover-shadow": getShadow(shadow)
  }
}));
function Popover(_props) {
  const props = useProps("Popover", defaultProps, _props);
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
  const getStyles = useStyles({
    name: __staticSelector,
    props,
    classes,
    classNames,
    styles,
    unstyled,
    rootSelector: "dropdown",
    vars,
    varsResolver
  });
  const { resolvedStyles } = useResolvedStylesApi({ classNames, styles, props });
  const [dropdownVisible, setDropdownVisible] = useState(opened ?? defaultOpened ?? false);
  const positionRef = useRef(position);
  const arrowRef = useRef(null);
  const [targetNode, setTargetNode] = useState(null);
  const [dropdownNode, setDropdownNode] = useState(null);
  const { dir } = useDirection();
  const env = useMantineEnv();
  const uid = useId(id);
  const popover = usePopover({
    middlewares,
    width,
    position: getFloatingPosition(dir, position),
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
  useClickOutside(
    () => {
      if (closeOnClickOutside) {
        popover.onClose();
        onDismiss?.();
      }
    },
    clickOutsideEvents,
    [targetNode, dropdownNode]
  );
  const reference = useCallback(
    (node) => {
      setTargetNode(node);
      popover.floating.refs.setReference(node);
    },
    [popover.floating.refs.setReference]
  );
  const floating = useCallback(
    (node) => {
      setDropdownNode(node);
      popover.floating.refs.setFloating(node);
    },
    [popover.floating.refs.setFloating]
  );
  const onExited = useCallback(() => {
    transitionProps?.onExited?.();
    onExitTransitionEnd?.();
    setDropdownVisible(false);
    positionRef.current = position;
  }, [transitionProps?.onExited, onExitTransitionEnd]);
  const onEntered = useCallback(() => {
    transitionProps?.onEntered?.();
    onEnterTransitionEnd?.();
  }, [transitionProps?.onEntered, onEnterTransitionEnd]);
  return /* @__PURE__ */ jsxs(
    PopoverContextProvider,
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
        withOverlay && /* @__PURE__ */ jsx(
          Transition,
          {
            transition: "fade",
            mounted: popover.opened,
            duration: transitionProps?.duration || 250,
            exitDuration: transitionProps?.exitDuration || 250,
            children: (transitionStyles) => /* @__PURE__ */ jsx(OptionalPortal, { withinPortal, children: /* @__PURE__ */ jsx(
              Overlay,
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
Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;
Popover.displayName = "@mantine/core/Popover";
Popover.extend = (input) => input;

export { Popover };
//# sourceMappingURL=Popover.mjs.map

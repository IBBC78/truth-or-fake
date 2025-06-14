'use client';
'use strict';

var React = require('react');
var react = require('@floating-ui/react');
var hooks = require('@mantine/hooks');
require('react/jsx-runtime');
require('clsx');
var Mantine_context = require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
require('../../core/Box/Box.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');

function getDefaultMiddlewares(middlewares) {
  if (middlewares === void 0) {
    return { shift: true, flip: true };
  }
  const result = { ...middlewares };
  if (middlewares.shift === void 0) {
    result.shift = true;
  }
  if (middlewares.flip === void 0) {
    result.flip = true;
  }
  return result;
}
function getPopoverMiddlewares(options, getFloating, env) {
  const middlewaresOptions = getDefaultMiddlewares(options.middlewares);
  const middlewares = [react.offset(options.offset), react.hide()];
  if (options.dropdownVisible && env !== "test") {
    middlewaresOptions.flip = false;
    middlewaresOptions.shift = false;
  }
  if (middlewaresOptions.shift) {
    middlewares.push(
      react.shift(
        typeof middlewaresOptions.shift === "boolean" ? { limiter: react.limitShift(), padding: 5 } : { limiter: react.limitShift(), padding: 5, ...middlewaresOptions.shift }
      )
    );
  }
  if (middlewaresOptions.flip) {
    middlewares.push(
      typeof middlewaresOptions.flip === "boolean" ? react.flip() : react.flip(middlewaresOptions.flip)
    );
  }
  if (middlewaresOptions.inline) {
    middlewares.push(
      typeof middlewaresOptions.inline === "boolean" ? react.inline() : react.inline(middlewaresOptions.inline)
    );
  }
  middlewares.push(react.arrow({ element: options.arrowRef, padding: options.arrowOffset }));
  if (middlewaresOptions.size || options.width === "target") {
    middlewares.push(
      react.size({
        ...typeof middlewaresOptions.size === "boolean" ? {} : middlewaresOptions.size,
        apply({ rects, availableWidth, availableHeight, ...rest }) {
          const floating = getFloating();
          const styles = floating.refs.floating.current?.style ?? {};
          if (middlewaresOptions.size) {
            if (typeof middlewaresOptions.size === "object" && !!middlewaresOptions.size.apply) {
              middlewaresOptions.size.apply({ rects, availableWidth, availableHeight, ...rest });
            } else {
              Object.assign(styles, {
                maxWidth: `${availableWidth}px`,
                maxHeight: `${availableHeight}px`
              });
            }
          }
          if (options.width === "target") {
            Object.assign(styles, {
              width: `${rects.reference.width}px`
            });
          }
        }
      })
    );
  }
  return middlewares;
}
function usePopover(options) {
  const env = Mantine_context.useMantineEnv();
  const [_opened, setOpened] = hooks.useUncontrolled({
    value: options.opened,
    defaultValue: options.defaultOpened,
    finalValue: false,
    onChange: options.onChange
  });
  const previouslyOpened = React.useRef(_opened);
  const onClose = () => {
    if (_opened && !options.disabled) {
      setOpened(false);
    }
  };
  const onToggle = () => !options.disabled && setOpened(!_opened);
  const floating = react.useFloating({
    strategy: options.strategy,
    placement: options.positionRef.current,
    middleware: getPopoverMiddlewares(options, () => floating, env),
    whileElementsMounted: react.autoUpdate
  });
  hooks.useDidUpdate(() => {
    options.onPositionChange?.(floating.placement);
    options.positionRef.current = floating.placement;
  }, [floating.placement]);
  hooks.useDidUpdate(() => {
    if (_opened !== previouslyOpened.current) {
      if (!_opened) {
        options.onClose?.();
      } else {
        options.onOpen?.();
      }
    }
    previouslyOpened.current = _opened;
  }, [_opened, options.onClose, options.onOpen]);
  hooks.useDidUpdate(() => {
    let timeout = -1;
    if (_opened) {
      timeout = window.setTimeout(() => options.setDropdownVisible(true), 4);
    }
    return () => {
      window.clearTimeout(timeout);
    };
  }, [_opened, options.position]);
  return {
    floating,
    controlled: typeof options.opened === "boolean",
    opened: _opened,
    onClose,
    onToggle
  };
}

exports.usePopover = usePopover;
//# sourceMappingURL=use-popover.cjs.map

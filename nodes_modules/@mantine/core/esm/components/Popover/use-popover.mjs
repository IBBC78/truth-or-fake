'use client';
import { useRef } from 'react';
import { useFloating, autoUpdate, offset, hide, shift, limitShift, flip, inline, arrow, size } from '@floating-ui/react';
import { useUncontrolled, useDidUpdate } from '@mantine/hooks';
import 'react/jsx-runtime';
import 'clsx';
import { useMantineEnv } from '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import '../../core/Box/Box.mjs';
import '../../core/DirectionProvider/DirectionProvider.mjs';

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
  const middlewares = [offset(options.offset), hide()];
  if (options.dropdownVisible && env !== "test") {
    middlewaresOptions.flip = false;
    middlewaresOptions.shift = false;
  }
  if (middlewaresOptions.shift) {
    middlewares.push(
      shift(
        typeof middlewaresOptions.shift === "boolean" ? { limiter: limitShift(), padding: 5 } : { limiter: limitShift(), padding: 5, ...middlewaresOptions.shift }
      )
    );
  }
  if (middlewaresOptions.flip) {
    middlewares.push(
      typeof middlewaresOptions.flip === "boolean" ? flip() : flip(middlewaresOptions.flip)
    );
  }
  if (middlewaresOptions.inline) {
    middlewares.push(
      typeof middlewaresOptions.inline === "boolean" ? inline() : inline(middlewaresOptions.inline)
    );
  }
  middlewares.push(arrow({ element: options.arrowRef, padding: options.arrowOffset }));
  if (middlewaresOptions.size || options.width === "target") {
    middlewares.push(
      size({
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
  const env = useMantineEnv();
  const [_opened, setOpened] = useUncontrolled({
    value: options.opened,
    defaultValue: options.defaultOpened,
    finalValue: false,
    onChange: options.onChange
  });
  const previouslyOpened = useRef(_opened);
  const onClose = () => {
    if (_opened && !options.disabled) {
      setOpened(false);
    }
  };
  const onToggle = () => !options.disabled && setOpened(!_opened);
  const floating = useFloating({
    strategy: options.strategy,
    placement: options.positionRef.current,
    middleware: getPopoverMiddlewares(options, () => floating, env),
    whileElementsMounted: autoUpdate
  });
  useDidUpdate(() => {
    options.onPositionChange?.(floating.placement);
    options.positionRef.current = floating.placement;
  }, [floating.placement]);
  useDidUpdate(() => {
    if (_opened !== previouslyOpened.current) {
      if (!_opened) {
        options.onClose?.();
      } else {
        options.onOpen?.();
      }
    }
    previouslyOpened.current = _opened;
  }, [_opened, options.onClose, options.onOpen]);
  useDidUpdate(() => {
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

export { usePopover };
//# sourceMappingURL=use-popover.mjs.map

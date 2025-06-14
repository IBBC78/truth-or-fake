'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useState, useEffect } from 'react';
import { useUncontrolled, useMove, useMergedRef, clamp } from '@mantine/hooks';
import { rem } from '../../../core/utils/units-converters/rem.mjs';
import { getSize, getRadius } from '../../../core/utils/get-size/get-size.mjs';
import { findClosestNumber } from '../../../core/utils/find-closest-number/find-closest-number.mjs';
import { createVarsResolver } from '../../../core/styles-api/create-vars-resolver/create-vars-resolver.mjs';
import 'clsx';
import { getThemeColor } from '../../../core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs';
import '../../../core/MantineProvider/Mantine.context.mjs';
import '../../../core/MantineProvider/default-theme.mjs';
import '../../../core/MantineProvider/MantineProvider.mjs';
import '../../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../../core/MantineProvider/use-props/use-props.mjs';
import '../../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import { useStyles } from '../../../core/styles-api/use-styles/use-styles.mjs';
import '../../../core/Box/Box.mjs';
import { factory } from '../../../core/factory/factory.mjs';
import { useDirection } from '../../../core/DirectionProvider/DirectionProvider.mjs';
import { SliderProvider } from '../Slider.context.mjs';
import { SliderRoot } from '../SliderRoot/SliderRoot.mjs';
import { Thumb } from '../Thumb/Thumb.mjs';
import { Track } from '../Track/Track.mjs';
import { getChangeValue } from '../utils/get-change-value/get-change-value.mjs';
import { getClientPosition } from '../utils/get-client-position/get-client-position.mjs';
import { getFloatingValue } from '../utils/get-floating-value/get-gloating-value.mjs';
import { getPosition } from '../utils/get-position/get-position.mjs';
import { getPrecision } from '../utils/get-precision/get-precision.mjs';
import { getNextMarkValue, getPreviousMarkValue, getLastMarkValue, getFirstMarkValue } from '../utils/get-step-mark-value/get-step-mark-value.mjs';
import classes from '../Slider.module.css.mjs';

const varsResolver = createVarsResolver(
  (theme, { size, color, thumbSize, radius }) => ({
    root: {
      "--slider-size": getSize(size, "slider-size"),
      "--slider-color": color ? getThemeColor(color, theme) : void 0,
      "--slider-radius": radius === void 0 ? void 0 : getRadius(radius),
      "--slider-thumb-size": thumbSize !== void 0 ? rem(thumbSize) : "calc(var(--slider-size) * 2)"
    }
  })
);
const defaultProps = {
  min: 0,
  max: 100,
  minRange: 10,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransitionProps: { transition: "fade", duration: 0 },
  labelAlwaysOn: false,
  showLabelOnHover: true,
  disabled: false,
  pushOnOverlap: true,
  scale: (v) => v,
  size: "md",
  maxRange: Infinity
};
const RangeSlider = factory((_props, ref) => {
  const props = useProps("RangeSlider", defaultProps, _props);
  const {
    classNames,
    styles,
    value,
    onChange,
    onChangeEnd,
    size,
    min,
    max,
    domain,
    minRange,
    maxRange,
    step,
    precision: _precision,
    defaultValue,
    name,
    marks,
    label,
    labelTransitionProps,
    labelAlwaysOn,
    thumbFromLabel,
    thumbToLabel,
    showLabelOnHover,
    thumbChildren,
    disabled,
    unstyled,
    scale,
    inverted,
    className,
    style,
    vars,
    hiddenInputProps,
    restrictToMarks,
    thumbProps,
    pushOnOverlap,
    ...others
  } = props;
  const getStyles = useStyles({
    name: "Slider",
    props,
    classes,
    classNames,
    className,
    styles,
    style,
    vars,
    varsResolver,
    unstyled
  });
  const containerRef = useRef(null);
  const { dir } = useDirection();
  const [focused, setFocused] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [min, max],
    onChange
  });
  const valueRef = useRef(_value);
  const thumbs = useRef([]);
  const root = useRef(null);
  const thumbIndex = useRef(void 0);
  const [domainMin, domainMax] = domain || [min, max];
  const positions = [
    getPosition({ value: _value[0], min: domainMin, max: domainMax }),
    getPosition({ value: _value[1], min: domainMin, max: domainMax })
  ];
  const precision = _precision ?? getPrecision(step);
  const _setValue = (val) => {
    setValue(val);
    valueRef.current = val;
  };
  useEffect(
    () => {
      if (Array.isArray(value)) {
        valueRef.current = value;
      }
    },
    Array.isArray(value) ? [value[0], value[1]] : [null, null]
  );
  const setRangedValue = (val, index, triggerChangeEnd) => {
    if (index === -1) {
      return;
    }
    const clone = [...valueRef.current];
    if (restrictToMarks && marks) {
      const closest = findClosestNumber(
        val,
        marks.map((m) => m.value)
      );
      const current = clone[index];
      clone[index] = closest;
      const otherIndex = index === 0 ? 1 : 0;
      const lastMarkValue = getLastMarkValue(marks);
      const firstMarkValue = getFirstMarkValue(marks);
      if (closest === lastMarkValue && clone[otherIndex] === lastMarkValue) {
        clone[index] = current;
      } else if (closest === firstMarkValue && clone[otherIndex] === firstMarkValue) {
        clone[index] = current;
      } else if (closest === clone[otherIndex]) {
        if (current > clone[otherIndex]) {
          clone[otherIndex] = getPreviousMarkValue(closest, marks);
        } else {
          clone[otherIndex] = getNextMarkValue(closest, marks);
        }
      }
    } else {
      const clampedVal = clamp(val, min, max);
      clone[index] = clampedVal;
      if (index === 0) {
        if (clampedVal > clone[1] - (minRange - 1e-9)) {
          if (pushOnOverlap) {
            clone[1] = Math.min(val + minRange, max);
          } else {
            clone[index] = valueRef.current[index];
          }
        }
        if (clampedVal > (max - (minRange - 1e-9) || min)) {
          clone[index] = valueRef.current[index];
        }
        if (clone[1] - val > maxRange) {
          if (pushOnOverlap) {
            clone[1] = val + maxRange;
          } else {
            clone[index] = valueRef.current[index];
          }
        }
      }
      if (index === 1) {
        if (clampedVal < clone[0] + minRange) {
          if (pushOnOverlap) {
            clone[0] = Math.max(val - minRange, min);
          } else {
            clone[index] = valueRef.current[index];
          }
        }
        if (clampedVal < clone[0] + minRange) {
          clone[index] = valueRef.current[index];
        }
        if (clampedVal - clone[0] > maxRange) {
          if (pushOnOverlap) {
            clone[0] = val - maxRange;
          } else {
            clone[index] = valueRef.current[index];
          }
        }
      }
    }
    clone[0] = getFloatingValue(clone[0], precision);
    clone[1] = getFloatingValue(clone[1], precision);
    if (clone[0] > clone[1]) {
      const temp = clone[0];
      clone[0] = clone[1];
      clone[1] = temp;
    }
    _setValue(clone);
    if (triggerChangeEnd) {
      onChangeEnd?.(valueRef.current);
    }
  };
  const handleChange = (val) => {
    if (!disabled && thumbIndex.current !== void 0) {
      const nextValue = getChangeValue({
        value: val,
        min: domainMin,
        max: domainMax,
        step,
        precision
      });
      setRangedValue(nextValue, thumbIndex.current, false);
    }
  };
  const { ref: useMoveRef, active } = useMove(
    ({ x }) => handleChange(x),
    { onScrubEnd: () => !disabled && onChangeEnd?.(valueRef.current) },
    dir
  );
  function handleThumbMouseDown(index) {
    thumbIndex.current = index;
  }
  const handleTrackMouseDownCapture = (event) => {
    if (containerRef.current) {
      containerRef.current.focus();
      const rect = containerRef.current.getBoundingClientRect();
      const changePosition = getClientPosition(event.nativeEvent);
      const changeValue = getChangeValue({
        value: changePosition - rect.left,
        max,
        min,
        step,
        containerWidth: rect.width
      });
      const nearestHandle = Math.abs(_value[0] - changeValue) > Math.abs(_value[1] - changeValue) ? 1 : 0;
      const _nearestHandle = dir === "ltr" ? nearestHandle : nearestHandle === 1 ? 0 : 1;
      thumbIndex.current = _nearestHandle;
    }
  };
  const getFocusedThumbIndex = () => {
    if (focused !== 1 && focused !== 0) {
      setFocused(0);
      return 0;
    }
    return focused;
  };
  const handleTrackKeydownCapture = (event) => {
    if (!disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? getNextMarkValue(valueRef.current[focusedIndex], marks) : Math.min(Math.max(valueRef.current[focusedIndex] + step, min), max);
          setRangedValue(getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? (dir === "rtl" ? getPreviousMarkValue : getNextMarkValue)(
            valueRef.current[focusedIndex],
            marks
          ) : Math.min(
            Math.max(
              dir === "rtl" ? valueRef.current[focusedIndex] - step : valueRef.current[focusedIndex] + step,
              min
            ),
            max
          );
          setRangedValue(getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? getPreviousMarkValue(valueRef.current[focusedIndex], marks) : Math.min(Math.max(valueRef.current[focusedIndex] - step, min), max);
          setRangedValue(getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? (dir === "rtl" ? getNextMarkValue : getPreviousMarkValue)(
            valueRef.current[focusedIndex],
            marks
          ) : Math.min(
            Math.max(
              dir === "rtl" ? valueRef.current[focusedIndex] + step : valueRef.current[focusedIndex] - step,
              min
            ),
            max
          );
          setRangedValue(getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
      }
    }
  };
  const sharedThumbProps = {
    max,
    min,
    size,
    labelTransitionProps,
    labelAlwaysOn,
    onBlur: () => setFocused(-1)
  };
  const hasArrayThumbChildren = Array.isArray(thumbChildren);
  return /* @__PURE__ */ jsx(SliderProvider, { value: { getStyles }, children: /* @__PURE__ */ jsxs(
    SliderRoot,
    {
      ...others,
      size,
      ref: useMergedRef(ref, root),
      disabled,
      onMouseDownCapture: () => root.current?.focus(),
      onKeyDownCapture: () => {
        if (thumbs.current[0]?.parentElement?.contains(document.activeElement)) {
          return;
        }
        thumbs.current[0]?.focus();
      },
      children: [
        /* @__PURE__ */ jsxs(
          Track,
          {
            offset: positions[0],
            marksOffset: _value[0],
            filled: positions[1] - positions[0],
            marks,
            inverted,
            min: domainMin,
            max: domainMax,
            value: _value[1],
            disabled,
            containerProps: {
              ref: useMergedRef(containerRef, useMoveRef),
              onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
              onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0,
              onTouchStartCapture: handleTrackMouseDownCapture,
              onTouchEndCapture: () => {
                thumbIndex.current = -1;
              },
              onMouseDownCapture: handleTrackMouseDownCapture,
              onMouseUpCapture: () => {
                thumbIndex.current = -1;
              },
              onKeyDownCapture: handleTrackKeydownCapture
            },
            children: [
              /* @__PURE__ */ jsx(
                Thumb,
                {
                  ...sharedThumbProps,
                  value: scale(_value[0]),
                  position: positions[0],
                  dragging: active,
                  label: typeof label === "function" ? label(getFloatingValue(scale(_value[0]), precision)) : label,
                  ref: (node) => {
                    if (node) {
                      thumbs.current[0] = node;
                    }
                  },
                  thumbLabel: thumbFromLabel,
                  onMouseDown: () => handleThumbMouseDown(0),
                  onFocus: () => setFocused(0),
                  showLabelOnHover,
                  isHovered: hovered,
                  disabled,
                  ...thumbProps?.(0),
                  children: hasArrayThumbChildren ? thumbChildren[0] : thumbChildren
                }
              ),
              /* @__PURE__ */ jsx(
                Thumb,
                {
                  ...sharedThumbProps,
                  thumbLabel: thumbToLabel,
                  value: scale(_value[1]),
                  position: positions[1],
                  dragging: active,
                  label: typeof label === "function" ? label(getFloatingValue(scale(_value[1]), precision)) : label,
                  ref: (node) => {
                    if (node) {
                      thumbs.current[1] = node;
                    }
                  },
                  onMouseDown: () => handleThumbMouseDown(1),
                  onFocus: () => setFocused(1),
                  showLabelOnHover,
                  isHovered: hovered,
                  disabled,
                  ...thumbProps?.(1),
                  children: hasArrayThumbChildren ? thumbChildren[1] : thumbChildren
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: `${name}_from`, value: _value[0], ...hiddenInputProps }),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: `${name}_to`, value: _value[1], ...hiddenInputProps })
      ]
    }
  ) });
});
RangeSlider.classes = classes;
RangeSlider.displayName = "@mantine/core/RangeSlider";

export { RangeSlider };
//# sourceMappingURL=RangeSlider.mjs.map

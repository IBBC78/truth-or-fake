'use client';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useUncontrolled, clamp, useMove, useMergedRef } from '@mantine/hooks';
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
import { getFloatingValue } from '../utils/get-floating-value/get-gloating-value.mjs';
import { getPosition } from '../utils/get-position/get-position.mjs';
import { getPrecision } from '../utils/get-precision/get-precision.mjs';
import { getLastMarkValue, getFirstMarkValue, getNextMarkValue, getPreviousMarkValue } from '../utils/get-step-mark-value/get-step-mark-value.mjs';
import classes from '../Slider.module.css.mjs';

const defaultProps = {
  radius: "xl",
  min: 0,
  max: 100,
  step: 1,
  marks: [],
  label: (f) => f,
  labelTransitionProps: { transition: "fade", duration: 0 },
  thumbLabel: "",
  showLabelOnHover: true,
  scale: (v) => v,
  size: "md"
};
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
const Slider = factory((_props, ref) => {
  const props = useProps("Slider", defaultProps, _props);
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
    step,
    precision: _precision,
    defaultValue,
    name,
    marks,
    label,
    labelTransitionProps,
    labelAlwaysOn,
    thumbLabel,
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
  const { dir } = useDirection();
  const [hovered, setHovered] = useState(false);
  const [_value, setValue] = useUncontrolled({
    value: typeof value === "number" ? clamp(value, min, max) : value,
    defaultValue: typeof defaultValue === "number" ? clamp(defaultValue, min, max) : defaultValue,
    finalValue: clamp(0, min, max),
    onChange
  });
  const valueRef = useRef(_value);
  const onChangeEndRef = useRef(onChangeEnd);
  useEffect(() => {
    onChangeEndRef.current = onChangeEnd;
  }, [onChangeEnd]);
  const root = useRef(null);
  const thumb = useRef(null);
  const [domainMin, domainMax] = domain || [min, max];
  const position = getPosition({ value: _value, min: domainMin, max: domainMax });
  const scaledValue = scale(_value);
  const _label = typeof label === "function" ? label(scaledValue) : label;
  const precision = _precision ?? getPrecision(step);
  const handleChange = useCallback(
    ({ x }) => {
      if (!disabled) {
        const nextValue = getChangeValue({
          value: x,
          min: domainMin,
          max: domainMax,
          step,
          precision
        });
        const clampedValue = clamp(nextValue, min, max);
        setValue(
          restrictToMarks && marks?.length ? findClosestNumber(
            clampedValue,
            marks.map((mark) => mark.value)
          ) : clampedValue
        );
        valueRef.current = clampedValue;
      }
    },
    [disabled, min, max, domainMin, domainMax, step, precision, setValue, marks, restrictToMarks]
  );
  const handleScrubEnd = useCallback(() => {
    if (!disabled && onChangeEndRef.current) {
      const finalValue = restrictToMarks && marks?.length ? findClosestNumber(
        valueRef.current,
        marks.map((mark) => mark.value)
      ) : valueRef.current;
      onChangeEndRef.current(finalValue);
    }
  }, [disabled, marks, restrictToMarks]);
  const { ref: container, active } = useMove(handleChange, { onScrubEnd: handleScrubEnd }, dir);
  const callOnChangeEnd = useCallback(
    (value2) => {
      if (!disabled && onChangeEndRef.current) {
        onChangeEndRef.current(value2);
      }
    },
    [disabled]
  );
  const handleTrackKeydownCapture = (event) => {
    if (!disabled) {
      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            const nextValue2 = getNextMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getFloatingValue(
            Math.min(Math.max(_value + step, min), max),
            precision
          );
          setValue(nextValue);
          callOnChangeEnd(nextValue);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            const nextValue2 = dir === "rtl" ? getPreviousMarkValue(_value, marks) : getNextMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getFloatingValue(
            Math.min(Math.max(dir === "rtl" ? _value - step : _value + step, min), max),
            precision
          );
          setValue(nextValue);
          callOnChangeEnd(nextValue);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            const nextValue2 = getPreviousMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getFloatingValue(
            Math.min(Math.max(_value - step, min), max),
            precision
          );
          setValue(nextValue);
          callOnChangeEnd(nextValue);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            const nextValue2 = dir === "rtl" ? getNextMarkValue(_value, marks) : getPreviousMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getFloatingValue(
            Math.min(Math.max(dir === "rtl" ? _value + step : _value - step, min), max),
            precision
          );
          setValue(nextValue);
          callOnChangeEnd(nextValue);
          break;
        }
        case "Home": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            setValue(getFirstMarkValue(marks));
            callOnChangeEnd(getFirstMarkValue(marks));
            break;
          }
          setValue(min);
          callOnChangeEnd(min);
          break;
        }
        case "End": {
          event.preventDefault();
          thumb.current?.focus();
          if (restrictToMarks && marks) {
            setValue(getLastMarkValue(marks));
            callOnChangeEnd(getLastMarkValue(marks));
            break;
          }
          setValue(max);
          callOnChangeEnd(max);
          break;
        }
      }
    }
  };
  return /* @__PURE__ */ jsx(SliderProvider, { value: { getStyles }, children: /* @__PURE__ */ jsxs(
    SliderRoot,
    {
      ...others,
      ref: useMergedRef(ref, root),
      onKeyDownCapture: handleTrackKeydownCapture,
      onMouseDownCapture: () => root.current?.focus(),
      size,
      disabled,
      children: [
        /* @__PURE__ */ jsx(
          Track,
          {
            inverted,
            offset: 0,
            filled: position,
            marks,
            min: domainMin,
            max: domainMax,
            value: scaledValue,
            disabled,
            containerProps: {
              ref: container,
              onMouseEnter: showLabelOnHover ? () => setHovered(true) : void 0,
              onMouseLeave: showLabelOnHover ? () => setHovered(false) : void 0
            },
            children: /* @__PURE__ */ jsx(
              Thumb,
              {
                max: domainMax,
                min: domainMin,
                value: scaledValue,
                position,
                dragging: active,
                label: _label,
                ref: thumb,
                labelTransitionProps,
                labelAlwaysOn,
                thumbLabel,
                showLabelOnHover,
                isHovered: hovered,
                disabled,
                ...thumbProps,
                children: thumbChildren
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("input", { type: "hidden", name, value: scaledValue, ...hiddenInputProps })
      ]
    }
  ) });
});
Slider.classes = classes;
Slider.displayName = "@mantine/core/Slider";

export { Slider };
//# sourceMappingURL=Slider.mjs.map

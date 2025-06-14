'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var hooks = require('@mantine/hooks');
var rem = require('../../../core/utils/units-converters/rem.cjs');
var getSize = require('../../../core/utils/get-size/get-size.cjs');
var findClosestNumber = require('../../../core/utils/find-closest-number/find-closest-number.cjs');
var createVarsResolver = require('../../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
require('clsx');
var getThemeColor = require('../../../core/MantineProvider/color-functions/get-theme-color/get-theme-color.cjs');
require('../../../core/MantineProvider/Mantine.context.cjs');
require('../../../core/MantineProvider/default-theme.cjs');
require('../../../core/MantineProvider/MantineProvider.cjs');
require('../../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../../core/MantineProvider/use-props/use-props.cjs');
require('../../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var useStyles = require('../../../core/styles-api/use-styles/use-styles.cjs');
require('../../../core/Box/Box.cjs');
var factory = require('../../../core/factory/factory.cjs');
var DirectionProvider = require('../../../core/DirectionProvider/DirectionProvider.cjs');
var Slider_context = require('../Slider.context.cjs');
var SliderRoot = require('../SliderRoot/SliderRoot.cjs');
var Thumb = require('../Thumb/Thumb.cjs');
var Track = require('../Track/Track.cjs');
var getChangeValue = require('../utils/get-change-value/get-change-value.cjs');
var getClientPosition = require('../utils/get-client-position/get-client-position.cjs');
var getGloatingValue = require('../utils/get-floating-value/get-gloating-value.cjs');
var getPosition = require('../utils/get-position/get-position.cjs');
var getPrecision = require('../utils/get-precision/get-precision.cjs');
var getStepMarkValue = require('../utils/get-step-mark-value/get-step-mark-value.cjs');
var Slider_module = require('../Slider.module.css.cjs');

const varsResolver = createVarsResolver.createVarsResolver(
  (theme, { size, color, thumbSize, radius }) => ({
    root: {
      "--slider-size": getSize.getSize(size, "slider-size"),
      "--slider-color": color ? getThemeColor.getThemeColor(color, theme) : void 0,
      "--slider-radius": radius === void 0 ? void 0 : getSize.getRadius(radius),
      "--slider-thumb-size": thumbSize !== void 0 ? rem.rem(thumbSize) : "calc(var(--slider-size) * 2)"
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
const RangeSlider = factory.factory((_props, ref) => {
  const props = useProps.useProps("RangeSlider", defaultProps, _props);
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
  const getStyles = useStyles.useStyles({
    name: "Slider",
    props,
    classes: Slider_module,
    classNames,
    className,
    styles,
    style,
    vars,
    varsResolver,
    unstyled
  });
  const containerRef = React.useRef(null);
  const { dir } = DirectionProvider.useDirection();
  const [focused, setFocused] = React.useState(-1);
  const [hovered, setHovered] = React.useState(false);
  const [_value, setValue] = hooks.useUncontrolled({
    value,
    defaultValue,
    finalValue: [min, max],
    onChange
  });
  const valueRef = React.useRef(_value);
  const thumbs = React.useRef([]);
  const root = React.useRef(null);
  const thumbIndex = React.useRef(void 0);
  const [domainMin, domainMax] = domain || [min, max];
  const positions = [
    getPosition.getPosition({ value: _value[0], min: domainMin, max: domainMax }),
    getPosition.getPosition({ value: _value[1], min: domainMin, max: domainMax })
  ];
  const precision = _precision ?? getPrecision.getPrecision(step);
  const _setValue = (val) => {
    setValue(val);
    valueRef.current = val;
  };
  React.useEffect(
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
      const closest = findClosestNumber.findClosestNumber(
        val,
        marks.map((m) => m.value)
      );
      const current = clone[index];
      clone[index] = closest;
      const otherIndex = index === 0 ? 1 : 0;
      const lastMarkValue = getStepMarkValue.getLastMarkValue(marks);
      const firstMarkValue = getStepMarkValue.getFirstMarkValue(marks);
      if (closest === lastMarkValue && clone[otherIndex] === lastMarkValue) {
        clone[index] = current;
      } else if (closest === firstMarkValue && clone[otherIndex] === firstMarkValue) {
        clone[index] = current;
      } else if (closest === clone[otherIndex]) {
        if (current > clone[otherIndex]) {
          clone[otherIndex] = getStepMarkValue.getPreviousMarkValue(closest, marks);
        } else {
          clone[otherIndex] = getStepMarkValue.getNextMarkValue(closest, marks);
        }
      }
    } else {
      const clampedVal = hooks.clamp(val, min, max);
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
    clone[0] = getGloatingValue.getFloatingValue(clone[0], precision);
    clone[1] = getGloatingValue.getFloatingValue(clone[1], precision);
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
      const nextValue = getChangeValue.getChangeValue({
        value: val,
        min: domainMin,
        max: domainMax,
        step,
        precision
      });
      setRangedValue(nextValue, thumbIndex.current, false);
    }
  };
  const { ref: useMoveRef, active } = hooks.useMove(
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
      const changePosition = getClientPosition.getClientPosition(event.nativeEvent);
      const changeValue = getChangeValue.getChangeValue({
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
          const nextValue = restrictToMarks && marks ? getStepMarkValue.getNextMarkValue(valueRef.current[focusedIndex], marks) : Math.min(Math.max(valueRef.current[focusedIndex] + step, min), max);
          setRangedValue(getGloatingValue.getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? (dir === "rtl" ? getStepMarkValue.getPreviousMarkValue : getStepMarkValue.getNextMarkValue)(
            valueRef.current[focusedIndex],
            marks
          ) : Math.min(
            Math.max(
              dir === "rtl" ? valueRef.current[focusedIndex] - step : valueRef.current[focusedIndex] + step,
              min
            ),
            max
          );
          setRangedValue(getGloatingValue.getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? getStepMarkValue.getPreviousMarkValue(valueRef.current[focusedIndex], marks) : Math.min(Math.max(valueRef.current[focusedIndex] - step, min), max);
          setRangedValue(getGloatingValue.getFloatingValue(nextValue, precision), focusedIndex, true);
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          const focusedIndex = getFocusedThumbIndex();
          thumbs.current[focusedIndex].focus();
          const nextValue = restrictToMarks && marks ? (dir === "rtl" ? getStepMarkValue.getNextMarkValue : getStepMarkValue.getPreviousMarkValue)(
            valueRef.current[focusedIndex],
            marks
          ) : Math.min(
            Math.max(
              dir === "rtl" ? valueRef.current[focusedIndex] + step : valueRef.current[focusedIndex] - step,
              min
            ),
            max
          );
          setRangedValue(getGloatingValue.getFloatingValue(nextValue, precision), focusedIndex, true);
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
  return /* @__PURE__ */ jsxRuntime.jsx(Slider_context.SliderProvider, { value: { getStyles }, children: /* @__PURE__ */ jsxRuntime.jsxs(
    SliderRoot.SliderRoot,
    {
      ...others,
      size,
      ref: hooks.useMergedRef(ref, root),
      disabled,
      onMouseDownCapture: () => root.current?.focus(),
      onKeyDownCapture: () => {
        if (thumbs.current[0]?.parentElement?.contains(document.activeElement)) {
          return;
        }
        thumbs.current[0]?.focus();
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          Track.Track,
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
              ref: hooks.useMergedRef(containerRef, useMoveRef),
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
              /* @__PURE__ */ jsxRuntime.jsx(
                Thumb.Thumb,
                {
                  ...sharedThumbProps,
                  value: scale(_value[0]),
                  position: positions[0],
                  dragging: active,
                  label: typeof label === "function" ? label(getGloatingValue.getFloatingValue(scale(_value[0]), precision)) : label,
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
              /* @__PURE__ */ jsxRuntime.jsx(
                Thumb.Thumb,
                {
                  ...sharedThumbProps,
                  thumbLabel: thumbToLabel,
                  value: scale(_value[1]),
                  position: positions[1],
                  dragging: active,
                  label: typeof label === "function" ? label(getGloatingValue.getFloatingValue(scale(_value[1]), precision)) : label,
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
        /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name: `${name}_from`, value: _value[0], ...hiddenInputProps }),
        /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name: `${name}_to`, value: _value[1], ...hiddenInputProps })
      ]
    }
  ) });
});
RangeSlider.classes = Slider_module;
RangeSlider.displayName = "@mantine/core/RangeSlider";

exports.RangeSlider = RangeSlider;
//# sourceMappingURL=RangeSlider.cjs.map

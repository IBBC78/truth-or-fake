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
var getGloatingValue = require('../utils/get-floating-value/get-gloating-value.cjs');
var getPosition = require('../utils/get-position/get-position.cjs');
var getPrecision = require('../utils/get-precision/get-precision.cjs');
var getStepMarkValue = require('../utils/get-step-mark-value/get-step-mark-value.cjs');
var Slider_module = require('../Slider.module.css.cjs');

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
const Slider = factory.factory((_props, ref) => {
  const props = useProps.useProps("Slider", defaultProps, _props);
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
  const { dir } = DirectionProvider.useDirection();
  const [hovered, setHovered] = React.useState(false);
  const [_value, setValue] = hooks.useUncontrolled({
    value: typeof value === "number" ? hooks.clamp(value, min, max) : value,
    defaultValue: typeof defaultValue === "number" ? hooks.clamp(defaultValue, min, max) : defaultValue,
    finalValue: hooks.clamp(0, min, max),
    onChange
  });
  const valueRef = React.useRef(_value);
  const onChangeEndRef = React.useRef(onChangeEnd);
  React.useEffect(() => {
    onChangeEndRef.current = onChangeEnd;
  }, [onChangeEnd]);
  const root = React.useRef(null);
  const thumb = React.useRef(null);
  const [domainMin, domainMax] = domain || [min, max];
  const position = getPosition.getPosition({ value: _value, min: domainMin, max: domainMax });
  const scaledValue = scale(_value);
  const _label = typeof label === "function" ? label(scaledValue) : label;
  const precision = _precision ?? getPrecision.getPrecision(step);
  const handleChange = React.useCallback(
    ({ x }) => {
      if (!disabled) {
        const nextValue = getChangeValue.getChangeValue({
          value: x,
          min: domainMin,
          max: domainMax,
          step,
          precision
        });
        const clampedValue = hooks.clamp(nextValue, min, max);
        setValue(
          restrictToMarks && marks?.length ? findClosestNumber.findClosestNumber(
            clampedValue,
            marks.map((mark) => mark.value)
          ) : clampedValue
        );
        valueRef.current = clampedValue;
      }
    },
    [disabled, min, max, domainMin, domainMax, step, precision, setValue, marks, restrictToMarks]
  );
  const handleScrubEnd = React.useCallback(() => {
    if (!disabled && onChangeEndRef.current) {
      const finalValue = restrictToMarks && marks?.length ? findClosestNumber.findClosestNumber(
        valueRef.current,
        marks.map((mark) => mark.value)
      ) : valueRef.current;
      onChangeEndRef.current(finalValue);
    }
  }, [disabled, marks, restrictToMarks]);
  const { ref: container, active } = hooks.useMove(handleChange, { onScrubEnd: handleScrubEnd }, dir);
  const callOnChangeEnd = React.useCallback(
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
            const nextValue2 = getStepMarkValue.getNextMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getGloatingValue.getFloatingValue(
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
            const nextValue2 = dir === "rtl" ? getStepMarkValue.getPreviousMarkValue(_value, marks) : getStepMarkValue.getNextMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getGloatingValue.getFloatingValue(
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
            const nextValue2 = getStepMarkValue.getPreviousMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getGloatingValue.getFloatingValue(
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
            const nextValue2 = dir === "rtl" ? getStepMarkValue.getNextMarkValue(_value, marks) : getStepMarkValue.getPreviousMarkValue(_value, marks);
            setValue(nextValue2);
            callOnChangeEnd(nextValue2);
            break;
          }
          const nextValue = getGloatingValue.getFloatingValue(
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
            setValue(getStepMarkValue.getFirstMarkValue(marks));
            callOnChangeEnd(getStepMarkValue.getFirstMarkValue(marks));
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
            setValue(getStepMarkValue.getLastMarkValue(marks));
            callOnChangeEnd(getStepMarkValue.getLastMarkValue(marks));
            break;
          }
          setValue(max);
          callOnChangeEnd(max);
          break;
        }
      }
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(Slider_context.SliderProvider, { value: { getStyles }, children: /* @__PURE__ */ jsxRuntime.jsxs(
    SliderRoot.SliderRoot,
    {
      ...others,
      ref: hooks.useMergedRef(ref, root),
      onKeyDownCapture: handleTrackKeydownCapture,
      onMouseDownCapture: () => root.current?.focus(),
      size,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          Track.Track,
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
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Thumb.Thumb,
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
        /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", name, value: scaledValue, ...hiddenInputProps })
      ]
    }
  ) });
});
Slider.classes = Slider_module;
Slider.displayName = "@mantine/core/Slider";

exports.Slider = Slider;
//# sourceMappingURL=Slider.cjs.map

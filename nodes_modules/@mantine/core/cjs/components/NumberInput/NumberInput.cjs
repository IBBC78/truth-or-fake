'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var cx = require('clsx');
var reactNumberFormat = require('react-number-format');
var hooks = require('@mantine/hooks');
var noop = require('../../core/utils/noop/noop.cjs');
var getSize = require('../../core/utils/get-size/get-size.cjs');
var createVarsResolver = require('../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
var useResolvedStylesApi = require('../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
require('../../core/Box/Box.cjs');
var factory = require('../../core/factory/factory.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');
var InputBase = require('../InputBase/InputBase.cjs');
var UnstyledButton = require('../UnstyledButton/UnstyledButton.cjs');
var NumberInputChevron = require('./NumberInputChevron.cjs');
var NumberInput_module = require('./NumberInput.module.css.cjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var cx__default = /*#__PURE__*/_interopDefault(cx);

const leadingDecimalZeroPattern = /^(0\.0*|-0(\.0*)?)$/;
const leadingZerosPattern = /^-?0\d+(\.\d+)?\.?$/;
function isNumberString(value) {
  return typeof value === "string" && value !== "" && !Number.isNaN(Number(value));
}
function canIncrement(value) {
  if (typeof value === "number") {
    return value < Number.MAX_SAFE_INTEGER;
  }
  return value === "" || isNumberString(value) && Number(value) < Number.MAX_SAFE_INTEGER;
}
function getDecimalPlaces(inputValue) {
  return inputValue.toString().replace(".", "").length;
}
function isValidNumber(floatValue, value) {
  return (typeof floatValue === "number" ? floatValue < Number.MAX_SAFE_INTEGER : !Number.isNaN(Number(floatValue))) && !Number.isNaN(floatValue) && getDecimalPlaces(value) < 14 && value !== "";
}
function isInRange(value, min, max) {
  if (value === void 0) {
    return true;
  }
  const minValid = min === void 0 || value >= min;
  const maxValid = max === void 0 || value <= max;
  return minValid && maxValid;
}
const defaultProps = {
  step: 1,
  clampBehavior: "blur",
  allowDecimal: true,
  allowNegative: true,
  withKeyboardEvents: true,
  allowLeadingZeros: true,
  trimLeadingZeroesOnBlur: true,
  startValue: 0
};
const varsResolver = createVarsResolver.createVarsResolver((_, { size }) => ({
  controls: {
    "--ni-chevron-size": getSize.getSize(size, "ni-chevron-size")
  }
}));
function clampAndSanitizeInput(sanitizedValue, max, min) {
  const replaced = sanitizedValue.toString().replace(/^0+/, "");
  const parsedValue = parseFloat(replaced);
  if (Number.isNaN(parsedValue)) {
    return replaced;
  } else if (parsedValue > Number.MAX_SAFE_INTEGER) {
    return max !== void 0 ? String(max) : replaced;
  }
  return hooks.clamp(parsedValue, min, max);
}
const NumberInput = factory.factory((_props, ref) => {
  const props = useProps.useProps("NumberInput", defaultProps, _props);
  const {
    className,
    classNames,
    styles,
    unstyled,
    vars,
    onChange,
    onValueChange,
    value,
    defaultValue,
    max,
    min,
    step,
    hideControls,
    rightSection,
    isAllowed,
    clampBehavior,
    onBlur,
    allowDecimal,
    decimalScale,
    onKeyDown,
    onKeyDownCapture,
    handlersRef,
    startValue,
    disabled,
    rightSectionPointerEvents,
    allowNegative,
    readOnly,
    size,
    rightSectionWidth,
    stepHoldInterval,
    stepHoldDelay,
    allowLeadingZeros,
    withKeyboardEvents,
    trimLeadingZeroesOnBlur,
    ...others
  } = props;
  const getStyles = useStyles.useStyles({
    name: "NumberInput",
    classes: NumberInput_module,
    props,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi.useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const [_value, setValue] = hooks.useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const shouldUseStepInterval = stepHoldDelay !== void 0 && stepHoldInterval !== void 0;
  const inputRef = React.useRef(null);
  const onStepTimeoutRef = React.useRef(null);
  const stepCountRef = React.useRef(0);
  const handleValueChange = (payload, event) => {
    if (event.source === "event") {
      setValue(
        isValidNumber(payload.floatValue, payload.value) && !leadingDecimalZeroPattern.test(payload.value) && !(allowLeadingZeros ? leadingZerosPattern.test(payload.value) : false) ? payload.floatValue : payload.value
      );
    }
    onValueChange?.(payload, event);
  };
  const getDecimalPlaces2 = (inputValue) => {
    const match = String(inputValue).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  };
  const adjustCursor = (position) => {
    if (inputRef.current && typeof position !== "undefined") {
      inputRef.current.setSelectionRange(position, position);
    }
  };
  const incrementRef = React.useRef(noop.noop);
  incrementRef.current = () => {
    if (!canIncrement(_value)) {
      return;
    }
    let val;
    const currentValuePrecision = getDecimalPlaces2(_value);
    const stepPrecision = getDecimalPlaces2(step);
    const maxPrecision = Math.max(currentValuePrecision, stepPrecision);
    const factor = 10 ** maxPrecision;
    if (!isNumberString(_value) && (typeof _value !== "number" || Number.isNaN(_value))) {
      val = hooks.clamp(startValue, min, max);
    } else if (max !== void 0) {
      const incrementedValue = (Math.round(Number(_value) * factor) + Math.round(step * factor)) / factor;
      val = incrementedValue <= max ? incrementedValue : max;
    } else {
      val = (Math.round(Number(_value) * factor) + Math.round(step * factor)) / factor;
    }
    const formattedValue = val.toFixed(maxPrecision);
    setValue(parseFloat(formattedValue));
    onValueChange?.(
      { floatValue: parseFloat(formattedValue), formattedValue, value: formattedValue },
      { source: "increment" }
    );
    setTimeout(() => adjustCursor(inputRef.current?.value.length), 0);
  };
  const decrementRef = React.useRef(noop.noop);
  decrementRef.current = () => {
    if (!canIncrement(_value)) {
      return;
    }
    let val;
    const minValue = min !== void 0 ? min : !allowNegative ? 0 : Number.MIN_SAFE_INTEGER;
    const currentValuePrecision = getDecimalPlaces2(_value);
    const stepPrecision = getDecimalPlaces2(step);
    const maxPrecision = Math.max(currentValuePrecision, stepPrecision);
    const factor = 10 ** maxPrecision;
    if (!isNumberString(_value) && typeof _value !== "number" || Number.isNaN(_value)) {
      val = hooks.clamp(startValue, minValue, max);
    } else {
      const decrementedValue = (Math.round(Number(_value) * factor) - Math.round(step * factor)) / factor;
      val = minValue !== void 0 && decrementedValue < minValue ? minValue : decrementedValue;
    }
    const formattedValue = val.toFixed(maxPrecision);
    setValue(parseFloat(formattedValue));
    onValueChange?.(
      { floatValue: parseFloat(formattedValue), formattedValue, value: formattedValue },
      { source: "decrement" }
    );
    setTimeout(() => adjustCursor(inputRef.current?.value.length), 0);
  };
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (readOnly || !withKeyboardEvents) {
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      incrementRef.current?.();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      decrementRef.current?.();
    }
  };
  const handleKeyDownCapture = (event) => {
    onKeyDownCapture?.(event);
    if (event.key === "Backspace") {
      const input = inputRef.current;
      if (input && input.selectionStart === 0 && input.selectionStart === input.selectionEnd) {
        event.preventDefault();
        window.setTimeout(() => adjustCursor(0), 0);
      }
    }
  };
  const handleBlur = (event) => {
    let sanitizedValue = _value;
    if (clampBehavior === "blur" && typeof sanitizedValue === "number") {
      sanitizedValue = hooks.clamp(sanitizedValue, min, max);
    }
    if (trimLeadingZeroesOnBlur && typeof sanitizedValue === "string" && getDecimalPlaces2(sanitizedValue) < 15) {
      sanitizedValue = clampAndSanitizeInput(sanitizedValue, max, min);
    }
    if (_value !== sanitizedValue) {
      setValue(sanitizedValue);
    }
    onBlur?.(event);
  };
  hooks.assignRef(handlersRef, { increment: incrementRef.current, decrement: decrementRef.current });
  const onStepHandleChange = (isIncrement) => {
    if (isIncrement) {
      incrementRef.current?.();
    } else {
      decrementRef.current?.();
    }
    stepCountRef.current += 1;
  };
  const onStepLoop = (isIncrement) => {
    onStepHandleChange(isIncrement);
    if (shouldUseStepInterval) {
      const interval = typeof stepHoldInterval === "number" ? stepHoldInterval : stepHoldInterval(stepCountRef.current);
      onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), interval);
    }
  };
  const onStep = (event, isIncrement) => {
    event.preventDefault();
    inputRef.current?.focus();
    onStepHandleChange(isIncrement);
    if (shouldUseStepInterval) {
      onStepTimeoutRef.current = window.setTimeout(() => onStepLoop(isIncrement), stepHoldDelay);
    }
  };
  const onStepDone = () => {
    if (onStepTimeoutRef.current) {
      window.clearTimeout(onStepTimeoutRef.current);
    }
    onStepTimeoutRef.current = null;
    stepCountRef.current = 0;
  };
  const controls = /* @__PURE__ */ jsxRuntime.jsxs("div", { ...getStyles("controls"), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      UnstyledButton.UnstyledButton,
      {
        ...getStyles("control"),
        tabIndex: -1,
        "aria-hidden": true,
        disabled: disabled || typeof _value === "number" && max !== void 0 && _value >= max,
        mod: { direction: "up" },
        onMouseDown: (event) => event.preventDefault(),
        onPointerDown: (event) => {
          onStep(event, true);
        },
        onPointerUp: onStepDone,
        onPointerLeave: onStepDone,
        children: /* @__PURE__ */ jsxRuntime.jsx(NumberInputChevron.NumberInputChevron, { direction: "up" })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      UnstyledButton.UnstyledButton,
      {
        ...getStyles("control"),
        tabIndex: -1,
        "aria-hidden": true,
        disabled: disabled || typeof _value === "number" && min !== void 0 && _value <= min,
        mod: { direction: "down" },
        onMouseDown: (event) => event.preventDefault(),
        onPointerDown: (event) => {
          onStep(event, false);
        },
        onPointerUp: onStepDone,
        onPointerLeave: onStepDone,
        children: /* @__PURE__ */ jsxRuntime.jsx(NumberInputChevron.NumberInputChevron, { direction: "down" })
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputBase.InputBase,
    {
      component: reactNumberFormat.NumericFormat,
      allowNegative,
      className: cx__default.default(NumberInput_module.root, className),
      size,
      ...others,
      readOnly,
      disabled,
      value: _value,
      getInputRef: hooks.useMergedRef(ref, inputRef),
      onValueChange: handleValueChange,
      rightSection: hideControls || readOnly || !canIncrement(_value) ? rightSection : rightSection || controls,
      classNames: resolvedClassNames,
      styles: resolvedStyles,
      unstyled,
      __staticSelector: "NumberInput",
      decimalScale: allowDecimal ? decimalScale : 0,
      onKeyDown: handleKeyDown,
      onKeyDownCapture: handleKeyDownCapture,
      rightSectionPointerEvents: rightSectionPointerEvents ?? (disabled ? "none" : void 0),
      rightSectionWidth: rightSectionWidth ?? `var(--ni-right-section-width-${size || "sm"})`,
      allowLeadingZeros,
      onBlur: handleBlur,
      isAllowed: (val) => {
        if (clampBehavior === "strict") {
          if (isAllowed) {
            return isAllowed(val) && isInRange(val.floatValue, min, max);
          }
          return isInRange(val.floatValue, min, max);
        }
        return isAllowed ? isAllowed(val) : true;
      }
    }
  );
});
NumberInput.classes = { ...InputBase.InputBase.classes, ...NumberInput_module };
NumberInput.displayName = "@mantine/core/NumberInput";

exports.NumberInput = NumberInput;
//# sourceMappingURL=NumberInput.cjs.map

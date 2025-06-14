'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef } from 'react';
import cx from 'clsx';
import { NumericFormat } from 'react-number-format';
import { useUncontrolled, clamp, assignRef, useMergedRef } from '@mantine/hooks';
import { noop } from '../../core/utils/noop/noop.mjs';
import { getSize } from '../../core/utils/get-size/get-size.mjs';
import { createVarsResolver } from '../../core/styles-api/create-vars-resolver/create-vars-resolver.mjs';
import { useResolvedStylesApi } from '../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.mjs';
import { useStyles } from '../../core/styles-api/use-styles/use-styles.mjs';
import '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../core/MantineProvider/use-props/use-props.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import '../../core/Box/Box.mjs';
import { factory } from '../../core/factory/factory.mjs';
import '../../core/DirectionProvider/DirectionProvider.mjs';
import { InputBase } from '../InputBase/InputBase.mjs';
import { UnstyledButton } from '../UnstyledButton/UnstyledButton.mjs';
import { NumberInputChevron } from './NumberInputChevron.mjs';
import classes from './NumberInput.module.css.mjs';

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
const varsResolver = createVarsResolver((_, { size }) => ({
  controls: {
    "--ni-chevron-size": getSize(size, "ni-chevron-size")
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
  return clamp(parsedValue, min, max);
}
const NumberInput = factory((_props, ref) => {
  const props = useProps("NumberInput", defaultProps, _props);
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
  const getStyles = useStyles({
    name: "NumberInput",
    classes,
    props,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
    classNames,
    styles,
    props
  });
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: "",
    onChange
  });
  const shouldUseStepInterval = stepHoldDelay !== void 0 && stepHoldInterval !== void 0;
  const inputRef = useRef(null);
  const onStepTimeoutRef = useRef(null);
  const stepCountRef = useRef(0);
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
  const incrementRef = useRef(noop);
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
      val = clamp(startValue, min, max);
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
  const decrementRef = useRef(noop);
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
      val = clamp(startValue, minValue, max);
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
      sanitizedValue = clamp(sanitizedValue, min, max);
    }
    if (trimLeadingZeroesOnBlur && typeof sanitizedValue === "string" && getDecimalPlaces2(sanitizedValue) < 15) {
      sanitizedValue = clampAndSanitizeInput(sanitizedValue, max, min);
    }
    if (_value !== sanitizedValue) {
      setValue(sanitizedValue);
    }
    onBlur?.(event);
  };
  assignRef(handlersRef, { increment: incrementRef.current, decrement: decrementRef.current });
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
  const controls = /* @__PURE__ */ jsxs("div", { ...getStyles("controls"), children: [
    /* @__PURE__ */ jsx(
      UnstyledButton,
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
        children: /* @__PURE__ */ jsx(NumberInputChevron, { direction: "up" })
      }
    ),
    /* @__PURE__ */ jsx(
      UnstyledButton,
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
        children: /* @__PURE__ */ jsx(NumberInputChevron, { direction: "down" })
      }
    )
  ] });
  return /* @__PURE__ */ jsx(
    InputBase,
    {
      component: NumericFormat,
      allowNegative,
      className: cx(classes.root, className),
      size,
      ...others,
      readOnly,
      disabled,
      value: _value,
      getInputRef: useMergedRef(ref, inputRef),
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
NumberInput.classes = { ...InputBase.classes, ...classes };
NumberInput.displayName = "@mantine/core/NumberInput";

export { NumberInput };
//# sourceMappingURL=NumberInput.mjs.map

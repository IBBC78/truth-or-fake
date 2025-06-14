'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useId, useUncontrolled } from '@mantine/hooks';
import 'react';
import { getRadius, getSize } from '../../core/utils/get-size/get-size.mjs';
import { createVarsResolver } from '../../core/styles-api/create-vars-resolver/create-vars-resolver.mjs';
import 'clsx';
import { getThemeColor } from '../../core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs';
import '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../core/MantineProvider/use-props/use-props.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import { useStyles } from '../../core/styles-api/use-styles/use-styles.mjs';
import { extractStyleProps } from '../../core/Box/style-props/extract-style-props/extract-style-props.mjs';
import { Box } from '../../core/Box/Box.mjs';
import { factory } from '../../core/factory/factory.mjs';
import '../../core/DirectionProvider/DirectionProvider.mjs';
import { InlineInputClasses, InlineInput } from '../InlineInput/InlineInput.mjs';
import { useSwitchGroupContext } from './SwitchGroup.context.mjs';
import { SwitchGroup } from './SwitchGroup/SwitchGroup.mjs';
import classes from './Switch.module.css.mjs';

const defaultProps = {
  labelPosition: "right",
  withThumbIndicator: true
};
const varsResolver = createVarsResolver((theme, { radius, color, size }) => ({
  root: {
    "--switch-radius": radius === void 0 ? void 0 : getRadius(radius),
    "--switch-height": getSize(size, "switch-height"),
    "--switch-width": getSize(size, "switch-width"),
    "--switch-thumb-size": getSize(size, "switch-thumb-size"),
    "--switch-label-font-size": getSize(size, "switch-label-font-size"),
    "--switch-track-label-padding": getSize(size, "switch-track-label-padding"),
    "--switch-color": color ? getThemeColor(color, theme) : void 0
  }
}));
const Switch = factory((_props, ref) => {
  const props = useProps("Switch", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    color,
    label,
    offLabel,
    onLabel,
    id,
    size,
    radius,
    wrapperProps,
    thumbIcon,
    checked,
    defaultChecked,
    onChange,
    labelPosition,
    description,
    error,
    disabled,
    variant,
    rootRef,
    mod,
    withThumbIndicator,
    ...others
  } = props;
  const ctx = useSwitchGroupContext();
  const _size = size || ctx?.size;
  const getStyles = useStyles({
    name: "Switch",
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const { styleProps, rest } = extractStyleProps(others);
  const uuid = useId(id);
  const contextProps = ctx ? {
    checked: ctx.value.includes(rest.value),
    onChange: ctx.onChange
  } : {};
  const [_checked, handleChange] = useUncontrolled({
    value: contextProps.checked ?? checked,
    defaultValue: defaultChecked,
    finalValue: false
  });
  return /* @__PURE__ */ jsxs(
    InlineInput,
    {
      ...getStyles("root"),
      __staticSelector: "Switch",
      __stylesApiProps: props,
      id: uuid,
      size: _size,
      labelPosition,
      label,
      description,
      error,
      disabled,
      bodyElement: "label",
      labelElement: "span",
      classNames,
      styles,
      unstyled,
      "data-checked": contextProps.checked || checked || void 0,
      variant,
      ref: rootRef,
      mod,
      ...styleProps,
      ...wrapperProps,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ...rest,
            disabled,
            checked: _checked,
            "data-checked": contextProps.checked || checked || void 0,
            onChange: (event) => {
              ctx ? contextProps.onChange?.(event) : onChange?.(event);
              handleChange(event.currentTarget.checked);
            },
            id: uuid,
            ref,
            type: "checkbox",
            role: "switch",
            ...getStyles("input")
          }
        ),
        /* @__PURE__ */ jsxs(
          Box,
          {
            "aria-hidden": "true",
            component: "span",
            mod: { error, "label-position": labelPosition, "without-labels": !onLabel && !offLabel },
            ...getStyles("track"),
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  component: "span",
                  mod: { "reduce-motion": true, "with-thumb-indicator": withThumbIndicator && !thumbIcon },
                  ...getStyles("thumb"),
                  children: thumbIcon
                }
              ),
              /* @__PURE__ */ jsx("span", { ...getStyles("trackLabel"), children: _checked ? onLabel : offLabel })
            ]
          }
        )
      ]
    }
  );
});
Switch.classes = { ...classes, ...InlineInputClasses };
Switch.displayName = "@mantine/core/Switch";
Switch.Group = SwitchGroup;

export { Switch };
//# sourceMappingURL=Switch.mjs.map

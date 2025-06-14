'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var hooks = require('@mantine/hooks');
require('react');
var getSize = require('../../core/utils/get-size/get-size.cjs');
var createVarsResolver = require('../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
require('clsx');
var getThemeColor = require('../../core/MantineProvider/color-functions/get-theme-color/get-theme-color.cjs');
require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
var extractStyleProps = require('../../core/Box/style-props/extract-style-props/extract-style-props.cjs');
var Box = require('../../core/Box/Box.cjs');
var factory = require('../../core/factory/factory.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');
var InlineInput = require('../InlineInput/InlineInput.cjs');
var SwitchGroup_context = require('./SwitchGroup.context.cjs');
var SwitchGroup = require('./SwitchGroup/SwitchGroup.cjs');
var Switch_module = require('./Switch.module.css.cjs');

const defaultProps = {
  labelPosition: "right",
  withThumbIndicator: true
};
const varsResolver = createVarsResolver.createVarsResolver((theme, { radius, color, size }) => ({
  root: {
    "--switch-radius": radius === void 0 ? void 0 : getSize.getRadius(radius),
    "--switch-height": getSize.getSize(size, "switch-height"),
    "--switch-width": getSize.getSize(size, "switch-width"),
    "--switch-thumb-size": getSize.getSize(size, "switch-thumb-size"),
    "--switch-label-font-size": getSize.getSize(size, "switch-label-font-size"),
    "--switch-track-label-padding": getSize.getSize(size, "switch-track-label-padding"),
    "--switch-color": color ? getThemeColor.getThemeColor(color, theme) : void 0
  }
}));
const Switch = factory.factory((_props, ref) => {
  const props = useProps.useProps("Switch", defaultProps, _props);
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
  const ctx = SwitchGroup_context.useSwitchGroupContext();
  const _size = size || ctx?.size;
  const getStyles = useStyles.useStyles({
    name: "Switch",
    props,
    classes: Switch_module,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const { styleProps, rest } = extractStyleProps.extractStyleProps(others);
  const uuid = hooks.useId(id);
  const contextProps = ctx ? {
    checked: ctx.value.includes(rest.value),
    onChange: ctx.onChange
  } : {};
  const [_checked, handleChange] = hooks.useUncontrolled({
    value: contextProps.checked ?? checked,
    defaultValue: defaultChecked,
    finalValue: false
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(
    InlineInput.InlineInput,
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
        /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsxs(
          Box.Box,
          {
            "aria-hidden": "true",
            component: "span",
            mod: { error, "label-position": labelPosition, "without-labels": !onLabel && !offLabel },
            ...getStyles("track"),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                Box.Box,
                {
                  component: "span",
                  mod: { "reduce-motion": true, "with-thumb-indicator": withThumbIndicator && !thumbIcon },
                  ...getStyles("thumb"),
                  children: thumbIcon
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx("span", { ...getStyles("trackLabel"), children: _checked ? onLabel : offLabel })
            ]
          }
        )
      ]
    }
  );
});
Switch.classes = { ...Switch_module, ...InlineInput.InlineInputClasses };
Switch.displayName = "@mantine/core/Switch";
Switch.Group = SwitchGroup.SwitchGroup;

exports.Switch = Switch;
//# sourceMappingURL=Switch.cjs.map

'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var rem = require('../../core/utils/units-converters/rem.cjs');
require('react');
require('@mantine/hooks');
var createVarsResolver = require('../../core/styles-api/create-vars-resolver/create-vars-resolver.cjs');
require('clsx');
require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
var Box = require('../../core/Box/Box.cjs');
var factory = require('../../core/factory/factory.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');
var ScrollArea = require('../ScrollArea/ScrollArea.cjs');
var Table_module = require('./Table.module.css.cjs');

const defaultProps = {
  type: "scrollarea"
};
const varsResolver = createVarsResolver.createVarsResolver(
  (_, { minWidth, maxHeight, type }) => ({
    scrollContainer: {
      "--table-min-width": rem.rem(minWidth),
      "--table-max-height": rem.rem(maxHeight),
      "--table-overflow": type === "native" ? "auto" : void 0
    }
  })
);
const TableScrollContainer = factory.factory((_props, ref) => {
  const props = useProps.useProps("TableScrollContainer", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    children,
    minWidth,
    maxHeight,
    type,
    scrollAreaProps,
    ...others
  } = props;
  const getStyles = useStyles.useStyles({
    name: "TableScrollContainer",
    classes: Table_module,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
    rootSelector: "scrollContainer"
  });
  return /* @__PURE__ */ jsxRuntime.jsx(
    Box.Box,
    {
      component: type === "scrollarea" ? ScrollArea.ScrollArea : "div",
      ...type === "scrollarea" ? maxHeight ? { offsetScrollbars: "xy", ...scrollAreaProps } : { offsetScrollbars: "x", ...scrollAreaProps } : {},
      ref,
      ...getStyles("scrollContainer"),
      ...others,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { ...getStyles("scrollContainerInner"), children })
    }
  );
});
TableScrollContainer.classes = Table_module;
TableScrollContainer.displayName = "@mantine/core/TableScrollContainer";

exports.TableScrollContainer = TableScrollContainer;
//# sourceMappingURL=TableScrollContainer.cjs.map

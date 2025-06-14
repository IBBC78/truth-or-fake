'use client';
'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var hooks = require('@mantine/hooks');
require('clsx');
var useResolvedStylesApi = require('../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.cjs');
var useStyles = require('../../core/styles-api/use-styles/use-styles.cjs');
require('../../core/MantineProvider/Mantine.context.cjs');
require('../../core/MantineProvider/default-theme.cjs');
require('../../core/MantineProvider/MantineProvider.cjs');
require('../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.cjs');
var useProps = require('../../core/MantineProvider/use-props/use-props.cjs');
require('../../core/MantineProvider/MantineCssVariables/MantineCssVariables.cjs');
var extractStyleProps = require('../../core/Box/style-props/extract-style-props/extract-style-props.cjs');
require('../../core/Box/Box.cjs');
var factory = require('../../core/factory/factory.cjs');
require('../../core/DirectionProvider/DirectionProvider.cjs');
var getParsedComboboxData = require('../Combobox/get-parsed-combobox-data/get-parsed-combobox-data.cjs');
var getOptionsLockup = require('../Combobox/get-options-lockup/get-options-lockup.cjs');
require('../Combobox/ComboboxChevron/ComboboxChevron.cjs');
var Combobox = require('../Combobox/Combobox.cjs');
require('../Combobox/ComboboxDropdown/ComboboxDropdown.cjs');
require('../Combobox/ComboboxOptions/ComboboxOptions.cjs');
require('../Combobox/ComboboxOption/ComboboxOption.cjs');
require('../Combobox/ComboboxTarget/ComboboxTarget.cjs');
require('../Combobox/ComboboxSearch/ComboboxSearch.cjs');
require('../Combobox/ComboboxEmpty/ComboboxEmpty.cjs');
require('../Combobox/ComboboxFooter/ComboboxFooter.cjs');
require('../Combobox/ComboboxHeader/ComboboxHeader.cjs');
require('../Combobox/ComboboxEventsTarget/ComboboxEventsTarget.cjs');
require('../Combobox/ComboboxDropdownTarget/ComboboxDropdownTarget.cjs');
require('../Combobox/ComboboxGroup/ComboboxGroup.cjs');
require('../Combobox/ComboboxClearButton/ComboboxClearButton.cjs');
require('../Combobox/ComboboxHiddenInput/ComboboxHiddenInput.cjs');
var OptionsDropdown = require('../Combobox/OptionsDropdown/OptionsDropdown.cjs');
var useCombobox = require('../Combobox/use-combobox/use-combobox.cjs');
require('../Combobox/Combobox.context.cjs');
var InputBase = require('../InputBase/InputBase.cjs');
var Pill = require('../Pill/Pill.cjs');
require('../Pill/PillGroup/PillGroup.cjs');
var PillsInput = require('../PillsInput/PillsInput.cjs');
require('../PillsInput/PillsInputField/PillsInputField.cjs');
var filterPickedValues = require('./filter-picked-values.cjs');

const defaultProps = {
  maxValues: Infinity,
  withCheckIcon: true,
  checkIconPosition: "left",
  hiddenInputValuesDivider: ","
};
const MultiSelect = factory.factory((_props, ref) => {
  const props = useProps.useProps("MultiSelect", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    size,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    variant,
    data,
    dropdownOpened,
    defaultDropdownOpened,
    onDropdownOpen,
    onDropdownClose,
    selectFirstOptionOnChange,
    onOptionSubmit,
    comboboxProps,
    filter,
    limit,
    withScrollArea,
    maxDropdownHeight,
    searchValue,
    defaultSearchValue,
    onSearchChange,
    readOnly,
    disabled,
    onFocus,
    onBlur,
    radius,
    rightSection,
    rightSectionWidth,
    rightSectionPointerEvents,
    rightSectionProps,
    leftSection,
    leftSectionWidth,
    leftSectionPointerEvents,
    leftSectionProps,
    inputContainer,
    inputWrapperOrder,
    withAsterisk,
    labelProps,
    descriptionProps,
    errorProps,
    wrapperProps,
    description,
    label,
    error,
    maxValues,
    searchable,
    nothingFoundMessage,
    withCheckIcon,
    checkIconPosition,
    hidePickedOptions,
    withErrorStyles,
    name,
    form,
    id,
    clearable,
    clearButtonProps,
    hiddenInputProps,
    placeholder,
    hiddenInputValuesDivider,
    required,
    mod,
    renderOption,
    onRemove,
    onClear,
    scrollAreaProps,
    chevronColor,
    ...others
  } = props;
  const _id = hooks.useId(id);
  const parsedData = getParsedComboboxData.getParsedComboboxData(data);
  const optionsLockup = getOptionsLockup.getOptionsLockup(parsedData);
  const combobox = useCombobox.useCombobox({
    opened: dropdownOpened,
    defaultOpened: defaultDropdownOpened,
    onDropdownOpen,
    onDropdownClose: () => {
      onDropdownClose?.();
      combobox.resetSelectedOption();
    }
  });
  const {
    styleProps,
    rest: { type, autoComplete, ...rest }
  } = extractStyleProps.extractStyleProps(others);
  const [_value, setValue] = hooks.useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange
  });
  const [_searchValue, setSearchValue] = hooks.useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: "",
    onChange: onSearchChange
  });
  const handleSearchChange = (value2) => {
    setSearchValue(value2);
    combobox.resetSelectedOption();
  };
  const getStyles = useStyles.useStyles({
    name: "MultiSelect",
    classes: {},
    props,
    classNames,
    styles,
    unstyled
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi.useResolvedStylesApi({
    props,
    styles,
    classNames
  });
  const handleInputKeydown = (event) => {
    onKeyDown?.(event);
    if (event.key === " " && !searchable) {
      event.preventDefault();
      combobox.toggleDropdown();
    }
    if (event.key === "Backspace" && _searchValue.length === 0 && _value.length > 0) {
      onRemove?.(_value[_value.length - 1]);
      setValue(_value.slice(0, _value.length - 1));
    }
  };
  const values = _value.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
    Pill.Pill,
    {
      withRemoveButton: !readOnly && !optionsLockup[item]?.disabled,
      onRemove: () => {
        setValue(_value.filter((i) => item !== i));
        onRemove?.(item);
      },
      unstyled,
      disabled,
      ...getStyles("pill"),
      children: optionsLockup[item]?.label || item
    },
    `${item}-${index}`
  ));
  React.useEffect(() => {
    if (selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  }, [selectFirstOptionOnChange, _searchValue]);
  const clearButton = /* @__PURE__ */ jsxRuntime.jsx(
    Combobox.Combobox.ClearButton,
    {
      ...clearButtonProps,
      onClear: () => {
        onClear?.();
        setValue([]);
        handleSearchChange("");
      }
    }
  );
  const filteredData = filterPickedValues.filterPickedValues({ data: parsedData, value: _value });
  const _clearable = clearable && _value.length > 0 && !disabled && !readOnly;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      Combobox.Combobox,
      {
        store: combobox,
        classNames: resolvedClassNames,
        styles: resolvedStyles,
        unstyled,
        size,
        readOnly,
        __staticSelector: "MultiSelect",
        onOptionSubmit: (val) => {
          onOptionSubmit?.(val);
          handleSearchChange("");
          combobox.updateSelectedOptionIndex("selected");
          if (_value.includes(optionsLockup[val].value)) {
            setValue(_value.filter((v) => v !== optionsLockup[val].value));
            onRemove?.(optionsLockup[val].value);
          } else if (_value.length < maxValues) {
            setValue([..._value, optionsLockup[val].value]);
          }
        },
        ...comboboxProps,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(Combobox.Combobox.DropdownTarget, { children: /* @__PURE__ */ jsxRuntime.jsx(
            PillsInput.PillsInput,
            {
              ...styleProps,
              __staticSelector: "MultiSelect",
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              unstyled,
              size,
              className,
              style,
              variant,
              disabled,
              radius,
              __defaultRightSection: /* @__PURE__ */ jsxRuntime.jsx(
                Combobox.Combobox.Chevron,
                {
                  size,
                  error,
                  unstyled,
                  color: chevronColor
                }
              ),
              __clearSection: clearButton,
              __clearable: _clearable,
              rightSection,
              rightSectionPointerEvents: rightSectionPointerEvents || (clearButton ? "all" : "none"),
              rightSectionWidth,
              rightSectionProps,
              leftSection,
              leftSectionWidth,
              leftSectionPointerEvents,
              leftSectionProps,
              inputContainer,
              inputWrapperOrder,
              withAsterisk,
              labelProps,
              descriptionProps,
              errorProps,
              wrapperProps,
              description,
              label,
              error,
              withErrorStyles,
              __stylesApiProps: {
                ...props,
                rightSectionPointerEvents: rightSectionPointerEvents || (_clearable ? "all" : "none"),
                multiline: true
              },
              pointer: !searchable,
              onClick: () => searchable ? combobox.openDropdown() : combobox.toggleDropdown(),
              "data-expanded": combobox.dropdownOpened || void 0,
              id: _id,
              required,
              mod,
              children: /* @__PURE__ */ jsxRuntime.jsxs(Pill.Pill.Group, { disabled, unstyled, ...getStyles("pillsList"), children: [
                values,
                /* @__PURE__ */ jsxRuntime.jsx(Combobox.Combobox.EventsTarget, { autoComplete, children: /* @__PURE__ */ jsxRuntime.jsx(
                  PillsInput.PillsInput.Field,
                  {
                    ...rest,
                    ref,
                    id: _id,
                    placeholder,
                    type: !searchable && !placeholder ? "hidden" : "visible",
                    ...getStyles("inputField"),
                    unstyled,
                    onFocus: (event) => {
                      onFocus?.(event);
                      searchable && combobox.openDropdown();
                    },
                    onBlur: (event) => {
                      onBlur?.(event);
                      combobox.closeDropdown();
                      handleSearchChange("");
                    },
                    onKeyDown: handleInputKeydown,
                    value: _searchValue,
                    onChange: (event) => {
                      handleSearchChange(event.currentTarget.value);
                      searchable && combobox.openDropdown();
                      selectFirstOptionOnChange && combobox.selectFirstOption();
                    },
                    disabled,
                    readOnly: readOnly || !searchable,
                    pointer: !searchable
                  }
                ) })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            OptionsDropdown.OptionsDropdown,
            {
              data: hidePickedOptions ? filteredData : parsedData,
              hidden: readOnly || disabled,
              filter,
              search: _searchValue,
              limit,
              hiddenWhenEmpty: !nothingFoundMessage,
              withScrollArea,
              maxDropdownHeight,
              filterOptions: searchable,
              value: _value,
              checkIconPosition,
              withCheckIcon,
              nothingFoundMessage,
              unstyled,
              labelId: label ? `${_id}-label` : void 0,
              "aria-label": label ? void 0 : others["aria-label"],
              renderOption,
              scrollAreaProps
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      Combobox.Combobox.HiddenInput,
      {
        name,
        valuesDivider: hiddenInputValuesDivider,
        value: _value,
        form,
        disabled,
        ...hiddenInputProps
      }
    )
  ] });
});
MultiSelect.classes = { ...InputBase.InputBase.classes, ...Combobox.Combobox.classes };
MultiSelect.displayName = "@mantine/core/MultiSelect";

exports.MultiSelect = MultiSelect;
//# sourceMappingURL=MultiSelect.cjs.map

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
var filterPickedTags = require('./filter-picked-tags.cjs');
var getSplittedTags = require('./get-splitted-tags.cjs');

const defaultProps = {
  maxTags: Infinity,
  acceptValueOnBlur: true,
  splitChars: [","],
  hiddenInputValuesDivider: ","
};
const TagsInput = factory.factory((_props, ref) => {
  const props = useProps.useProps("TagsInput", defaultProps, _props);
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
    maxTags,
    allowDuplicates,
    onDuplicate,
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
    splitChars,
    onFocus,
    onBlur,
    onPaste,
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
    required,
    labelProps,
    descriptionProps,
    errorProps,
    wrapperProps,
    description,
    label,
    error,
    withErrorStyles,
    name,
    form,
    id,
    clearable,
    clearButtonProps,
    hiddenInputProps,
    hiddenInputValuesDivider,
    mod,
    renderOption,
    onRemove,
    onClear,
    scrollAreaProps,
    acceptValueOnBlur,
    isDuplicate,
    ...others
  } = props;
  const _id = hooks.useId(id);
  const parsedData = getParsedComboboxData.getParsedComboboxData(data);
  const optionsLockup = getOptionsLockup.getOptionsLockup(parsedData);
  const inputRef = React.useRef(null);
  const _ref = hooks.useMergedRef(inputRef, ref);
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
    name: "TagsInput",
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
  const handleValueSelect = (val) => {
    const isDuplicated = isDuplicate ? isDuplicate(val, _value) : _value.some((tag) => tag.toLowerCase() === val.toLowerCase());
    if (isDuplicated) {
      onDuplicate?.(val);
    }
    if ((!isDuplicated || isDuplicated && allowDuplicates) && _value.length < maxTags) {
      onOptionSubmit?.(val);
      handleSearchChange("");
      if (val.length > 0) {
        setValue([..._value, val]);
      }
    }
  };
  const handleInputKeydown = (event) => {
    onKeyDown?.(event);
    if (event.isPropagationStopped()) {
      return;
    }
    const inputValue = _searchValue.trim();
    const { length } = inputValue;
    if (splitChars.includes(event.key) && length > 0) {
      setValue(
        getSplittedTags.getSplittedTags({
          splitChars,
          allowDuplicates,
          maxTags,
          value: _searchValue,
          currentTags: _value
        })
      );
      handleSearchChange("");
      event.preventDefault();
    }
    if (event.key === "Enter" && length > 0 && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const hasActiveSelection = !!document.querySelector(
        `#${combobox.listId} [data-combobox-option][data-combobox-selected]`
      );
      if (hasActiveSelection) {
        return;
      }
      handleValueSelect(inputValue);
    }
    if (event.key === "Backspace" && length === 0 && _value.length > 0 && !event.nativeEvent.isComposing) {
      onRemove?.(_value[_value.length - 1]);
      setValue(_value.slice(0, _value.length - 1));
    }
  };
  const handlePaste = (event) => {
    onPaste?.(event);
    event.preventDefault();
    if (event.clipboardData) {
      const pastedText = event.clipboardData.getData("text/plain");
      setValue(
        getSplittedTags.getSplittedTags({
          splitChars,
          allowDuplicates,
          maxTags,
          value: `${_searchValue}${pastedText}`,
          currentTags: _value
        })
      );
      handleSearchChange("");
    }
  };
  const values = _value.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
    Pill.Pill,
    {
      withRemoveButton: !readOnly,
      onRemove: () => {
        const next_value = _value.slice();
        next_value.splice(index, 1);
        setValue(next_value);
        onRemove?.(item);
      },
      unstyled,
      disabled,
      ...getStyles("pill"),
      children: item
    },
    `${item}-${index}`
  ));
  React.useEffect(() => {
    if (selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  }, [selectFirstOptionOnChange, _value, _searchValue]);
  const clearButton = /* @__PURE__ */ jsxRuntime.jsx(
    Combobox.Combobox.ClearButton,
    {
      ...clearButtonProps,
      onClear: () => {
        setValue([]);
        handleSearchChange("");
        inputRef.current?.focus();
        combobox.openDropdown();
        onClear?.();
      }
    }
  );
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
        __staticSelector: "TagsInput",
        onOptionSubmit: (val) => {
          onOptionSubmit?.(val);
          handleSearchChange("");
          _value.length < maxTags && setValue([..._value, optionsLockup[val].label]);
          combobox.resetSelectedOption();
        },
        ...comboboxProps,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(Combobox.Combobox.DropdownTarget, { children: /* @__PURE__ */ jsxRuntime.jsx(
            PillsInput.PillsInput,
            {
              ...styleProps,
              __staticSelector: "TagsInput",
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              unstyled,
              size,
              className,
              style,
              variant,
              disabled,
              radius,
              rightSection,
              __clearSection: clearButton,
              __clearable: clearable && _value.length > 0 && !disabled && !readOnly,
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
              required,
              labelProps,
              descriptionProps,
              errorProps,
              wrapperProps,
              description,
              label,
              error,
              withErrorStyles,
              __stylesApiProps: { ...props, multiline: true },
              id: _id,
              mod,
              children: /* @__PURE__ */ jsxRuntime.jsxs(Pill.Pill.Group, { disabled, unstyled, ...getStyles("pillsList"), children: [
                values,
                /* @__PURE__ */ jsxRuntime.jsx(Combobox.Combobox.EventsTarget, { autoComplete, children: /* @__PURE__ */ jsxRuntime.jsx(
                  PillsInput.PillsInput.Field,
                  {
                    ...rest,
                    ref: _ref,
                    ...getStyles("inputField"),
                    unstyled,
                    onKeyDown: handleInputKeydown,
                    onFocus: (event) => {
                      onFocus?.(event);
                      combobox.openDropdown();
                    },
                    onBlur: (event) => {
                      onBlur?.(event);
                      acceptValueOnBlur && handleValueSelect(_searchValue);
                      combobox.closeDropdown();
                    },
                    onPaste: handlePaste,
                    value: _searchValue,
                    onChange: (event) => handleSearchChange(event.currentTarget.value),
                    required: required && _value.length === 0,
                    disabled,
                    readOnly,
                    id: _id
                  }
                ) })
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            OptionsDropdown.OptionsDropdown,
            {
              data: filterPickedTags.filterPickedTags({ data: parsedData, value: _value }),
              hidden: readOnly || disabled,
              filter,
              search: _searchValue,
              limit,
              hiddenWhenEmpty: true,
              withScrollArea,
              maxDropdownHeight,
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
        form,
        value: _value,
        valuesDivider: hiddenInputValuesDivider,
        disabled,
        ...hiddenInputProps
      }
    )
  ] });
});
TagsInput.classes = { ...InputBase.InputBase.classes, ...Combobox.Combobox.classes };
TagsInput.displayName = "@mantine/core/TagsInput";

exports.TagsInput = TagsInput;
//# sourceMappingURL=TagsInput.cjs.map

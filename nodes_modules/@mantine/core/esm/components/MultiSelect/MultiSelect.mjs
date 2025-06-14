'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useEffect } from 'react';
import { useId, useUncontrolled } from '@mantine/hooks';
import 'clsx';
import { useResolvedStylesApi } from '../../core/styles-api/use-resolved-styles-api/use-resolved-styles-api.mjs';
import { useStyles } from '../../core/styles-api/use-styles/use-styles.mjs';
import '../../core/MantineProvider/Mantine.context.mjs';
import '../../core/MantineProvider/default-theme.mjs';
import '../../core/MantineProvider/MantineProvider.mjs';
import '../../core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs';
import { useProps } from '../../core/MantineProvider/use-props/use-props.mjs';
import '../../core/MantineProvider/MantineCssVariables/MantineCssVariables.mjs';
import { extractStyleProps } from '../../core/Box/style-props/extract-style-props/extract-style-props.mjs';
import '../../core/Box/Box.mjs';
import { factory } from '../../core/factory/factory.mjs';
import '../../core/DirectionProvider/DirectionProvider.mjs';
import { getParsedComboboxData } from '../Combobox/get-parsed-combobox-data/get-parsed-combobox-data.mjs';
import { getOptionsLockup } from '../Combobox/get-options-lockup/get-options-lockup.mjs';
import '../Combobox/ComboboxChevron/ComboboxChevron.mjs';
import { Combobox } from '../Combobox/Combobox.mjs';
import '../Combobox/ComboboxDropdown/ComboboxDropdown.mjs';
import '../Combobox/ComboboxOptions/ComboboxOptions.mjs';
import '../Combobox/ComboboxOption/ComboboxOption.mjs';
import '../Combobox/ComboboxTarget/ComboboxTarget.mjs';
import '../Combobox/ComboboxSearch/ComboboxSearch.mjs';
import '../Combobox/ComboboxEmpty/ComboboxEmpty.mjs';
import '../Combobox/ComboboxFooter/ComboboxFooter.mjs';
import '../Combobox/ComboboxHeader/ComboboxHeader.mjs';
import '../Combobox/ComboboxEventsTarget/ComboboxEventsTarget.mjs';
import '../Combobox/ComboboxDropdownTarget/ComboboxDropdownTarget.mjs';
import '../Combobox/ComboboxGroup/ComboboxGroup.mjs';
import '../Combobox/ComboboxClearButton/ComboboxClearButton.mjs';
import '../Combobox/ComboboxHiddenInput/ComboboxHiddenInput.mjs';
import { OptionsDropdown } from '../Combobox/OptionsDropdown/OptionsDropdown.mjs';
import { useCombobox } from '../Combobox/use-combobox/use-combobox.mjs';
import '../Combobox/Combobox.context.mjs';
import { InputBase } from '../InputBase/InputBase.mjs';
import { Pill } from '../Pill/Pill.mjs';
import '../Pill/PillGroup/PillGroup.mjs';
import { PillsInput } from '../PillsInput/PillsInput.mjs';
import '../PillsInput/PillsInputField/PillsInputField.mjs';
import { filterPickedValues } from './filter-picked-values.mjs';

const defaultProps = {
  maxValues: Infinity,
  withCheckIcon: true,
  checkIconPosition: "left",
  hiddenInputValuesDivider: ","
};
const MultiSelect = factory((_props, ref) => {
  const props = useProps("MultiSelect", defaultProps, _props);
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
  const _id = useId(id);
  const parsedData = getParsedComboboxData(data);
  const optionsLockup = getOptionsLockup(parsedData);
  const combobox = useCombobox({
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
  } = extractStyleProps(others);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange
  });
  const [_searchValue, setSearchValue] = useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: "",
    onChange: onSearchChange
  });
  const handleSearchChange = (value2) => {
    setSearchValue(value2);
    combobox.resetSelectedOption();
  };
  const getStyles = useStyles({
    name: "MultiSelect",
    classes: {},
    props,
    classNames,
    styles,
    unstyled
  });
  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi({
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
  const values = _value.map((item, index) => /* @__PURE__ */ jsx(
    Pill,
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
  useEffect(() => {
    if (selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  }, [selectFirstOptionOnChange, _searchValue]);
  const clearButton = /* @__PURE__ */ jsx(
    Combobox.ClearButton,
    {
      ...clearButtonProps,
      onClear: () => {
        onClear?.();
        setValue([]);
        handleSearchChange("");
      }
    }
  );
  const filteredData = filterPickedValues({ data: parsedData, value: _value });
  const _clearable = clearable && _value.length > 0 && !disabled && !readOnly;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Combobox,
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
          /* @__PURE__ */ jsx(Combobox.DropdownTarget, { children: /* @__PURE__ */ jsx(
            PillsInput,
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
              __defaultRightSection: /* @__PURE__ */ jsx(
                Combobox.Chevron,
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
              children: /* @__PURE__ */ jsxs(Pill.Group, { disabled, unstyled, ...getStyles("pillsList"), children: [
                values,
                /* @__PURE__ */ jsx(Combobox.EventsTarget, { autoComplete, children: /* @__PURE__ */ jsx(
                  PillsInput.Field,
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
          /* @__PURE__ */ jsx(
            OptionsDropdown,
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
    /* @__PURE__ */ jsx(
      Combobox.HiddenInput,
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
MultiSelect.classes = { ...InputBase.classes, ...Combobox.classes };
MultiSelect.displayName = "@mantine/core/MultiSelect";

export { MultiSelect };
//# sourceMappingURL=MultiSelect.mjs.map

'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useRef, useEffect } from 'react';
import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks';
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
import { filterPickedTags } from './filter-picked-tags.mjs';
import { getSplittedTags } from './get-splitted-tags.mjs';

const defaultProps = {
  maxTags: Infinity,
  acceptValueOnBlur: true,
  splitChars: [","],
  hiddenInputValuesDivider: ","
};
const TagsInput = factory((_props, ref) => {
  const props = useProps("TagsInput", defaultProps, _props);
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
  const _id = useId(id);
  const parsedData = getParsedComboboxData(data);
  const optionsLockup = getOptionsLockup(parsedData);
  const inputRef = useRef(null);
  const _ref = useMergedRef(inputRef, ref);
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
    name: "TagsInput",
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
        getSplittedTags({
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
        getSplittedTags({
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
  const values = _value.map((item, index) => /* @__PURE__ */ jsx(
    Pill,
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
  useEffect(() => {
    if (selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  }, [selectFirstOptionOnChange, _value, _searchValue]);
  const clearButton = /* @__PURE__ */ jsx(
    Combobox.ClearButton,
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
        __staticSelector: "TagsInput",
        onOptionSubmit: (val) => {
          onOptionSubmit?.(val);
          handleSearchChange("");
          _value.length < maxTags && setValue([..._value, optionsLockup[val].label]);
          combobox.resetSelectedOption();
        },
        ...comboboxProps,
        children: [
          /* @__PURE__ */ jsx(Combobox.DropdownTarget, { children: /* @__PURE__ */ jsx(
            PillsInput,
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
              children: /* @__PURE__ */ jsxs(Pill.Group, { disabled, unstyled, ...getStyles("pillsList"), children: [
                values,
                /* @__PURE__ */ jsx(Combobox.EventsTarget, { autoComplete, children: /* @__PURE__ */ jsx(
                  PillsInput.Field,
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
          /* @__PURE__ */ jsx(
            OptionsDropdown,
            {
              data: filterPickedTags({ data: parsedData, value: _value }),
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
    /* @__PURE__ */ jsx(
      Combobox.HiddenInput,
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
TagsInput.classes = { ...InputBase.classes, ...Combobox.classes };
TagsInput.displayName = "@mantine/core/TagsInput";

export { TagsInput };
//# sourceMappingURL=TagsInput.mjs.map

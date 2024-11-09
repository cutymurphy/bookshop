import clsx from "clsx"
import { ChangeEvent, FC, useEffect, useRef, useState } from "react"
import { IDropDown, IListOption } from "./types"
import styles from './DropDown.module.scss'
import scrollBarStyles from '../Scrollbar/Scrollbar.module.scss'
import Input from "../Input/Input.tsx"
import React from "react"
import ArrowDownOutlineIcon from "../Icons/ArrowDownOutlineIcon.tsx"
import TrashBinIcon from "../Icons/TrashBinIcon.tsx"
import MagnifierIcon from "../Icons/MagnifierIcon.tsx"
import Checkbox from "../Checkbox/Checkbox.tsx"

const DropDown: FC<IDropDown> = ({
  className,
  labelClassName,
  inputClassName,
  listClassName,
  listRowClassName,
  listOfOptions,
  maxListHeight = "300px",
  maxListWidth = "",
  label,
  placeholder,
  requiredField,
  errorMessage,
  onChange,
  onOptionChange,
  onClear,
  value = "",
  multipleChoice,
  searchOption,
  clearOption,
  iconLeft,
  iconRight,
  arrowIconClassName,
  disabled,
  valuesToSelect,
  isAdaptableWidth,
  valueWhite,
  isAbsolute,
}) => {
  const [isDropdownVisible, setDropdownVisibility] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(valuesToSelect ? (multipleChoice ? valuesToSelect : (valuesToSelect.length > 1 ? [valuesToSelect[0]] : valuesToSelect)) : []);
  const [currentSearchResult, setCurrentSearchResult] = useState<string>("");

  const selectedLabels = selectedValues
    .map((value: string) => {
      const option = listOfOptions.find((option: IListOption) => option.value === value)
      return !!option ? option.label : null;
    })
    .filter(label => label !== null);

  const displayValue = selectedLabels.length > 0 ? selectedLabels.join(", ") : "";

  const lengthOfValue = value.length;

  const dropdownInputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);

  const handleInputClick = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  const handleOptionClick = (option: IListOption) => (event: React.MouseEvent<HTMLDivElement>) => {
    if (multipleChoice) {
      event.preventDefault();
      setSelectedValues((selectedValues: string[]) => {
        const isOptionAlreadySelected = selectedValues.includes(option.value);
        return isOptionAlreadySelected
          ? selectedValues.filter((item: string) => item !== option.value)
          : [...selectedValues, option.value];
      });
    } else {
      setSelectedValues([option.value]);
      setDropdownVisibility(false);
    }

    if (onOptionChange) {
      onOptionChange(option);
    }
  };

  const handleClearClick = () => {
    setSelectedValues([])
    if (onOptionChange) {
      onOptionChange({ value: "", label: "" });
    }
    if (onClear) {
      onClear();
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchResult(event.target.value.trim());
  };

  useEffect(() => {
    setSelectedValues(valuesToSelect ? (multipleChoice ? valuesToSelect : (valuesToSelect.length > 1 ? [valuesToSelect[0]] : valuesToSelect)) : []);
  }, [valuesToSelect])

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        (!!dropdownInputWrapperRef.current && !dropdownInputWrapperRef.current.contains(event.target as Node)) &&
        (!!dropdownListRef.current && !dropdownListRef.current.contains(event.target as Node))
      ) {
        setDropdownVisibility(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div
      className={clsx(styles["dropdown-wrapper"], className)}
    >
      <Input
        label={label}
        requiredField={requiredField}
        errorMessage={errorMessage}
        inputWrapperRef={dropdownInputWrapperRef}
        onChange={onChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        value={displayValue || value}
        className={clsx(
          styles["dropdown-input"],
          isDropdownVisible && !disabled && styles["dropdown-input-opened"],
          disabled && styles["dropdown-input-disabled"],
        )}
        inputClassName={clsx(!displayValue && !valueWhite && styles["dropdown-value-visible"], inputClassName)}
        labelClassName={labelClassName}
        iconRight={
          !iconRight ? (
            <span className={clsx(styles.arrowIcon, styles.defaultIcon, arrowIconClassName)}>
              <ArrowDownOutlineIcon />
            </span>
          ) : (
            <span className={clsx(styles.arrowIcon, arrowIconClassName)}>{iconRight}</span>
          )
        }
        iconLeft={iconLeft}
        readonly
        disabled={disabled}
        valueWidth={isAdaptableWidth && lengthOfValue > 0 ? lengthOfValue : undefined}
      />

      <div
        className={clsx(
          styles["dropdown-list"],
          isAbsolute && styles["dropdown-list-absolute"],
          scrollBarStyles.webkit,
          isDropdownVisible && !disabled && styles.show,
          listClassName,
        )}
        style={{
          maxHeight: isDropdownVisible ? maxListHeight : 0,
          minWidth: dropdownInputWrapperRef.current?.clientWidth,
          width: maxListWidth !== ""
            ? maxListWidth
            : isAdaptableWidth && lengthOfValue > 0
              ? "fit-content"
              : dropdownInputWrapperRef.current?.clientWidth,
        }}
        ref={dropdownListRef}
      >
        {clearOption && selectedValues.length > 0 && selectedValues[0] !== undefined &&
          <div
            className={clsx(styles['dropdown-list-value'], styles['dropdown-list-clear-value'], listRowClassName)}
            onClick={handleClearClick}
          >
            <TrashBinIcon />
            <span>Очистить</span>
          </div>
        }
        {searchOption &&
          <div className={styles.searchInput}>
            <Input
              iconLeft={<MagnifierIcon color="var(--white)" />}
              placeholder="Поиск"
              onChange={handleSearchChange}
              inputFieldClassName={styles.inputFieldClassName}
            />
          </div>
        }
        {listOfOptions
          .filter(({ label }: IListOption) => !!label && String(label).toLowerCase().includes(currentSearchResult.toLowerCase()))
          .map(({ label, value }: IListOption, index: number) => {
            const isOptionChecked = selectedValues.includes(value);
            return (
              <div
                id={index.toString()}
                className={clsx(
                  styles['dropdown-list-value'],
                  isOptionChecked && !multipleChoice && styles['dropdown-list-value-checked'],
                  listRowClassName
                )}
                onClick={handleOptionClick({
                  value: value,
                  label: label,
                })}
                key={index}
              >
                {multipleChoice &&
                  <Checkbox
                    checked={isOptionChecked}
                    onChange={() => { }}
                    onClick={(event) => { event.stopPropagation() }}
                  />
                }
                <span style={isAdaptableWidth && lengthOfValue > 0 && maxListWidth === "" ? { whiteSpace: "nowrap" } : {}}>
                  {label}
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default DropDown
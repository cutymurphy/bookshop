import { ChangeEventHandler, ReactNode } from "react";

export interface IDropDown {
    className?: string
    placeholder?: string
    labelClassName?: string
    inputClassName?: string
    arrowIconClassName?: string
    listClassName?: string
    listRowClassName?: string
    listOfOptions: IListOption[]
    maxListHeight?: string
    maxListWidth?: string
    label?: string | JSX.Element
    requiredField?: boolean
    errorMessage?: string
    onChange?: ChangeEventHandler<HTMLInputElement>
    onOptionChange?: (value: IListOption) => void
    onClear?: () => void
    value?: string
    multipleChoice?: boolean
    searchOption?: boolean
    clearOption?: boolean
    iconLeft?: ReactNode
    iconRight?: ReactNode
    disabled?: boolean
    valuesToSelect?: string[]
    isAdaptableWidth?: boolean
    valueWhite?: boolean
    isAbsolute?: boolean
}

export interface IListOption {
    value: string
    label: string | ReactNode
}
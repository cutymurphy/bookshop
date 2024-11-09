import { ChangeEventHandler, MouseEventHandler, ReactNode, RefObject } from "react"

export interface IInput {
    className?: string
    labelClassName?: string
    inputClassName?: string
    inputFieldClassName?: string
    placeholder?: string
    label?: string | JSX.Element
    requiredField?: boolean
    readonly?: boolean
    errorMessage?: string | boolean
    onChange?: ChangeEventHandler<HTMLInputElement>
    onClick?: MouseEventHandler<HTMLDivElement>
    value?: string
    id?: string
    disabled?: boolean
    valueWidth?: number
    iconLeft?: ReactNode
    iconRight?: ReactNode
    inputWrapperRef?: RefObject<HTMLDivElement>
}
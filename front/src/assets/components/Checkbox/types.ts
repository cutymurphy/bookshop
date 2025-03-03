import { ChangeEventHandler, MouseEventHandler } from "react";

export interface ICheckbox {
    id?: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    checked: boolean,
    classNameLabel?: string,
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement>;
}
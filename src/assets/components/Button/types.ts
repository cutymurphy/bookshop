import { MouseEventHandler } from "react";

export interface IButton {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    text: string,
    className?: string,
}
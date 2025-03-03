import { MouseEventHandler } from "react";

export interface IButton {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    text: string,
    className?: string,
    type?: "button" | "reset" | "submit",
}
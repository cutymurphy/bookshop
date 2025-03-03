import { MouseEventHandler, ReactNode } from "react";

export interface IButtonAdmin {
    onClick: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
    leftIcon?: ReactNode,
    rightIcon?: ReactNode,
    text: string,
    className?: string,
    type?: "gray" | "purple",
    fill?: "clear" | "outline" | "filled",
}
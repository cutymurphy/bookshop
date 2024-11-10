import { MouseEventHandler, ReactNode } from "react";

export interface IButtonAdmin {
    onClick: MouseEventHandler<HTMLButtonElement>,
    disabled: boolean,
    icon: ReactNode,
    text: string,
    className?: string,
}
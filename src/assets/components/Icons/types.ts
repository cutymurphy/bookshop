import { MouseEventHandler, ReactNode } from "react";

export interface IIcon {
    color?: string
    height?: number
    width?: number
    opacity?: number
    className?: ReactNode
    onClick?: MouseEventHandler<SVGSVGElement>;
}
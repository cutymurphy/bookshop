import { MouseEventHandler, ReactNode } from "react";
import { EBadgeType } from "./enums";

export interface IBadgeProps {
  type: `${EBadgeType}`;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}
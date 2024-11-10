import { FC } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./ButtonAdmin.module.scss";
import { IButtonAdmin } from "./types";

const ButtonAdmin: FC<IButtonAdmin> = ({
    onClick,
    disabled,
    text,
    className,
    leftIcon,
    rightIcon,
    type = "purple",
    fill = "clear",
}) => {
    return (
        <button
            className={clsx(
                styles.btn,
                styles[`btn-${fill}-${type}`],
                !!disabled && styles[`btn-${fill}-disabled`],
                className,
            )}
            onClick={onClick}
        >
            {leftIcon}
            {text}
            {rightIcon}
        </button>
    )
}

export default ButtonAdmin;
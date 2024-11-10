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
    icon,
}) => {
    return (
        <button
            className={clsx(
                styles.btn,
                disabled && styles["btn-disabled"],
                className,
            )}
            onClick={onClick}
        >
            {text}
            {icon}
        </button>
    )
}

export default ButtonAdmin;
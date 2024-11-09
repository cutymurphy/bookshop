import { FC } from "react";
import { IButton } from "./types";
import React from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";

const Button: FC<IButton> = ({
    onClick,
    disabled,
    text,
    className,
    type,
}) => {
    return (
        <button
            className={clsx(
                styles.button,
                disabled ? styles.unabled : styles.enabled,
                className,
            )}
            onClick={onClick}
            type={type}
        >
            {text}
        </button>
    )
}

export default Button;
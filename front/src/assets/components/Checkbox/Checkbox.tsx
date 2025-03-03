import { FC } from "react"
import { ICheckbox } from "./types";
import React from "react";
import styles from "./Checkbox.module.scss";
import clsx from "clsx";

const Checkbox: FC<ICheckbox> = ({
    id,
    onChange,
    checked,
    className,
    classNameLabel,
    onClick,
}) => {
    return (
        <div
            className={clsx(
                styles.checkbox,
                className,
            )}
            onClick={onClick}
        >
            <input
                type="checkbox"
                className={styles.checkboxInput}
                id={id}
                onChange={onChange}
                checked={checked}
            />
            <label
                htmlFor={id}
                className={clsx(
                    styles.checkboxLabel,
                    classNameLabel,
                )}
            >
            </label>
        </div>
    )
}

export default Checkbox;
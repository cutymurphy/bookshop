import { FC } from 'react'
import { IInput } from './types.ts'
import clsx from 'clsx'
import styles from './Input.module.scss'
import React from 'react'

const Input: FC<IInput> = ({
    className,
    labelClassName,
    inputClassName,
    inputFieldClassName,
    label,
    placeholder,
    id,
    requiredField = false,
    readonly,
    errorMessage,
    onChange,
    onClick,
    value,
    disabled,
    valueWidth,
    iconLeft,
    iconRight,
    inputWrapperRef,
}) => {
    return (
        <div
            className={clsx(
                styles.wrapper,
                className,
            )}
        >
            {label && (
                <label className={clsx(styles.label, labelClassName)}>
                    {label}
                    {requiredField && <span className={styles.required}> *</span>}
                </label>
            )}
            <div
                className={clsx(
                    styles["input-wrapper"],
                    errorMessage && styles.error,
                    disabled && styles.disabled,
                    inputClassName,
                )}
                style={!!valueWidth ? { width: "fit-content" } : {}}
                ref={inputWrapperRef}
                onClick={onClick}
            >
                {iconLeft && <span className={styles["icon-left"]}>{iconLeft}</span>}
                <input
                    className={clsx(styles.input, inputFieldClassName)}
                    value={value}
                    id={id}
                    placeholder={placeholder}
                    onChange={onChange}
                    readOnly={readonly}
                    disabled={disabled}
                    style={!!valueWidth ? { width: `${valueWidth + 2}ch` } : {}}
                />
                {iconRight && <span className={styles["icon-right"]}>{iconRight}</span>}
            </div>
            {errorMessage && <span className={styles['error-message']}>{errorMessage}</span>}
        </div>
    );
}

export default Input
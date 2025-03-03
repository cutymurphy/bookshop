import React, { FC } from 'react'
import { IIcon } from './types.ts'

const CheckmarkIcon: FC<IIcon> = ({
    color = 'var(--order-ready-color)',
    width = 24,
    height = 24,
    onClick,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 12 12"
            onClick={onClick}
        >
            <path
                fill={color}
                d="M10.065 2.07a.48.48 0 0 0-.39.225L5.16 9.202 2.235 6.675a.48.48 0 0 0-.487-.125.48.48 0 0 0-.143.845L4.95 10.29a.48.48 0 0 0 .38.109.48.48 0 0 0 .333-.214l4.822-7.365a.479.479 0 0 0-.42-.75"
            />
        </svg>
    )
}

export default CheckmarkIcon;
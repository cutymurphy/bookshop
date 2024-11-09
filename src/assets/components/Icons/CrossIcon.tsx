import React, { FC } from 'react'
import { IIcon } from './types.ts'

const CrossIcon: FC<IIcon> = ({
    color = 'var(--main-color)',
    width = 24,
    height = 24,
    onClick,
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill={color}
            onClick={onClick}
        >
            <path
                d="m13.41 12 6.3-6.29a1 1 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1 1 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l6.29-6.3 6.29 6.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42Z"
            />
        </svg>
    )
}

export default CrossIcon;
import React, { FC } from 'react'
import { IIcon } from './types'

const ArrowLeftOutlineIcon: FC<IIcon> = ({
    color = 'var(--table-rating-icon-fill)',
    height = 32,
    width = 32,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width={width}
            height={height}
        >
            <path
                fill={color}
                d="M11 23c-.3 0-.5-.1-.7-.3l-6-6c-.4-.4-.4-1 0-1.4l6-6c.4-.4 1-.4 1.4 0s.4 1 0 1.4L6.4 16l5.3 5.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"
            />
            <path
                fill={color}
                d="M27 17H5c-.6 0-1-.4-1-1s.4-1 1-1h22c.6 0 1 .4 1 1s-.4 1-1 1z"
            />
        </svg>
    )
}

export default ArrowLeftOutlineIcon
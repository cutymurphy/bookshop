import React, { FC } from 'react'
import { IIcon } from './types'

const ArrowDownOutlineIcon: FC<IIcon> = ({
    color = 'var(--main-color)',
    height = 11,
    width = 18,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 18 11"
            style={{ transform: 'rotate(180deg)' }}
        >
            <path
                fill={color}
                fillRule="evenodd"
                d="M17.825 9.918a.57.57 0 0 0 .18-.415.57.57 0 0 0-.18-.415L9.418.68A.57.57 0 0 0 9.003.5a.57.57 0 0 0-.415.18L.18 9.088a.57.57 0 0 0-.18.415c0 .156.06.294.18.415l.902.902a.57.57 0 0 0 .83 0l7.09-7.09 7.09 7.09a.57.57 0 0 0 .83 0l.903-.902Z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default ArrowDownOutlineIcon;
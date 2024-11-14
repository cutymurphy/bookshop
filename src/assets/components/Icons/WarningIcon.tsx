import React, { FC } from 'react'
import { IIcon } from './types'

const WarningIcon: FC<IIcon> = ({
    color = 'var(--dark-gray)',
    width = 31,
    height = 28,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 31 28"
        >
            <path
                fill={color}
                fillRule="evenodd"
                d="M17.16 23.09v-3.18a.54.54 0 0 0-.16-.394.52.52 0 0 0-.376-.159H13.41a.52.52 0 0 0-.377.16.54.54 0 0 0-.159.393v3.18q0 .235.16.394a.52.52 0 0 0 .376.159h3.214q.217 0 .377-.16a.54.54 0 0 0 .159-.393m-.034-6.26.302-7.685a.37.37 0 0 0-.168-.318q-.218-.184-.401-.184h-3.684q-.183 0-.401.184-.168.117-.168.352l.285 7.65q0 .168.167.276a.7.7 0 0 0 .402.11h3.097a.7.7 0 0 0 .394-.11.37.37 0 0 0 .175-.276Zm-.234-15.637 12.857 23.572q.586 1.055-.033 2.109-.285.486-.779.77a2.1 2.1 0 0 1-1.063.285H2.16a2.1 2.1 0 0 1-1.063-.285 2.1 2.1 0 0 1-.779-.77q-.62-1.054-.033-2.11l12.857-23.57A2.14 2.14 0 0 1 15.017.07q.585 0 1.088.302.502.3.787.82Z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default WarningIcon

import React, { FC } from 'react'
import { IIcon } from './types'

const PencilIcon: FC<IIcon> = ({
  color = 'var(--main-color)',
  height = 16,
  width = 16
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={height}
      height={width}
      viewBox="0 0 16 16"
    >
      <path
        fill={color}
        d="M15.222 4.535A2.657 2.657 0 0 0 11.465.778l-.932.932 3.757 3.757.932-.932Zm-1.871 1.87-7.94 7.94a3.32 3.32 0 0 1-1.542.874l-3.043.76a.664.664 0 0 1-.806-.805l.761-3.043a3.321 3.321 0 0 1 .874-1.542l7.94-7.94 3.756 3.757Z"
      />
    </svg>
  )
}

export default PencilIcon;
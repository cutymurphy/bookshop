import React, { FC } from 'react'
import { IIcon } from './types'

const PlusIcon: FC<IIcon> = ({
  color = 'var(--main-color)',
  width = 15,
  height = 15,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path
        d="M12 20a1 1 0 0 1-1-1v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-1 1"
      />
    </svg>
  )
}

export default PlusIcon;
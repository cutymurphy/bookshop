import { ReactNode } from 'react'
import { EOverflow } from './enums'

export interface IScrollbar {
  className?: string
  children: ReactNode
  overflowX?: `${EOverflow}`
  overflowY?: `${EOverflow}`
  overflow?: `${EOverflow}`
}
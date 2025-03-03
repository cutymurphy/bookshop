import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import styles from './Scrollbar.module.scss'
import { IScrollbar } from './types'
import { EOverflow } from './enums'
import React from 'react'

const Scrollbar: FC<IScrollbar> = ({
  children,
  className,
  overflowX = EOverflow.hidden,
  overflowY = EOverflow.auto,
  overflow = EOverflow.auto
}) => {

  const isSafari = () => {
    const userAgent = navigator.userAgent;
    return /^((?!chrome|android).)*safari/i.test(userAgent);
  };

  const safari = isSafari();

  const combinedStyles: CSSProperties = {
    overflowX,
    overflowY,
    overflow
  }

  return (
    <div
      className={clsx(
        styles['scrollbar-wrapper'],
        styles.webkit,
        safari && styles.safari,
        className
      )}
      style={combinedStyles}
    >
      {children}
    </div>
  )
}

export default Scrollbar
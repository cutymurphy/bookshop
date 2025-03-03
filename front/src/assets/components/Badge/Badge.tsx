import { FC } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.scss';
import { IBadgeProps } from './types';
import React from 'react';

const Badge: FC<IBadgeProps> = ({
  type,
  children,
  onClick,
  className
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[type],
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Badge;

import { FC } from 'react'
import styles from './Loader.module.scss'
import clsx from 'clsx';
import React from 'react';

interface ILoader {
    className?: string
}

const Loader: FC<ILoader> = ({ className }) => {
    return (
        <div className={clsx(styles.loader, className)}></div>
    )
};

export default Loader;
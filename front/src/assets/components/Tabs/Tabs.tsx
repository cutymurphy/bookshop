import { FC, useEffect, useState } from 'react'
import { ITabs, ITabsItem } from './types'
import clsx from 'clsx'
import styles from './Tabs.module.scss'
import React from 'react'

const Tabs: FC<ITabs> = ({
    tabsItems,
    className,
    contentClassName,
    headerItemClassName,
    onChange,
    activeTabIndex,
}) => {
    const [activeTab, setActiveTab] = useState<number>(activeTabIndex || 0);

    const handleTabChange = (index: number, isDisabled: boolean) => {
        if (!isDisabled) {
            if (onChange) {
                onChange(index);
            } else {
                setActiveTab(index);
            }
        }
    }

    useEffect(() => {
        if (activeTabIndex !== undefined) {
            setActiveTab(activeTabIndex);
        }
    }, [activeTabIndex])

    return (
        <div
            className={clsx(
                styles.tabs,
                className,
            )}
        >
            <div className={styles["tabs-header"]}>
                {tabsItems.map(({ title, disabled }: ITabsItem, index: number) =>
                    <div
                        key={index}
                        className={clsx(
                            styles["tabs-header-item"],
                            !disabled && activeTab !== index && styles[`tabs-header-item-basic`],
                            !disabled && activeTab === index && styles[`tabs-header-item-purple`],
                            disabled && styles["tabs-header-item-disabled"],
                            headerItemClassName,
                        )}
                        onClick={() => handleTabChange(index, disabled || false)}
                    >
                        {title}
                    </div>
                )}
            </div>

            <div className={clsx(
                styles["tabs-content"],
                contentClassName,
            )}>
                {tabsItems.map(({ content }: ITabsItem, index: number) =>
                    <div
                        key={index}
                        className={clsx(
                            styles["tabs-content-item"],
                            activeTab === index && styles["tabs-content-item-active"],
                        )}
                    >
                        {content}
                    </div>
                )}
            </div>
        </div >
    )
}

export default Tabs
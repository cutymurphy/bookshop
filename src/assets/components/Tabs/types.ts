export interface ITabs {
    tabsItems: ITabsItem[]
    className?: string
    contentClassName?: string
    headerItemClassName?: string
    onChange?: (tab: number) => void;
    activeTabIndex?: number
}

export interface ITabsItem {
    title: string | JSX.Element
    content: string | JSX.Element
    disabled?: boolean
}
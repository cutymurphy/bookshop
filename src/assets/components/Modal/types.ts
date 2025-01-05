export interface IModal {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    okFunction: () => void,
    innerText?: string,
    activeBtns?: boolean,
}
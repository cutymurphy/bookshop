import React, { useEffect, useRef } from "react";
import { FC } from "react";
import { IModal } from "./types";
import styles from "./Modal.module.scss";
import CrossIcon from "../Icons/CrossIcon.tsx";
import WarningIcon from "../Icons/WarningIcon.tsx";
import ButtonAdmin from "../ButtonAdmin/ButtonAdmin.tsx";

const Modal: FC<IModal> = ({
    isOpen,
    setIsOpen,
    okFunction,
    innerText = "Вы действительно хотите удалить записи?",
    activeBtns = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    return (
        isOpen ? (
            <div className={styles.modalWrapper}>
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.modalHeader}>
                        <div className={styles.warning}>
                            <WarningIcon />
                            <span className={styles.warningText}>{innerText}</span>
                        </div>
                        <CrossIcon
                            onClick={() => setIsOpen(false)}
                            color="var(--gray)"
                        />
                    </div>
                    {activeBtns &&
                        <div className={styles.btns}>
                            <ButtonAdmin
                                text="Да"
                                onClick={() => {
                                    okFunction();
                                    setIsOpen(false);
                                }}
                                fill={"outline"}
                            />
                            <ButtonAdmin
                                text="Отмена"
                                onClick={() => setIsOpen(false)}
                                type={"gray"}
                            />
                        </div>
                    }
                </div>
            </div>
        ) : null
    )
}

export default Modal;
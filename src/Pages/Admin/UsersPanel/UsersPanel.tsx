import React, { useState } from "react";
import { FC } from "react";
import styles from "./UsersPanel.module.scss";
import clsx from "clsx";
import { IFullProfile } from "../../../types.ts";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteUser } from "../../../server/api.js";
import { IUsersPanel } from "./types.ts";

const UsersPanel: FC<IUsersPanel> = ({
    users,
    setUsers,
    currentAdmin,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage, setUsersPerPage] = useState<number>(10);
    const currUserId = currentAdmin.idUser;

    const handleDeleteUsers = (usersId: string[]) => {
        setIsLoading(true);
        usersId.forEach(async (id: string) => {
            await deleteUser(id);
        })
        setCurrentPage(1);
        setUsers(users.filter((user: IFullProfile) => !usersId.includes(user.idUser)));
        setCheckedItems([]);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <div className={styles.users}>
            <div className={styles.usersTable}>
                <div className={clsx(styles.usersRow, styles.headerRow)}>
                    <Checkbox
                        id="commonCheckbox-users"
                        onChange={() => checkedItems.length === users.length - 1 ?
                            setCheckedItems([]) :
                            setCheckedItems(users
                                .filter(((user: IFullProfile) => user.idUser !== currUserId))
                                .map((user: IFullProfile) => user.idUser)
                            )
                        }
                        checked={checkedItems.length === users.length - 1}
                        className={styles.checkbox}
                        classNameLabel={styles.checkboxLabel}
                    />
                    <span>№</span>
                    <span>Админ</span>
                    <span>Имя</span>
                    <span>Фамилия</span>
                    <span>Почта</span>
                    <span>Телефон</span>
                </div>
                {users
                    .slice(currentPage * usersPerPage - usersPerPage, currentPage * usersPerPage)
                    .map(({ idUser, isAdmin, name, surname, email, phone }: IFullProfile, index: number) => (
                        <div
                            className={clsx(
                                styles.rowWrapper,
                                index % 2 !== 0 && styles.borderPurple,
                            )}
                            key={idUser}
                        >
                            <div className={styles.usersRow}>
                                {idUser !== currUserId &&
                                    <Checkbox
                                        id={idUser}
                                        onChange={() => checkedItems.includes(idUser) ?
                                            setCheckedItems(checkedItems.filter((item: string) => item !== idUser)) :
                                            setCheckedItems([...checkedItems, idUser])
                                        }
                                        checked={checkedItems.includes(idUser)}
                                        className={styles.checkbox}
                                        classNameLabel={styles.checkboxLabel}
                                    />
                                }
                                <span>{users.findIndex((user: IFullProfile) => user.idUser === idUser) + 1}</span>
                                <span>{isAdmin ? "Да" : "Нет"}</span>
                                <span className={clsx(
                                    styles.rowPadding,
                                    currUserId === idUser && styles.bolder,
                                )}>{name}</span>
                                <span className={clsx(
                                    styles.rowPadding,
                                    currUserId === idUser && styles.bolder,
                                )}>{surname}</span>
                                <span className={styles.rowPadding}>{email}</span>
                                <span className={styles.rowPadding}>{phone}</span>
                            </div>
                        </div>
                    ))}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={usersPerPage}
                setItemsPerPage={setUsersPerPage}
                currentItems={users}
                type={EPaginationPage.admin}
                resultsClassName={styles.paginator}
                paginationClassName={styles.paginator}
            />
            <div className={styles.btns}>
                <ButtonAdmin
                    className={styles.deleteBtn}
                    onClick={() => checkedItems.length === 0 ? alert("Выберите пользователей") : handleDeleteUsers(checkedItems)}
                    disabled={checkedItems.length === 0}
                    rightIcon={<TrashBinIcon />}
                    text="Удалить"
                />
            </div>
        </div>
    )
}

export default UsersPanel;
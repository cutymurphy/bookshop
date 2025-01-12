import React, { useState } from "react";
import { FC } from "react";
import styles from "./UsersPanel.module.scss";
import clsx from "clsx";
import { IFullProfile, IOrder } from "../../../types.ts";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteCart, deleteCartState, deleteOrder, deleteUser } from "../../../server/api.js";
import { IUsersPanel, TSortColumn } from "./types.ts";
import Modal from "../../../assets/components/Modal/Modal.tsx";
import { toast } from "sonner";
import { pluralizeWord } from "../OrdersPanel/utils.ts";

const UsersPanel: FC<IUsersPanel> = ({
    users,
    setUsers,
    orders,
    setOrders,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage, setUsersPerPage] = useState<number>(10);
    const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<TSortColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const currentUsers = users.filter((user: IFullProfile) => !user.isAdmin).map((user: IFullProfile) => user.idUser);

    const sortedUsers = [...users].sort((a: IFullProfile, b: IFullProfile) => {
        if (!sortColumn) return 0;
        let compareValue = 0;
        if (sortColumn === "surname") {
            compareValue = a.surname.localeCompare(b.surname);
        } else if (sortColumn === "admin") {
            compareValue = Number(b.isAdmin) - Number(a.isAdmin);
        }
        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    const handleSort = (column: TSortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleDeleteUsers = (usersId: string[]) => {
        setIsLoading(true);
        try {
            usersId.forEach(async (id: string) => {
                const userOrdersToDelete = orders.filter((order: IOrder) => order.idUser === id);
                await deleteCart(id);
                userOrdersToDelete.forEach(async (order: IOrder) => {
                    await deleteOrder(order.id);
                    await deleteCartState(order.idCartState);
                })
                await deleteUser(id);
            })
            setOrders(orders.filter((order: IOrder) => !usersId.includes(order.idUser)));
            setUsers(users.filter((user: IFullProfile) => !usersId.includes(user.idUser)));
            toast.info("Выбранные пользователи удалены из системы");
        } catch (error) {
            toast.error(`Ошибка при удалении пользователей: ${error}`);
        } finally {
            setCurrentPage(1);
            setCheckedItems([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    return (
        <div className={styles.users}>
            <div className={styles.usersTable}>
                <div className={clsx(styles.usersRow, styles.headerRow)}>
                    {currentUsers.length > 0 &&
                        <Checkbox
                            id="commonCheckbox-users"
                            onChange={() => checkedItems.length === currentUsers.length ?
                                setCheckedItems([]) :
                                setCheckedItems(currentUsers)
                            }
                            checked={checkedItems.length === currentUsers.length}
                            className={styles.checkbox}
                            classNameLabel={styles.checkboxLabel}
                        />
                    }
                    <span>№</span>
                    <span
                        onClick={() => handleSort("admin")}
                        className={clsx(styles.sortField, sortColumn === "admin" && styles.sortedField)}
                    >
                        Админ
                    </span>
                    <span>Имя</span>
                    <span
                        onClick={() => handleSort("surname")}
                        className={clsx(styles.sortField, sortColumn === "surname" && styles.sortedField)}
                    >
                        Фамилия
                    </span>
                    <span>Почта</span>
                    <span>Телефон</span>
                </div>
                {sortedUsers
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
                                {!isAdmin &&
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
                                <span>{index + 1}</span>
                                <span>{isAdmin ? "Да" : "Нет"}</span>
                                <span className={clsx(
                                    styles.rowPadding,
                                    isAdmin && styles.bolder,
                                )}>
                                    {name}
                                </span>
                                <span className={clsx(
                                    styles.rowPadding,
                                    isAdmin && styles.bolder,
                                )}>
                                    {surname}
                                </span>
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
                    onClick={() => checkedItems.length === 0 ? toast.warning("Выберите пользователей") : setIsOpenModal(true)}
                    disabled={checkedItems.length === 0}
                    rightIcon={<TrashBinIcon />}
                    text="Удалить"
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsOpenModal}
                okFunction={() => handleDeleteUsers(checkedItems)}
                innerText={`Вы действительно хотите удалить ${checkedItems.length} ${pluralizeWord(checkedItems.length)}? Это приведет к удалению всех заказов и содержимого корзин данных пользователей!`}
            />
        </div>
    )
}

export default UsersPanel;
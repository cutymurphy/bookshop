import React, { useState } from "react";
import { FC } from "react";
import { IOrdersPanel } from "./types";
import styles from "./OrdersPanel.module.scss";
import clsx from "clsx";
import { IOrder } from "../../../types";
import ArrowDownOutlineIcon from "../../../assets/components/Icons/ArrowDownOutlineIcon.tsx";
import { defaultPickupAddress, EStatusType } from "../../Cart/CartModal/enums.ts";
import Badge from "../../../assets/components/Badge/Badge.tsx";
import { EBadgeType } from "../../../assets/components/Badge/enums.ts";
import { ICartBook } from "../../Cart/types.ts";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteCartState, deleteOrder } from "../../../server/api.js";

const OrdersPanel: FC<IOrdersPanel> = ({
    orders,
    setOrders,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [openedInfo, setOpenedInfo] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(10);

    const sortedOrders = orders.sort((a, b) => {
        const [dateA, timeA] = a.date.split(", ");
        const [dayA, monthA, yearA] = dateA.split(".");
        const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

        const [dateB, timeB] = b.date.split(", ");
        const [dayB, monthB, yearB] = dateB.split(".");
        const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

        return dateObjB.getTime() - dateObjA.getTime();
    });

    const getBadgeType = (status: EStatusType): EBadgeType => {
        if (status === EStatusType.placed) return EBadgeType.gray;
        if (status === EStatusType.cancelled) return EBadgeType.red;
        if (status === EStatusType.ready) return EBadgeType.green;
        if (status === EStatusType.closed) return EBadgeType.blue;
        if (status === EStatusType["in-process"]) return EBadgeType.pink;
        if (status === EStatusType.delivered) return EBadgeType.purple;
        return EBadgeType.gray;
    }

    const handleDeleteOrders = (ordersId: string[]) => {
        setIsLoading(true);
        ordersId.forEach(async (id: string) => {
            const stateId = orders.find((order: IOrder) => order.id === id)?.idCartState;
            await deleteOrder(id);
            await deleteCartState(stateId);
        })
        setCurrentPage(1);
        setOpenedInfo("");
        setOrders(orders.filter((order: IOrder) => !ordersId.includes(order.id)));
        setCheckedItems([]);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }

    return (
        <div className={styles.orders}>
            <div className={styles.ordersTable}>
                <div className={clsx(styles.ordersRow, styles.headerRow)}>
                    <Checkbox
                        id="commonCheckbox"
                        onChange={() => checkedItems.length === orders.length ?
                            setCheckedItems([]) :
                            setCheckedItems(orders.map((order: IOrder) => order.id))
                        }
                        checked={checkedItems.length === orders.length}
                        className={styles.checkbox}
                        classNameLabel={styles.checkboxLabel}
                    />
                    <span>№</span>
                    <span>Пользователь</span>
                    <span>Цена</span>
                    <span>Дата</span>
                    <span>Адрес</span>
                    <span>Оплата</span>
                    <span style={{ paddingLeft: "8px" }}>Статус</span>
                    <span>Изменено</span>
                </div>
                {sortedOrders
                    .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                    .map(({ id, date, address, totalCost, payment, status, user, admin, books }: IOrder, index: number) => (
                        <div
                            className={clsx(
                                styles.rowWrapper,
                                index % 2 !== 0 && styles.borderPurple,
                            )}
                            key={id}
                        >
                            <div
                                className={clsx(styles.ordersRow, styles.mainRow)}
                                onClick={() => { openedInfo === id ? setOpenedInfo("") : setOpenedInfo(id) }}
                            >
                                <Checkbox
                                    id={id}
                                    onChange={() => checkedItems.includes(id) ?
                                        setCheckedItems(checkedItems.filter((item: string) => item !== id)) :
                                        setCheckedItems([...checkedItems, id])
                                    }
                                    checked={checkedItems.includes(id)}
                                    className={styles.checkbox}
                                    classNameLabel={styles.checkboxLabel}
                                />
                                <span>{orders.findIndex((order: IOrder) => order.id === id) + 1}</span>
                                <span className={styles.rowPadding}>{`${user.name} ${user.surname}`}</span>
                                <span className={styles.rowPadding}>{totalCost}</span>
                                <span>{date.split(",")[0]}</span>
                                <span
                                    className={clsx(
                                        styles.rowPadding,
                                        address === defaultPickupAddress && styles.defaultAddress,
                                    )}
                                >
                                    {address}
                                </span>
                                <span>{payment}</span>
                                <span>
                                    <Badge type={getBadgeType(status)}>{status}</Badge>
                                </span>
                                <span className={styles.rowPadding}>{!!admin ? `${admin.name} ${admin.surname}` : "—"}</span>
                                <span
                                    className={clsx(
                                        styles.rowIcon,
                                        openedInfo === id && styles["rowIcon-opened"],
                                    )}
                                    onClick={() => { openedInfo === id ? setOpenedInfo("") : setOpenedInfo(id) }}
                                >
                                    <ArrowDownOutlineIcon />
                                </span>
                            </div>
                            <div
                                className={clsx(
                                    styles.rowInfo,
                                    openedInfo === id && styles["rowInfo-opened"],
                                )}
                            >
                                <div className={styles.rowInfoColInfo}>
                                    {!!user.phone &&
                                        <span>Телефон для связи:
                                            <span className={styles.bolder}>{user.phone}</span>
                                        </span>
                                    }
                                    <span>Тип доставки:
                                        <span className={styles.bolder}>{address === defaultPickupAddress ? "Самовывоз" : "Доставка"}</span>
                                    </span>
                                    <span>Точное время заказа:
                                        <span className={styles.bolder}>{date}</span>
                                    </span>
                                </div>
                                <div className={styles.rowInfoColBooks}>
                                    {books.map(({ book, count }: ICartBook) => {
                                        const { id, name, imgLink, author } = book;

                                        return (
                                            <div className={styles.bookRow} key={id}>
                                                <img
                                                    className={styles.productImage}
                                                    src={book.imgLink}
                                                    alt={book.name}
                                                />
                                                <div className={styles.bookInfo}>
                                                    <div className={styles.bookTitle}>
                                                        <span className={styles.bookInfoName}>{name}</span>
                                                        {!!author && <span>{author}</span>}
                                                    </div>
                                                    <span className={styles.bookInfoCount}>Количество: {count}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={booksPerPage}
                setItemsPerPage={setBooksPerPage}
                currentItems={orders}
                type={EPaginationPage.admin}
            />
            <ButtonAdmin
                className={styles.deleteBtn}
                onClick={() => checkedItems.length === 0 ? alert("Выберите заказы") : handleDeleteOrders(checkedItems)}
                disabled={checkedItems.length === 0}
                icon={<TrashBinIcon />}
                text="Удалить"
            />
        </div>
    )
}

export default OrdersPanel;
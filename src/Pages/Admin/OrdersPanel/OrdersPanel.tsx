import React, { useState } from "react";
import { FC } from "react";
import { IOrdersPanel } from "./types";
import styles from "./OrdersPanel.module.scss";
import clsx from "clsx";
import { IOrder } from "../../../types";
import ArrowDownOutlineIcon from "../../../assets/components/Icons/ArrowDownOutlineIcon.tsx";
import { defaultPickupAddress } from "../../Cart/CartModal/enums.ts";
import Badge from "../../../assets/components/Badge/Badge.tsx";
import { ICartBook } from "../../Cart/types.ts";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteCartState, deleteOrder } from "../../../server/api.js";
import PencilIcon from "../../../assets/components/Icons/PencilIcon.tsx";
import { useNavigate } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";
import { getBadgeType } from "./utils.ts";
import Modal from "../../../assets/components/Modal/Modal.tsx";
import Input from "../../../assets/components/Input/Input.tsx";
import MagnifierIcon from "../../../assets/components/Icons/MagnifierIcon.tsx";

const OrdersPanel: FC<IOrdersPanel> = ({
    orders,
    setOrders,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [openedInfo, setOpenedInfo] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(10);
    const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [input, setInput] = useState<string>("");
    const navigate = useNavigate();

    const sortedOrders = [...orders].sort((a: IOrder, b: IOrder) => {
        if (!sortColumn) return 0;

        let compareValue = 0;
        if (sortColumn === "date") {
            const [dateA, timeA] = a.date.split(", ");
            const [dayA, monthA, yearA] = dateA.split(".");
            const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

            const [dateB, timeB] = b.date.split(", ");
            const [dayB, monthB, yearB] = dateB.split(".");
            const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

            compareValue = dateObjA.getTime() - dateObjB.getTime();
        } else if (sortColumn === "totalCost") {
            compareValue = a.totalCost - b.totalCost;
        } else if (sortColumn === "payment") {
            compareValue = a.payment.localeCompare(b.payment);
        } else if (sortColumn === "status") {
            compareValue = a.status.localeCompare(b.status);
        } else if (sortColumn === "user") {
            compareValue = a.user.surname.localeCompare(b.user.surname);
        }
        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    const filteredOrders = !!input ?
        sortedOrders.filter((order: IOrder) => order.id.slice(-4) === input) : sortedOrders;

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleDeleteOrders = (ordersId: string[]) => {
        setIsLoading(true);
        try {
            ordersId.forEach(async (id: string) => {
                const stateId = orders.find((order: IOrder) => order.id === id)?.idCartState;
                await deleteOrder(id);
                await deleteCartState(stateId);
            })
        } catch (error) {
            console.error(`Ошибка при удалении заказов: ${error}`);
        } finally {
            setCurrentPage(1);
            setOpenedInfo("");
            setOrders(orders.filter((order: IOrder) => !ordersId.includes(order.id)));
            setCheckedItems([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }

    return (
        <div className={styles.orders}>
            <Input
                className={styles.input}
                inputClassName={styles.inputWrapper}
                iconRight={<MagnifierIcon />}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите 4 последние знака заказа"
            />
            <div className={styles.ordersTable}>
                <div className={clsx(styles.ordersRow, styles.headerRow)}>
                    <Checkbox
                        id="commonCheckbox-orders"
                        onChange={() => checkedItems.length === orders.length ?
                            setCheckedItems([]) :
                            setCheckedItems(orders.map((order: IOrder) => order.id))
                        }
                        checked={checkedItems.length === orders.length}
                        className={styles.checkbox}
                        classNameLabel={styles.checkboxLabel}
                    />
                    <span>№</span>
                    <span
                        onClick={() => handleSort("user")}
                        className={clsx(styles.sortField, sortColumn === "user" && styles.sortedField)}
                    >
                        Получатель
                    </span>
                    <span
                        onClick={() => handleSort("totalCost")}
                        className={clsx(styles.sortField, sortColumn === "totalCost" && styles.sortedField)}
                    >
                        Цена
                    </span>
                    <span
                        onClick={() => handleSort("date")}
                        className={clsx(styles.sortField, sortColumn === "date" && styles.sortedField)}
                    >
                        Дата
                    </span>
                    <span>Адрес</span>
                    <span
                        onClick={() => handleSort("payment")}
                        className={clsx(styles.sortField, sortColumn === "payment" && styles.sortedField)}
                    >
                        Оплата
                    </span>
                    <span
                        onClick={() => handleSort("status")}
                        className={clsx(styles.sortField, sortColumn === "status" && styles.sortedField)}
                        style={{ paddingLeft: "8px" }}
                    >
                        Статус
                    </span>
                    <span>Изменено</span>
                </div>
                {filteredOrders
                    .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                    .map(({ id, date, address, totalCost, payment, status, user, admin, books, message }: IOrder, index: number) => (
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
                                <div className={styles.iconsWrapper}>
                                    <span
                                        className={clsx(
                                            styles.rowIcon,
                                            openedInfo === id && styles["rowIcon-opened"],
                                        )}
                                        onClick={() => { openedInfo === id ? setOpenedInfo("") : setOpenedInfo(id) }}
                                    >
                                        <ArrowDownOutlineIcon />
                                    </span>
                                    <span
                                        className={clsx(styles.rowIcon, styles.pencilIcon)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`${EPath.adminOrder}/${id}`);
                                        }}
                                    >
                                        <PencilIcon />
                                    </span>
                                </div>
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
                                    {!!message &&
                                        <span>Сообщение:
                                            <span className={styles.message}>{message}</span>
                                        </span>
                                    }
                                </div>
                                <div className={styles.rowInfoColBooks}>
                                    {books.map(({ book, count }: ICartBook) => {
                                        const { id, name, imgLink, author } = book;

                                        return (
                                            <div className={styles.bookRow} key={id}>
                                                <img
                                                    className={styles.productImage}
                                                    src={imgLink}
                                                    alt={name}
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
                resultsClassName={styles.paginator}
                paginationClassName={styles.paginator}
            />
            <ButtonAdmin
                className={styles.deleteBtn}
                onClick={() => checkedItems.length === 0 ? alert("Выберите заказы") : setIsOpenModal(true)}
                disabled={checkedItems.length === 0}
                rightIcon={<TrashBinIcon />}
                text="Удалить"
            />
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsOpenModal}
                okFunction={() => handleDeleteOrders(checkedItems)}
            />
        </div>
    )
}

export default OrdersPanel;
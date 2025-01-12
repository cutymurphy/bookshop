import { FC, useState } from "react";
import { ICartModal } from "./types";
import React from "react";
import styles from "./CartModal.module.scss";
import CrossIcon from "../../../assets/components/Icons/CrossIcon.tsx";
import { defaultPickupAddress, EOrderType, EPayType, EStatusType } from "./enums.ts";
import clsx from "clsx";
import Input from "../../../assets/components/Input/Input.tsx";
import Button from "../../../assets/components/Button/Button.tsx";
import DropDown from "../../../assets/components/DropDown/DropDown.tsx";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { IListOption } from "../../../assets/components/DropDown/types.ts";
import { addCartState, addOrder, deleteBookFromCart, addOrderInAll, fetchCartBooks, updateBookCount, updateCartBookCount } from "../../../server/api.js";
import { v4 as uuidv4 } from 'uuid';
import { ICartBook } from "../types.ts";
import { IOrder } from "../../../types.ts";
import { toast } from "sonner";

const CartModal: FC<ICartModal> = ({
    isOpen,
    setIsOpen,
    setIsLoading,
    checkedBookItems,
    setCheckedBookItems,
    productsInCart,
    setProductsInCart,
    user,
    setOrders,
    orders,
    allOrders,
    setAllOrders,
    className,
    allBooks,
    setBooks,
}) => {
    const [activeOrderType, setActiveOrderType] = useState<EOrderType>(EOrderType.delivery);
    const [address, setAddress] = useState<string>("");
    const [activePayType, setActivePayType] = useState<string>("");

    const isOrderDisabled = activeOrderType === EOrderType.delivery && (address.trim().length < 2 || address.trim().length > 255 || !activePayType) ||
        activeOrderType === EOrderType.pickup && !activePayType;

    const getCartCost = (productsInCart: ICartBook[]): number => {
        let count = 0;
        productsInCart.forEach((product: ICartBook) => {
            count += product.book.price * product.count;
        });
        return Math.round(count * 100) / 100;
    }

    const handleAddCartState = async () => {
        const stateId = uuidv4();
        const orderId = uuidv4();
        const orderAddress = activeOrderType === EOrderType.delivery ? address.trim() : defaultPickupAddress;
        const orderDate = (new Date()).toLocaleString();
        const orderStatus = EStatusType.placed;

        setIsLoading(true);
        try {
            let booksArr: ICartBook[] = [];
            const updatedBooks = [...allBooks];
            const newCount = allOrders.length + 1;
            const carts = await fetchCartBooks();

            for (let i = 0; i < allBooks.length; i++) {
                const book = allBooks[i];
                const id = book.id;
                if (checkedBookItems.includes(id)) {
                    const currentBook = productsInCart.find((book: ICartBook) => book.book.id === id);
                    if (!!currentBook?.book) booksArr.push(currentBook);
                    const currentBookCount = currentBook?.count || 1;
                    const newCount = book.count - currentBookCount;
                    updatedBooks[i] = { ...book, count: newCount };
                    const cartBooks = carts.filter(cart => cart.idBook === id);
                    await updateBookCount(id, newCount);
                    await deleteBookFromCart(user.idCart, id);
                    await addCartState(stateId, id, currentBookCount);
                    for (const { idCart, idBook, bookCount } of cartBooks) {
                        if (bookCount > newCount && idCart !== user.idCart) {
                            await updateCartBookCount(idCart, idBook, newCount === 0 ? 1 : newCount);
                        }
                    }
                }
            }
            setBooks(updatedBooks);

            await addOrder(orderId, newCount, stateId, user.idUser, orderDate, orderAddress, getCartCost(booksArr), activePayType, orderStatus);
            await addOrderInAll(orderId, orderDate);

            const currentOrder: IOrder = {
                id: orderId,
                number: newCount,
                idCartState: stateId,
                date: orderDate,
                address: orderAddress,
                totalCost: getCartCost(booksArr),
                payment: activePayType,
                status: orderStatus,
                idUser: user.idUser,
                user: {
                    name: user.name,
                    surname: user.surname,
                    phone: !!user.phone ? user.phone : undefined,
                },
                admin: undefined,
                books: booksArr,
            };

            setOrders([...orders, currentOrder]);
            setAllOrders([...allOrders, { id: orderId, date: orderDate }]);
            setProductsInCart(productsInCart.filter((book: ICartBook) => !checkedBookItems.includes(book.book.id)));
            
            toast.success('Заказ создан');
        } catch (error) {
            toast.error("Ошибка при обработке состояния корзины и добавлении заказа:", error);
        } finally {
            setCheckedBookItems([]);
            setActiveOrderType(EOrderType.delivery);
            setAddress("");
            setActivePayType("");
            setIsOpen(false);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    return (
        <>
            {isOpen &&
                <div className={styles.wrapper}>
                    <div className={clsx(styles.modal, className)}>
                        <div className={styles.crossIconWrapper}>
                            <CrossIcon
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                        <span className={styles.orderTitle}>Оформление заказа</span>
                        <div className={styles.orderTypeWrapper}>
                            <div
                                className={clsx(
                                    styles.orderType,
                                    activeOrderType === EOrderType.delivery && styles["orderType-active"],
                                )}
                                onClick={() => setActiveOrderType(EOrderType.delivery)}
                            >
                                {EOrderType.delivery}
                            </div>
                            <div
                                className={clsx(
                                    styles.orderType,
                                    activeOrderType === EOrderType.pickup && styles["orderType-active"],
                                )}
                                onClick={() => setActiveOrderType(EOrderType.pickup)}
                            >
                                {EOrderType.pickup}
                            </div>
                        </div>
                        <div className={styles.form}>
                            {activeOrderType === EOrderType.delivery ?
                                <>
                                    <Input
                                        label="Адрес доставки"
                                        placeholder="Улица, дом, квартира..."
                                        requiredField
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </>
                                :
                                <>
                                    <div className={styles.mapWrapper}>
                                        <div className={styles.mapAddress}>Вы можете забрать свой заказ по адресу: <span>{defaultPickupAddress}</span></div>
                                        <YMaps>
                                            <Map
                                                defaultState={{ center: [51.710117, 39.159747], zoom: 16 }}
                                                className={styles.map}
                                                width={"100%"}
                                            >
                                                <Placemark
                                                    geometry={[51.710117, 39.159747]}
                                                    options={{
                                                        iconColor: "rgb(168, 118, 255)",
                                                    }}
                                                />
                                            </Map>
                                        </YMaps>
                                    </div>

                                </>
                            }
                            <DropDown
                                listOfOptions={Object.values(EPayType).map((val: string) => ({
                                    label: val,
                                    value: val,
                                }))}
                                valuesToSelect={!!activePayType ? [activePayType] : []}
                                onOptionChange={(option: IListOption) => setActivePayType(option.value)}
                                label="Способ оплаты"
                                placeholder="Выберите способ оплаты"
                                requiredField
                            />
                            <Button
                                text="Оформить заказ"
                                className={styles.orderBtn}
                                disabled={isOrderDisabled}
                                onClick={() => isOrderDisabled ?
                                    (activeOrderType === EOrderType.delivery ?
                                        toast.warning('Сначала введите адрес (2-255 символов) и укажите способ оплаты') :
                                        toast.warning('Сначала укажите способ оплаты'))
                                    :
                                    handleAddCartState()
                                }
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CartModal;
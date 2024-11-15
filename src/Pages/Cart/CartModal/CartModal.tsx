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
import { addCartState, addOrder, deleteBookFromCart } from "../../../server/api.js";
import { v4 as uuidv4 } from 'uuid';
import { ICartBook } from "../types.ts";
import { IOrder } from "../../../types.ts";

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
    className,
}) => {
    const [activeOrderType, setActiveOrderType] = useState<EOrderType>(EOrderType.delivery);
    const [address, setAddress] = useState<string>("");
    const [activePayType, setActivePayType] = useState<string>("");

    const isOrderDisabled = activeOrderType === EOrderType.delivery && (!address.trim() || !activePayType) ||
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
            const deleteAndAddPromises = checkedBookItems.map(async (bookId: string) => {
                const currentBook = productsInCart.find((book: ICartBook) => book.book.id === bookId);
                if (!!currentBook?.book) booksArr.push(currentBook);
                const currentBookCount = currentBook?.count || 1;
                await deleteBookFromCart(user.idCart, bookId);
                await addCartState(stateId, bookId, currentBookCount);
            });
            await Promise.all(deleteAndAddPromises);
            await addOrder(orderId, stateId, user.idUser, orderDate, orderAddress, getCartCost(booksArr), activePayType, orderStatus);
            const currentOrder: IOrder = {
                id: orderId,
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
            }
            setOrders([...orders, currentOrder]);
        } catch (error) {
            console.error("Ошибка при обработке состояния корзины и добавлении заказа:", error);
        } finally {
            setCheckedBookItems([]);
            setProductsInCart(productsInCart.filter((book: ICartBook) => !checkedBookItems.includes(book.book.id)));
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
                                    {/* TO-DO: сделать ограничения по вводимым символам */}
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
                                onClick={() => !isOrderDisabled && handleAddCartState()}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CartModal;
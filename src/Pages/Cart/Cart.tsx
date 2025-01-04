import React, { FC, useState } from "react";
import styles from './Cart.module.scss'
import { ICart, ICartBook } from "./types";
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../AppPathes.ts";
import clsx from "clsx";
import deleteIcon from '../../assets/pictures/delete_1214428.png';
import pictureCat1 from '../../assets/pictures-cats/158a44159274f86d8111cbf2e652d253.jpg';
import pictureCat2 from '../../assets/pictures-cats/6c4480a89e9596d59b67a0f916593005.jpg';
import pictureCat3 from '../../assets/pictures-cats/9981190e67c51e5499059b66b20807e9.jpg';
import pictureCat4 from '../../assets/pictures-cats/save = follow.jpg';
import Loader from "../../assets/components/Loader/Loader.tsx";
import { deleteBookFromCart, updateCartBookCount } from "../../server/api.js";
import Checkbox from "../../assets/components/Checkbox/Checkbox.tsx";
import CartModal from "./CartModal/CartModal.tsx";
import Button from "../../assets/components/Button/Button.tsx";
import { toast } from "sonner";

const Cart: FC<ICart> = ({
    productsInCart,
    setProductsInCart,
    user,
    orders,
    setOrders,
    ordersCount,
    setOrdersCount,
}) => {
    const { idCart } = user;
    const imagePaths = [pictureCat1, pictureCat2, pictureCat3, pictureCat4];
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [checkedBookItems, setCheckedBookItems] = useState<string[]>([]);
    const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const getCartCount = (): number => {
        let count = 0;
        productsInCart.forEach((product: ICartBook) => {
            if (checkedBookItems.includes(product.book.id)) {
                count += product.count
            }
        });
        return count;
    }

    const getCartCost = (): number => {
        let count = 0;
        productsInCart.forEach((product: ICartBook) => {
            if (checkedBookItems.includes(product.book.id)) {
                count += product.book.price * product.count
            }
        });
        return Math.round(count * 100) / 100;
    }

    const pluralizeWord = (number: number): string => {
        if (number % 10 === 1 && number % 100 !== 11) {
            return 'товар';
        } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
            return 'товара';
        } else {
            return 'товаров';
        }
    }

    const setCheckedItem = (bookId: string) => {
        if (checkedBookItems.includes(bookId)) {
            setCheckedBookItems(checkedBookItems.filter((id: string) => id !== bookId));
        } else {
            setCheckedBookItems([...checkedBookItems, bookId]);
        }
    }

    const setAllCheckedItem = () => {
        if (checkedBookItems.length === productsInCart.length) {
            setCheckedBookItems([]);
        } else {
            setCheckedBookItems(productsInCart.map((book: ICartBook) => book.book.id));
        }
    }

    const manipulateBookInCart = async (bookInCart: ICartBook, operation: "plus" | "minus") => {
        setIsLoading(true);
        const newCount = operation === "plus" ? bookInCart.count + 1 : bookInCart.count - 1;

        try {
            if (!!idCart) {
                if (newCount === 0) {
                    setCheckedBookItems(checkedBookItems.filter((id: string) => id !== bookInCart.book.id));
                    await deleteBookFromCart(idCart, bookInCart.book.id);
                } else {
                    await updateCartBookCount(idCart, bookInCart.book.id, newCount);
                }
            }
        } catch (error) {
            toast.error("Ошибка при добавлении / удалении книг в корзине:", error);
        } finally {
            setProductsInCart(productsInCart
                .map((item: ICartBook) => {
                    if (item.book.id === bookInCart.book.id) {
                        return {
                            book: item.book,
                            count: newCount,
                        }
                    }
                    return item;
                })
                .filter((item) => item.count > 0)
            );
            setTimeout(() => {
                setIsLoading(false);
            }, !!idCart ? 500 : 200);
        }
    };

    const handleDeleteBookFromCart = async (bookToDelete: ICartBook) => {
        setIsLoading(true);
        try {
            setProductsInCart(productsInCart.filter((book: ICartBook) =>
                book.book.id !== bookToDelete.book.id));
            setCheckedBookItems(checkedBookItems.filter((id: string) => id !== bookToDelete.book.id));
            if (!!idCart) {
                await deleteBookFromCart(idCart, bookToDelete.book.id);
            }
            toast.info('Книга удалена из корзины');
        } catch (error) {
            toast.error("Ошибка при удалении книги из корзины:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, !!idCart ? 500 : 200);
        }
    };

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.cartWrapper}>
                <div className={clsx(
                    styles.cartPanel,
                    productsInCart.length === 0 && styles.hidden,
                )}>
                    <div className={styles.mainTitle}>КОРЗИНА</div>
                    <div className={styles.selectAllContainerWrapper}>
                        <div className={styles.selectAllContainer}>
                            <Checkbox
                                id="selectAllCheckbox"
                                onChange={setAllCheckedItem}
                                checked={checkedBookItems.length === productsInCart.length}
                            />
                            <label
                                className={styles.checkboxText}
                                htmlFor="selectAllCheckbox"
                            >
                                Выбрать все
                            </label>
                        </div>
                    </div>
                    <div className={styles.cartContent}>
                        {/* TO-DO: исправить странную сортировку книг по количеству */}
                        {productsInCart.map((cartBook: ICartBook, index: number) => {
                            const book = cartBook.book;

                            return (
                                <div className={styles.productCard} key={index}>
                                    <Checkbox
                                        id={String(index)}
                                        onChange={() => setCheckedItem(book.id)}
                                        checked={checkedBookItems.includes(book.id)}
                                    />
                                    <Link
                                        to={EPath.main}
                                        className={styles.imgWrapper}
                                    >
                                        <img
                                            className={styles.productImage}
                                            src={book.imgLink}
                                            alt={book.name}
                                        />
                                    </Link>
                                    <div className={styles.productName}>
                                        <Link to={EPath.main}>{book.name}</Link>
                                    </div>
                                    <div className={styles.wrapperCountPrice}>
                                        <div className={styles.inputCount}>
                                            <button
                                                className={clsx(styles.btn, styles.btnMinus)}
                                                onClick={() => manipulateBookInCart(cartBook, "minus")}
                                            >
                                                -
                                            </button>
                                            <input
                                                className={styles.cardControl}
                                                type="number"
                                                value={cartBook.count}
                                                readOnly
                                            />
                                            <button
                                                className={clsx(styles.btn, styles.btnPlus)}
                                                onClick={() => manipulateBookInCart(cartBook, "plus")}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className={styles.productPrice}>{`${book.price} ₽`}</div>
                                    </div>
                                    <div className={styles.deleteWrapper}>
                                        <button
                                            id="delete"
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteBookFromCart(cartBook)}
                                        >
                                            <img
                                                src={deleteIcon}
                                                alt="Icon image delete"
                                                className={styles.iconImageDelete}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.summaryWrapper}>
                        <div className={styles.mainTitle}>Итого</div>
                        <div className={styles.cartSummary}>
                            <div className={styles.textSummary}>
                                <div className={styles.mainText}>
                                    {String(getCartCount()) + " " + pluralizeWord(getCartCount()) + " на сумму:"}
                                </div>
                                <div className={styles.costText}>
                                    {String(getCartCost()) + " ₽"}
                                </div>
                            </div>
                            <Button
                                text="Оформить заказ"
                                className={styles.checkoutBtn}
                                disabled={checkedBookItems.length === 0}
                                onClick={() => {
                                    if (!!idCart) {
                                        (checkedBookItems.length > 0 ? setIsOpenedModal(true) : toast.warning('Выберите товары'))
                                    } else {
                                        navigate(EPath.auth);
                                        toast.warning('Сначала войдите в профиль или зарегистрируйтесь', { duration: 2500 });
                                    }
                                }}
                            />
                            <CartModal
                                isOpen={isOpenedModal}
                                setIsOpen={setIsOpenedModal}
                                setIsLoading={setIsLoading}
                                checkedBookItems={checkedBookItems}
                                setCheckedBookItems={setCheckedBookItems}
                                productsInCart={productsInCart}
                                setProductsInCart={setProductsInCart}
                                user={user}
                                setOrders={setOrders}
                                orders={orders}
                                ordersCount={ordersCount}
                                setOrdersCount={setOrdersCount}
                            />
                        </div>
                    </div>
                </div>
                {productsInCart.length === 0 &&
                    <div className={styles.emptyCartPanel}>
                        <div className={styles.emptyCartImg}>
                            <img src={imagePaths[randomIndex]} alt="Картинка кота, чтобы вы не грустили!" />
                        </div>
                        <div className={styles.emptyCartBoldText}>
                            В корзине ничего нет
                        </div>
                        <div className={styles.emptyCartThinText}>
                            Воспользуйтесь поиском или перейдите в&nbsp;
                            <Link to={EPath.main} className={styles.catalogLink}>каталог</Link>,&nbsp;
                            чтобы найти интересные товары
                        </div>
                    </div>
                }
            </div>
        )
    )
}

export default Cart;
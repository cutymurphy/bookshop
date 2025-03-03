import { FC } from "react";
import { ICartCard } from "./types";
import styles from './CartCard.module.scss';
import React from "react";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import { Link } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";
import clsx from "clsx";
import deleteIcon from '../../../assets/pictures/delete_1214428.png';
import { toast } from "sonner";

const CartCard: FC<ICartCard> = ({
    cartBook,
    checkedBookItems,
    setCheckedItem,
    manipulateBookInCart,
    handleDeleteBookFromCart,
    isAvailable = true,
}) => {
    const { book } = cartBook;
    const { id, imgLink, name, price } = book;
    const isExtremeBooksNumber = cartBook.count >= cartBook.book.count;

    return (
        <div className={styles.productCard}>
            {isAvailable &&
                <Checkbox
                    id={id}
                    onChange={() => setCheckedItem(id)}
                    checked={checkedBookItems.includes(id)}
                />
            }
            <Link
                to={`${EPath.book}/${id}`}
                className={clsx(
                    styles.imgWrapper,
                    !isAvailable && styles["imgWrapper-margin"],
                )}
            >
                <img
                    className={clsx(
                        styles.productImage,
                        !isAvailable && styles["productImage-unavailable"],
                    )}
                    src={imgLink}
                    alt={name}
                />
            </Link>
            <div className={clsx(
                styles.productName,
                !isAvailable && styles["productName-unavailable"],
            )}>
                <Link to={`${EPath.book}/${id}`}>{name}</Link>
            </div>
            <div className={styles.wrapperCountPrice}>
                <div className={clsx(
                    styles.inputCount,
                    !isAvailable && styles["inputCount-unavailable"],
                )}>
                    <button
                        className={styles.btn}
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
                        className={clsx(
                            styles.btn,
                            isExtremeBooksNumber && styles["btn-disabled"],
                        )}
                        onClick={() => !isExtremeBooksNumber ?
                            manipulateBookInCart(cartBook, "plus") :
                            toast.warning("Выбрано максимальное количество доступных книг")
                        }
                    >
                        +
                    </button>
                </div>
                <div className={clsx(
                    styles.productPrice,
                    !isAvailable && styles["productPrice-unavailable"],
                )}>
                    {`${price} ₽`}
                </div>
            </div>
            <div className={styles.deleteWrapper}>
                <button
                    id="delete"
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteBookFromCart(cartBook)}
                >
                    <img
                        src={deleteIcon}
                        alt="Delete icon"
                        className={styles.iconImageDelete}
                    />
                </button>
            </div>
        </div>
    )
}

export default CartCard;
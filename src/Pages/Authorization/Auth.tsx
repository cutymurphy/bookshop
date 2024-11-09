import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from './Auth.module.scss';
import { IFullProfile, initialUser, IProfile } from "../../types.ts";
import { addBookToCart, addUser, getCartBooksById, getUserByEmail, getUserByEmailAndPassword, updateCartBookCount } from "../../server/api";
import Loader from "../../assets/components/Loader/Loader.tsx";
import { IAuth, IErrors, initialErrors } from "./types.ts";
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../AppPathes.ts";
import clsx from "clsx";
import Button from "../../assets/components/Button/Button.tsx";
import Checkbox from "../../assets/components/Checkbox/Checkbox.tsx";
import { ICartBook } from "../Cart/types.ts";

const Auth: FC<IAuth> = ({
    currentUser,
    setCurrentUser,
    currentCart,
    setCurrentCart,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [acceptRules, setAcceptRules] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [errors, setErrors] = useState<IErrors>({ ...initialErrors });
    const [errorExist, setErrorExist] = useState<string>("");
    const navigate = useNavigate();

    const handleChangeField = (field: keyof IProfile, e: ChangeEvent<HTMLInputElement>) => {
        setErrors({ ...errors, [field]: "" });
        setErrorExist("");
        setCurrentUser({ ...currentUser, [field]: String(e.target.value) });
    };

    const validateSignUp = (): boolean => {
        const newErrors = { ...initialErrors };
        let isValid = true;

        if (currentUser.name.trim() === "") {
            newErrors.name = "Имя не может быть пустым";
            isValid = false;
        }

        if (currentUser.surname.trim() === "") {
            newErrors.surname = "Фамилия не может быть пустой";
            isValid = false;
        }

        if (currentUser.email.trim() === "") {
            newErrors.email = "Почта не может быть пустой";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(currentUser.email.trim())) {
            newErrors.email = "Неверный формат email";
            isValid = false;
        }

        if (currentUser.phone.trim() === "") {
            newErrors.phone = "Телефон не может быть пустым";
            isValid = false;
        } else if (!/^\+?\d{10,15}$/.test(currentUser.phone.trim())) {
            newErrors.phone = "Неверный формат телефона";
            isValid = false;
        }

        if (currentUser.password.trim() === "") {
            newErrors.password = "Пароль не может быть пустым";
            isValid = false;
        } else if (currentUser.password.length < 6) {
            newErrors.password = "Пароль должен содержать не менее 6 символов";
            isValid = false;
        }

        if (!acceptRules) {
            newErrors.acceptRules = "Необходимо принять условия";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const validateSignIn = (): boolean => {
        const newErrors = { ...initialErrors };
        let isValid = true;

        if (currentUser.email.trim() === "") {
            newErrors.email = "Почта не может быть пустой";
            isValid = false;
        }

        if (currentUser.password.trim() === "") {
            newErrors.password = "Пароль не может быть пустым";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (isSignUp && validateSignUp()) {
                setIsLoading(true);
                const userByEmail = await getUserByEmail(currentUser.email.trim());
                if (!userByEmail) {
                    const user = {
                        ...currentUser,
                        name: currentUser.name.trim(),
                        surname: currentUser.surname.trim(),
                        email: currentUser.email.trim(),
                        phone: currentUser.phone.trim(),
                    }
                    await addUser(user);
                    const newUser: IFullProfile = await getUserByEmail(user.email);
                    if (currentCart.length > 0) {
                        const addBookToCartPromises = currentCart.map(async (book: ICartBook) => {
                            await addBookToCart(newUser.idCart, book.book.id, book.count);
                        });
                        await Promise.all(addBookToCartPromises);
                    }
                    if (rememberMe) {
                        localStorage.setItem("currentUser", newUser.idUser);
                    } else {
                        sessionStorage.setItem("currentUser", newUser.idUser);
                    }
                    setCurrentUser({ ...newUser, isAdmin: !!newUser.isAdmin });
                    navigate(EPath.auth);
                } else {
                    clearData();
                    setErrorExist("Такой пользователь уже существует");
                }
                setAcceptRules(false);
                setRememberMe(false);
            } else if (!isSignUp && validateSignIn()) {
                setIsLoading(true);
                const userByEmailAndPassword: IFullProfile = await getUserByEmailAndPassword(currentUser.email.trim(), currentUser.password);
                if (!!userByEmailAndPassword) {
                    if (currentCart.length > 0) {
                        const userCart = await getCartBooksById(userByEmailAndPassword.idCart);
                        const addBookToCartPromises = currentCart.map(async (book: ICartBook) => {
                            if (!userCart.find(cartBook => cartBook.idBook === book.book.id)) {
                                await addBookToCart(userByEmailAndPassword.idCart, book.book.id, book.count);
                            } else {
                                await updateCartBookCount(userByEmailAndPassword.idCart, book.book.id, book.count)
                            }
                        });
                        await Promise.all(addBookToCartPromises);
                    }
                    if (rememberMe) {
                        localStorage.setItem("currentUser", userByEmailAndPassword.idUser);
                    } else {
                        sessionStorage.setItem("currentUser", userByEmailAndPassword.idUser);
                    }
                    setCurrentUser({ ...userByEmailAndPassword, isAdmin: !!userByEmailAndPassword.isAdmin });
                    setAcceptRules(false);
                    setRememberMe(false);
                    !!userByEmailAndPassword.isAdmin ? navigate(EPath.admin) : navigate(EPath.auth);
                } else {
                    clearData();
                    setErrorExist("Такого пользователя не существует");
                }
            }
        } catch (error) {
            console.error(`Ошибка при ${isSignUp ? "регистрации" : "входе"} пользователя:`, error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const clearData = () => {
        setCurrentUser({ ...currentUser, name: "", surname: "", email: "", phone: "", password: "" });
        setErrors({ ...initialErrors });
    }

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            !currentUser.idUser ? (<div className={styles.wrapper}>
                <form
                    className={clsx(
                        styles.authWrapper,
                        isSignUp ? styles["authWrapper-signUp"] : styles["authWrapper-signIn"],
                    )}
                    key={isSignUp ? "signUp" : "signIn"}
                    onKeyDown={handleKeyDown}
                    onSubmit={handleSubmit}
                >
                    <h1>{isSignUp ? "Регистрация" : "Войти"}</h1>
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authName}
                            type="text"
                            name="Name"
                            placeholder="Name"
                            onChange={(e) => handleChangeField("name", e)}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>}
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authSurname}
                            type="text"
                            name="Surname"
                            placeholder="Surname"
                            onChange={(e) => handleChangeField("surname", e)}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.surname && <span className={styles.error}>{errors.surname}</span>}
                    </div>}
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authEmail}
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            onChange={(e) => handleChangeField("email", e)}
                        />
                        <i className='bx bxs-envelope'></i>
                        {!!errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authPhone}
                            type="tel"
                            name="tel"
                            placeholder="Phone"
                            onChange={(e) => handleChangeField("phone", e)}
                        />
                        <i className='bx bxs-phone'></i>
                        {!!errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>}
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authPassword}
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => handleChangeField("password", e)}
                        />
                        <i className='bx bxs-lock-alt'></i>
                        {!!errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>
                    {isSignUp && <div className={styles.checkboxWrapper}>
                        <Checkbox
                            id="selectAllCheckbox"
                            onChange={() => {
                                setAcceptRules(!acceptRules);
                                setErrors({ ...errors, acceptRules: "" });
                            }}
                            checked={acceptRules}
                        />
                        <label
                            className={styles.checkboxText}
                            htmlFor="selectAllCheckbox"
                        >
                            Я&nbsp;соглашаюсь с&nbsp;условиями пользовательского соглашения и&nbsp;политикой конфиденциальности
                        </label>
                        {!!errors.acceptRules && <span className={styles.error}>{errors.acceptRules}</span>}
                    </div>}
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            id="rememberMeCheckbox"
                            onChange={() => setRememberMe(!rememberMe)}
                            checked={rememberMe}
                        />
                        <label
                            className={styles.checkboxText}
                            htmlFor="rememberMeCheckbox"
                        >
                            Запомнить меня
                        </label>
                    </div>
                    {!!errorExist && <span className={styles.errorExist}>{errorExist}</span>}
                    <Button
                        className={styles.btn}
                        onClick={(e) => handleSubmit(e)}
                        type="submit"
                        text={isSignUp ? "Sign Up" : "Sign In"}
                    />
                </form>
                <div className={styles.changeAuthMethodWrapper}>
                    <span className={styles.textNew}>{isSignUp ? "Already have an account?" : "New to TimeForBook?"}</span>
                    <span
                        className={styles.textChangeAuth}
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            clearData();
                            setErrorExist("");
                        }}
                    >
                        {isSignUp ? "Sign in" : "Create an account"}
                    </span>
                </div>
            </div>) : (
                <div className={clsx(styles.wrapper, styles.wrapperText)}>
                    <span className={styles.text}>Здравствуйте, <span className={styles.name}>{currentUser.name} {currentUser.surname}</span>!</span>
                    <span className={styles.text}>В нашем <Link className={clsx(styles.name, styles.link)} to={EPath.main}>каталоге</Link> Вы точно найдете книгу по душе!</span>
                    <button
                        className={styles.btnLogOut}
                        onClick={() => {
                            setCurrentUser({ ...initialUser });
                            setCurrentCart([]);
                            sessionStorage.removeItem("currentUser");
                            localStorage.removeItem("currentUser");
                        }}
                    >
                        <div className={styles.btnContent}>
                            Хотите выйти? <i className='bx bx-log-out'></i>
                        </div>
                    </button>
                </div>
            )
        )
    )
}

export default Auth;
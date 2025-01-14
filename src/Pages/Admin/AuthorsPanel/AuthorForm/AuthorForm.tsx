import React, { useEffect, useState } from "react";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AuthorForm.module.scss";
import { IAuthorForm, IErrors } from "./types.ts";
import { IBook } from "../../../Main/ShopPanel/ShopContent/types.ts";
import Loader from "../../../../assets/components/Loader/Loader.tsx";
import { addAuthor, editAuthor } from "../../../../server/api.js";
import { EPath } from "../../../../AppPathes.ts";
import { v4 as uuidv4 } from 'uuid';
import ButtonAdmin from "../../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import ArrowLeftOutlineIcon from "../../../../assets/components/Icons/ArrowLeftOutlineIcon.tsx";
import { IAuthor, IFullProfile } from "../../../../types.ts";
import PencilIcon from "../../../../assets/components/Icons/PencilIcon.tsx";
import Input from "../../../../assets/components/Input/Input.tsx";
import { ETabTitle } from "../../enums.ts";
import { initialAuthor, initialErrors, trimAuthorInfo } from "./utils.ts";
import { toast } from "sonner";
import { emailPattern, phonePattern } from "../../../../utils.ts";

const AuthorForm: FC<IAuthorForm> = ({
    authors,
    setAuthors,
    books,
    setBooks,
    users,
    currentAdmin,
    isLoading,
    setIsLoading,
}) => {
    const { id = "" } = useParams<string>();
    const navigate = useNavigate();
    const [initialAuthorInfo, setInitialAuthorInfo] = useState<IAuthor>({ ...initialAuthor });
    const [authorInfo, setAuthorInfo] = useState<IAuthor>({ ...initialAuthor });
    const [errors, setErrors] = useState<IErrors>({ ...initialErrors });

    const { name, surname, email, phone, idAdmin, dateModified } = authorInfo;
    const prevAdmin = users.find((user: IFullProfile) => user.idUser === idAdmin);

    const isAuthorChanged = JSON.stringify(initialAuthorInfo) !== JSON.stringify(authorInfo);

    const validate = (author: IAuthor): boolean => {
        const { name, surname, email, phone } = author;
        const newErrors = { ...initialErrors };
        let isValid = true;

        if (name === "") {
            newErrors.name = "Имя не может быть пустым";
            isValid = false;
        } else if (name.length < 2 || name.length > 255) {
            newErrors.name = "Длина имени: 2-255 символов";
            isValid = false;
        }

        if (surname === "") {
            newErrors.surname = "Фамилия не может быть пустой";
            isValid = false;
        } else if (surname.length < 2 || surname.length > 255) {
            newErrors.surname = "Длина фамилии: 2-255 символов";
            isValid = false;
        }

        if (!!email) {
            if (email.length > 256) {
                newErrors.email = "Максимальная длина email - 256 символов";
                isValid = false;
            } else if (!emailPattern.test(email)) {
                newErrors.email = "Неверный формат email";
                isValid = false;
            }
        }

        if (!!phone && !phonePattern.test(phone)) {
            newErrors.phone = "Неверный формат телефона";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleManipulateAuthor = async () => {
        const newId = uuidv4();
        const trimmedAuthorInfo = trimAuthorInfo(authorInfo);
        const isValid = validate(trimmedAuthorInfo);

        const { name, surname, email, phone } = trimmedAuthorInfo;

        const nullEmail = !!email ? email : null;
        const nullPhone = !!phone ? phone : null;
        const modifyDate = (new Date()).toLocaleString();

        try {
            if (isValid) {
                setIsLoading(true);
                if (!!id) {
                    await editAuthor(id, name, surname, nullEmail, nullPhone, currentAdmin.idUser, modifyDate);
                    setBooks(books.map((book: IBook) =>
                        book.idAuthor !== id
                            ? book
                            : { ...book, author: `${name} ${surname}` }
                    ));
                    setAuthors(authors.map((author: IAuthor) =>
                        author.id !== id
                            ? author
                            : {
                                ...trimmedAuthorInfo,
                                dateModified: modifyDate,
                                idAdmin: currentAdmin.idUser
                            }
                    ));
                    toast.success("Информация об авторе отредактирована");
                } else {
                    await addAuthor(newId, name, surname, nullEmail, nullPhone, currentAdmin.idUser, modifyDate);
                    setAuthors([...authors, {
                        ...trimmedAuthorInfo,
                        id: newId,
                        dateModified: modifyDate,
                        idAdmin: currentAdmin.idUser,
                    }]);
                    toast.success("Запись о новом авторе создана");
                }
            } else {
                toast.error("Заполните все поля правильно");
            }
        } catch (error) {
            toast.error(`Ошибка при ${!!id ? "редактировании" : "создании"} автора:`, error);
        } finally {
            if (isValid) {
                !!id ? navigate(`${EPath.admin}?tab=${ETabTitle.authors}`) : navigate(`${EPath.adminAuthor}/${newId}`);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const currentAuthor = authors.find((author: IAuthor) => author.id === id);
        if (!!currentAuthor) {
            const changedFieldsAuthor = Object.fromEntries(
                Object.entries(currentAuthor).map(([key, value]) => [key, value === null ? "" : value])
            ) as IAuthor;
            setAuthorInfo({ ...changedFieldsAuthor });
            setInitialAuthorInfo({ ...changedFieldsAuthor });
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [id, authors]);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.formWrapper}>
                <div>
                    <ButtonAdmin
                        text='Назад'
                        leftIcon={<ArrowLeftOutlineIcon />}
                        onClick={() => navigate(`${EPath.admin}?tab=${ETabTitle.authors}`)}
                        type={"gray"}
                    />
                </div>
                <div className={styles.formTitle}>
                    <span className={styles.title}>{!!id ? `Редактирование автора №${id}` : "Создание новой записи"}</span>
                </div>
                {prevAdmin &&
                    <div className={styles.modifyWrapper}>
                        <span>Последнее редактирование: {prevAdmin.name} {prevAdmin.surname}, {dateModified}</span>
                        <PencilIcon color='var(--gray-purple)' height={11} />
                    </div>
                }
                <div className={styles.wrapper}>
                    <Input
                        label="Имя"
                        placeholder="Укажите имя автора"
                        requiredField
                        value={name}
                        onChange={(e) => {
                            setAuthorInfo({ ...authorInfo, name: e.target.value });
                            setErrors({ ...errors, name: "" });
                        }}
                        errorMessage={errors.name}
                    />
                    <Input
                        label="Фамилия"
                        placeholder="Укажите фамилию автора"
                        requiredField
                        value={surname}
                        onChange={(e) => {
                            setAuthorInfo({ ...authorInfo, surname: e.target.value });
                            setErrors({ ...errors, surname: "" });
                        }}
                        errorMessage={errors.surname}
                    />
                    <Input
                        label="Почта"
                        placeholder="Укажите почту автора"
                        value={email}
                        onChange={(e) => {
                            setAuthorInfo({ ...authorInfo, email: e.target.value });
                            setErrors({ ...errors, email: "" });
                        }}
                        errorMessage={errors.email}
                    />
                    <Input
                        label="Телефон"
                        placeholder="Укажите телефон автора"
                        value={phone}
                        onChange={(e) => {
                            setAuthorInfo({ ...authorInfo, phone: e.target.value });
                            setErrors({ ...errors, phone: "" });
                        }}
                        errorMessage={errors.phone}
                    />
                </div>
                <div className={styles.btnsWrapper}>
                    <ButtonAdmin
                        text='Сохранить'
                        onClick={() => !!id ? (isAuthorChanged ? handleManipulateAuthor() : toast.warning("Нет изменений для сохранения")) : handleManipulateAuthor()}
                        type={"purple"}
                        fill={"outline"}
                        disabled={!!id ? !isAuthorChanged : false}
                    />
                    {isAuthorChanged &&
                        <ButtonAdmin
                            text='Отменить'
                            onClick={() => {
                                setAuthorInfo({ ...initialAuthorInfo });
                                setErrors({ ...initialErrors });
                            }}
                            type={"gray"}
                        />
                    }
                </div>
            </div>
        )
    );
}

export default AuthorForm;
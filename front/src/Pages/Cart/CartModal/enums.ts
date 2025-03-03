export enum EOrderType {
    delivery = "Доставка",
    pickup = "Самовывоз",
}

export enum EPayType {
    card = "Карта",
    cash = "Наличные",
    translation = "Перевод",
    "e-money" = "Электронные деньги",
    other = "Другое",
}

export enum EStatusType {
    placed = "Оформлен",
    "in-process" = "В процессе",
    ready = "Готов к выдаче",
    delivered = "Доставлен",
    cancelled = "Отменен",
    closed = "Закрыт",
}

export const defaultPickupAddress = "бул. Победы, 23Б, этаж 3";
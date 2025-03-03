import { EBadgeType } from "../../../assets/components/Badge/enums.ts";
import { EStatusType } from "../../Cart/CartModal/enums.ts";

export const getBadgeType = (status: EStatusType): EBadgeType => {
    if (status === EStatusType.placed) return EBadgeType.gray;
    if (status === EStatusType.cancelled) return EBadgeType.red;
    if (status === EStatusType.ready) return EBadgeType.green;
    if (status === EStatusType.closed) return EBadgeType.blue;
    if (status === EStatusType["in-process"]) return EBadgeType.pink;
    if (status === EStatusType.delivered) return EBadgeType.purple;
    return EBadgeType.gray;
}

export const pluralizeWord = (number: number): string => {
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod10 === 1 && mod100 !== 11) {
        return "запись";
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return "записи";
    } else {
        return "записей";
    }
}
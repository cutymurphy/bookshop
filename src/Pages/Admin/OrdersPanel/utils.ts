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
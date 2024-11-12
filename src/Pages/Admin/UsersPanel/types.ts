import { IFullProfile } from "../../../types";

export interface IUsersPanel {
    users: IFullProfile[],
    currentAdmin: IFullProfile,
    setUsers: (orders: IFullProfile[]) => void,
    setIsLoading: (isLoading: boolean) => void,
}
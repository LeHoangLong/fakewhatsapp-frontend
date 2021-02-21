import { User } from "../model/UserModel";
import { BaseAction } from "./BaseActions";

export const EFoundUserActionTypes = {
    ADD_FOUND_USERS: Symbol('ADD_FOUND_USERS'),
}

export class FoundUserActionAddFoundUsers extends BaseAction {
    constructor(
        public searchTerm: string,
        public foundUsers: readonly User[],
        public isEndReached: boolean,
    ) {
        super(EFoundUserActionTypes.ADD_FOUND_USERS);
    }
}
import { User } from "../model/UserModel";
import { BaseAction } from "./BaseActions";

export const EFoundUserActionTypes = {
    UPDATE_SEARCH_TERM: Symbol('UPDATE_SEARCH_TERM'),
    ADD_FOUND_USERS: Symbol('ADD_FOUND_USERS'),
    CLEAR_SEARCH_RESULT: Symbol('CLEAR_SEARCH_RESULT'),
}

export class FoundUserActionUpdateSearchTerm extends BaseAction {
    constructor(
        public searchTerm: string,
    ) {
        super(EFoundUserActionTypes.UPDATE_SEARCH_TERM);
    }
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

export class FoundUserActionClearSearchResult extends BaseAction {
    constructor() {
        super(EFoundUserActionTypes.CLEAR_SEARCH_RESULT);
    }
}
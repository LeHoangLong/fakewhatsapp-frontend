import { User } from "../model/UserModel";
import { UserStatus } from "../state/UserState";
import { BaseAction } from "./BaseActions";

export const EUserActionTypes = {
    SET_USER: Symbol("SET_OPERATION_STATUS"),
    SET_USER_LOGIN_STATUS: Symbol("SET_OPERATION_STATUS"),
}

export class UserActionSetLoginStatus extends BaseAction {
    readonly userStatus: UserStatus;
    constructor(userStatus: UserStatus) {
        super(EUserActionTypes.SET_USER_LOGIN_STATUS);
        this.userStatus = userStatus;
    }
}

export class UserActionSetUser extends BaseAction {
    readonly user: User;
    constructor(user: User) {
        super(EUserActionTypes.SET_USER);
        this.user = user;
    }
}
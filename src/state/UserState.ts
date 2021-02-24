import { User } from "../model/UserModel";

export enum UserStatus {
    INIT = 'INIT',
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT',
    NOT_LOGGED_IN = 'NOT_LOGGED_IN'
}

export class UserState {
    readonly status: UserStatus;
    readonly user?: User;
    constructor(
        status: UserStatus, 
        user?: User
    ) {
        this.status = status;
        this.user = user;
    }
}
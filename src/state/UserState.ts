import { User } from "../model/UserModel";

export enum UserStatus {
    LOGGED_IN,
    LOGGED_OUT,
    NOT_LOGGED_IN
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
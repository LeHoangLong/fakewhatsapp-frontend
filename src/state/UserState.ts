import { User } from "../model/UserModel";
import { OperationState } from "./OperationState";

export enum UserStatus {
    LOGGED_IN,
    LOGGED_OUT,
    NOT_LOGGED_IN
}

export class UserState {
    readonly status: UserStatus;
    readonly user?: User;
    readonly operationState: OperationState;
    constructor(
        status: UserStatus, 
        operationState: OperationState, 
        user?: User
    ) {
        this.status = status;
        this.user = user;
        this.operationState = operationState;
    }
}
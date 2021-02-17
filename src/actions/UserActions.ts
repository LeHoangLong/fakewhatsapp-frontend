import { User } from "../model/UserModel";
import { OperationState, OperationStatus } from "../state/OperationState";
import { UserStatus } from "../state/UserState";
import { BaseAction } from "./BaseActions";

export enum EUserActionTypes {
    eSetOperationStatus = "eUserActionTypesSetOperationStatus",
    eSetUser = "eUserActionTypesSetUser",
    eSetUserLoginStatus = "eUserActionTypesSetUserLoginStatus",
}

export class UserSetOperationStatusAction extends BaseAction {
    readonly operationState: OperationState;
    constructor(status: OperationStatus, detail?: any) {
        super(EUserActionTypes.eSetOperationStatus);
        this.operationState = new OperationState(status, detail);
    }
}

export class UserSetLoginStatusAction extends BaseAction {
    readonly userStatus: UserStatus;
    constructor(userStatus: UserStatus) {
        super(EUserActionTypes.eSetUserLoginStatus);
        this.userStatus = userStatus;
    }
}

export class UserSetUserAction extends BaseAction {
    readonly user: User;
    constructor(user: User) {
        super(EUserActionTypes.eSetUser);
        this.user = user;
    }
}
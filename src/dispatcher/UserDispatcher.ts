import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { UserSetLoginStatusAction, UserSetOperationStatusAction, UserSetUserAction } from "../actions/UserActions";
import { config } from "../config";
import { User } from "../model/UserModel";
import { OperationStatus } from "../state/OperationState";
import { UserStatus } from "../state/UserState";

export class UserDispatcher {
    dispatch: Dispatch<BaseAction>;
    constructor(dispatch: Dispatch<BaseAction>) {
        this.dispatch = dispatch;
    } 

    async dispatchGetUserInfo() {
        this.dispatch(new UserSetOperationStatusAction(OperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/info/`);
            let user = new User(result.data.username);
            this.dispatch(new UserSetLoginStatusAction(UserStatus.LOGGED_IN).toPlainObject());
            this.dispatch(new UserSetUserAction(user).toPlainObject());
            this.dispatch(new UserSetOperationStatusAction(OperationStatus.SUCCESS).toPlainObject());
        } catch (err) {
            this.dispatch(new UserSetLoginStatusAction(UserStatus.NOT_LOGGED_IN).toPlainObject());
            this.dispatch(new UserSetOperationStatusAction(OperationStatus.ERROR).toPlainObject());
        }
        this.dispatch(new UserSetOperationStatusAction(OperationStatus.IDLE).toPlainObject());
    }
}
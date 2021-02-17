import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { UserSetOperationStatusAction } from "../actions/UserActions";
import { config } from "../config";
import { OperationStatus } from "../state/OperationState";

export class UserDispatcher {
    dispatch: Dispatch<BaseAction>;
    constructor(dispatch: Dispatch<BaseAction>) {
        this.dispatch = dispatch;
    } 

    async dispatchGetUserInfo() {
        this.dispatch(new UserSetOperationStatusAction(OperationStatus.IN_PROGRESS).toPlainObject());
        try {
            await axios.get(`${config.BACKEND_URL}/user/info/`);
            this.dispatch(new UserSetOperationStatusAction(OperationStatus.SUCCESS).toPlainObject());
        } catch (err) {
            this.dispatch(new UserSetOperationStatusAction(OperationStatus.ERROR).toPlainObject());
        }
        this.dispatch(new UserSetOperationStatusAction(OperationStatus.IDLE).toPlainObject());
    }
}
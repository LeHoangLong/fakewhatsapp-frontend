import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { UserActionSetLoginStatus, UserActionSetUser } from "../actions/UserActions";
import { config } from "../config";
import { User } from "../model/UserModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { UserStatus } from "../state/UserState";
import { IUserDispatcher } from "./IUserDispatcher";

export enum ELoginErrorDetailMessage {
    INVALID_CREDENTIALS = "Username or password not found",
    GENERIC_ERROR = "GENERIC_ERROR",
    USERNAME_ALREADY_EXISTS = "Username already exists"
}

export class UserDispatcher implements IUserDispatcher {
    dispatch: Dispatch<BaseAction>;
    constructor(dispatch: Dispatch<BaseAction>) {
        this.dispatch = dispatch;
    } 

    async dispatchGetUserInfo() {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.GET_USER_INFO, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/info/`);
            let user = new User(result.data.username);
            this.dispatch(new UserActionSetLoginStatus(UserStatus.LOGGED_IN).toPlainObject());
            this.dispatch(new UserActionSetUser(user).toPlainObject());
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.GET_USER_INFO, EOperationStatus.SUCCESS).toPlainObject());
        } catch (err) {
            this.dispatch(new UserActionSetLoginStatus(UserStatus.NOT_LOGGED_IN).toPlainObject());
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.GET_USER_INFO, EOperationStatus.ERROR).toPlainObject());
            throw err;
        }
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.GET_USER_INFO, EOperationStatus.IDLE).toPlainObject());
    }

    async dispatchLoginAndGetUserInfo(username: string, password: string) {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.LOG_IN, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            await axios.post(`${config.BACKEND_URL}/user/login`, {
                username: username,
                password: password,
            });
            await this.dispatchGetUserInfo();
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.LOG_IN, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            if (error.response.status === 403) {
                this.dispatch(new OperationStatusActionSetStatus(EOperationType.LOG_IN, EOperationStatus.ERROR, new BaseOperationStatusDetail(ELoginErrorDetailMessage.INVALID_CREDENTIALS)).toPlainObject());
            } else {
                this.dispatch(new OperationStatusActionSetStatus(EOperationType.LOG_IN, EOperationStatus.ERROR, new BaseOperationStatusDetail(ELoginErrorDetailMessage.GENERIC_ERROR)).toPlainObject());
            }
            throw error;
        }
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.LOG_IN, EOperationStatus.IDLE).toPlainObject());
    }

    async dispatchSignUpAndGetUserInfo(username: string, password: string) {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.SIGN_UP, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            await axios.post(`${config.BACKEND_URL}/user/signup`, {
                username: username,
                password: password,
            });
            await this.dispatchGetUserInfo();
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.SIGN_UP, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            if (error.response.status === 403) {
                //403 means user already exists
                this.dispatch(new OperationStatusActionSetStatus(EOperationType.SIGN_UP, EOperationStatus.ERROR, new BaseOperationStatusDetail(ELoginErrorDetailMessage.USERNAME_ALREADY_EXISTS)).toPlainObject());
            } else {
                this.dispatch(new OperationStatusActionSetStatus(EOperationType.SIGN_UP, EOperationStatus.ERROR, new BaseOperationStatusDetail(ELoginErrorDetailMessage.GENERIC_ERROR)).toPlainObject());
            }
            throw error;
        }
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.SIGN_UP, EOperationStatus.IDLE).toPlainObject());
    }
}
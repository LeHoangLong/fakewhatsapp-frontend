import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { EOperationStatus } from "../state/OperationStatusState";
import { UserState } from "../state/UserState";
import { UserLoginStatusController } from "./UserLoginStatusController";

export class LoginPageController {
    userLoginStatusController: UserLoginStatusController;
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
        this.userLoginStatusController = new UserLoginStatusController(dispatcher);
    }

    async onLogin(username: string, password: string) {
        try {
            await this.dispatcher.dispatchLogin(username, password);
            await this.dispatcher.dispatchGetUserInfo();
        } catch (err) {

        }
    }

    onGetUserInfoOperationStatusChanged(operationStatus: EOperationStatus, userState: UserState) {
        this.userLoginStatusController.onGetUserInfoOperationStatusChanged(operationStatus, userState);
    }

    onUserStateChanged(userState: UserState) {
        this.userLoginStatusController.onUserStateChanged(userState);
    }
}
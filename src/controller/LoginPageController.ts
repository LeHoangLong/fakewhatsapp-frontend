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
        await this.dispatcher.dispatchLogin(username, password);
        await this.dispatcher.dispatchGetUserInfo();
    }

    async onSignup(username: string, password: string) {
        await this.dispatcher.dispatchSignUp(username, password);
        await this.dispatcher.dispatchGetUserInfo();

    }

    onUserStateChanged(userState: UserState) {
        this.userLoginStatusController.onUserStateChanged(userState);
    }
}
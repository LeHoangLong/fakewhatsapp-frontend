import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { UserState, UserStatus } from "../state/UserState";

export class LoginPageController {
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
    }

    async onLogin(username: string, password: string) {
        await this.dispatcher.dispatchLoginAndGetUserInfo(username, password);
        window.location.href = '/'; //reload the page to reset the cookie
    }

    async onSignup(username: string, password: string) {
        await this.dispatcher.dispatchSignUpAndGetUserInfo(username, password);
        window.location.href = '/'; //reload the page to reset the cookie
    }

    onUserStateChanged(userState: UserState) {
        if (userState.status === UserStatus.INIT) {
            this.dispatcher.dispatchGetUserInfo();
        }
    }
}
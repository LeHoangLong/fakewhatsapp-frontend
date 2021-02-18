import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { UserState, UserStatus } from "../state/UserState";

export class MainPageController {
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
    }

    onUserStateChanged(userState: UserState) {
        if (userState.status === UserStatus.INIT) {
            this.dispatcher.dispatchGetUserInfo();
        }
    }

}
import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { UserState } from "../state/UserState";
import { UserLoginStatusController } from "./UserLoginStatusController";

export class MainPageController {
    userLoginStatusController: UserLoginStatusController;
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
        this.userLoginStatusController = new UserLoginStatusController(dispatcher);
    }

    onUserStateChanged(userState: UserState) {
        this.userLoginStatusController.onUserStateChanged(userState);
    }

}
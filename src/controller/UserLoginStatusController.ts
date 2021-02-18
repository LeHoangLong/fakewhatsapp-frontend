import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { EOperationStatus } from "../state/OperationStatusState";
import { UserState, UserStatus } from "../state/UserState";

export class UserLoginStatusController {
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
    } 

    onUserStateChanged(userState: UserState) {
        switch (userState.status) {
            case UserStatus.INIT:
                //on init, we check if user is not logged in yet
                //if not, we attempt to fetch info to see if we are logged in
                this.dispatcher.dispatchGetUserInfo();
                break;
            case UserStatus.LOGGED_IN:
                console.log("user logged in");
                window.location.hash = "";
                break;
            case UserStatus.NOT_LOGGED_IN: //intentional fall through
            case UserStatus.LOGGED_OUT:
                let hash = window.location.hash;
                console.log(hash.match(/^\/login.*/) === null);
                if (hash.match(/^\/login.*/) === null) {
                    //only redirect if we are not in log in or sign up page
                    window.location.hash = "/login";
                }
                break;
            default:
                break;
        }
    }
}
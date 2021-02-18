import { IUserDispatcher } from "../dispatcher/IUserDispatcher";
import { EOperationStatus } from "../state/OperationStatusState";
import { UserState, UserStatus } from "../state/UserState";

export class UserLoginStatusController {
    dispatcher: IUserDispatcher;
    constructor(dispatcher: IUserDispatcher) {
        this.dispatcher = dispatcher;
    } 

    onGetUserInfoOperationStatusChanged(operationStatus: EOperationStatus, userState: UserState) {
        switch (operationStatus) {
            case EOperationStatus.INIT:
                //on init, we check if user is not logged in yet
                //if not, we attempt to fetch info to see if we are logged in
                if (userState.status !== UserStatus.LOGGED_IN) {
                    this.dispatcher.dispatchGetUserInfo();
                }
                break;
            default:
                //do nothing
                break;
        }
    }
    
    onUserStateChanged(userState: UserState) {
        switch (userState.status) {
            case UserStatus.LOGGED_IN:
                window.location.hash = "";
                break;
            case UserStatus.NOT_LOGGED_IN: //intentional fall through
            case UserStatus.LOGGED_OUT:
                window.location.hash = "/login";
                break;
            default:
                break;
        }
    }
}
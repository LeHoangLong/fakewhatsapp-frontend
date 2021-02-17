import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { OperationStatus } from "../state/OperationState";
import { UserState, UserStatus } from "../state/UserState";

/**
 * Controller to handle events on App widget
 * Controllers should be stateless and thus should only have dispatch as its property.
 */

export class AppController {
    dispatcher: UserDispatcher;
    constructor(dispatcher: UserDispatcher) {
        this.dispatcher = dispatcher;
    } 
    
    onUserStateChanged(userState: UserState) {
        switch (userState.operationState.status) {
            case OperationStatus.INIT:
                //on start up, fetch user data (username for now)
                this.dispatcher.dispatchGetUserInfo();
                break;
            case OperationStatus.SUCCESS:
                //Some operation just succeed, check the status and redirect accordingly
                if (userState.status === UserStatus.LOGGED_IN) {
                    window.location.href = "";
                } else {
                    window.location.href = "/login";
                }
                break;
            default:
                break;
        }
    }
}
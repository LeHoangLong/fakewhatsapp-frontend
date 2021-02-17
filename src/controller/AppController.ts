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
        console.log("on user state change: " + userState.operationState.status);
        switch (userState.operationState.status) {
            case OperationStatus.INIT:
                //on start up, fetch user data (username for now)
                this.dispatcher.dispatchGetUserInfo();
                break;
            case OperationStatus.SUCCESS:
                //Some operation just succeed, check the status and redirect accordingly
                if (userState.status === UserStatus.LOGGED_IN) {
                    window.location.hash = "";
                } else {
                    window.location.hash = "/login";
                }
                break;
            case OperationStatus.ERROR:
                //since we cannot get any user info, redirect to login page seems
                //the approriate case here
                window.location.hash = "/login";
                break;
            default:
                break;
        }
    }
}
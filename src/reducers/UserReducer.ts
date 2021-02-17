import { BaseAction } from "../actions/BaseActions";
import { EUserActionTypes, UserSetLoginStatusAction, UserSetOperationStatusAction, UserSetUserAction } from "../actions/UserActions";
import { initialOperationState } from "../state/OperationState";
import { UserState, UserStatus } from "../state/UserState";

export const initialUserState: UserState = new UserState(UserStatus.NOT_LOGGED_IN, initialOperationState);

export function userReducer(userState: UserState = initialUserState, action: BaseAction): UserState {
    switch (action.type) {
        case EUserActionTypes.eSetOperationStatus:
            let setOperationStatusAction = action as UserSetOperationStatusAction;
            return new UserState(
                userState.status, 
                setOperationStatusAction.operationState,
                userState.user,
            );
        case EUserActionTypes.eSetUser:
            let setUserAction = action as UserSetUserAction;
            return new UserState(
                userState.status,
                userState.operationState,
                setUserAction.user
            );
        case EUserActionTypes.eSetUserLoginStatus:
            let setUserLoginStatusAction = action as UserSetLoginStatusAction;
            return new UserState(
                setUserLoginStatusAction.userStatus,
                userState.operationState,
                userState.user,
            );
        default:
            return userState;
    }
}
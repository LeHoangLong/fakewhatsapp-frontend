import { BaseAction } from "../actions/BaseActions";
import { EUserActionTypes, UserActionSetLoginStatus, UserActionSetUser } from "../actions/UserActions";
import { UserState, UserStatus } from "../state/UserState";

export const initialUserState: UserState = new UserState(UserStatus.NOT_LOGGED_IN);

export function userReducer(userState: UserState = initialUserState, action: BaseAction): UserState {
    switch (action.type) {
        case EUserActionTypes.SET_USER:
            let setUserAction = action as UserActionSetUser;
            return new UserState(
                userState.status,
                setUserAction.user
            );
        case EUserActionTypes.SET_USER_LOGIN_STATUS:
            let setUserLoginStatusAction = action as UserActionSetLoginStatus;
            return new UserState(
                setUserLoginStatusAction.userStatus,
                userState.user,
            );
        default:
            return userState;
    }
}
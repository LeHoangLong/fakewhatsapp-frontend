import { BaseAction } from "../actions/BaseActions";
import { initialOperationState } from "../state/OperationState";
import { UserState, UserStatus } from "../state/UserState";

export const initialUserState: UserState = new UserState(UserStatus.NOT_LOGGED_IN, initialOperationState);

export function userReducer(userState: UserState = initialUserState, action: BaseAction): UserState {
    switch (action.type) {
        default:
            return userState;
    }
}
import { BaseAction } from "../actions/BaseActions";
import { EFoundUserActionTypes, FoundUserActionAddFoundUsers } from "../actions/FoundUserAction";
import { FoundUserState } from "../state/FoundUserState"

export const initialFoundUserState: FoundUserState = new FoundUserState('', [], true);
export const foundUserReducer = (state: FoundUserState = initialFoundUserState, action: BaseAction) => {
    switch (action.type) {
        case EFoundUserActionTypes.ADD_FOUND_USERS:
            let updateFoundUserAction: FoundUserActionAddFoundUsers = action as FoundUserActionAddFoundUsers;
            if (updateFoundUserAction.searchTerm !== state.searchName) {
                return new FoundUserState(
                    updateFoundUserAction.searchTerm,
                    updateFoundUserAction.foundUsers,
                    updateFoundUserAction.isEndReached,
                );
            } else {
                return new FoundUserState(
                    state.searchName,
                    state.addUsers(updateFoundUserAction.foundUsers),
                    updateFoundUserAction.isEndReached,
                );
            }
        default:
            return state;
    }
}
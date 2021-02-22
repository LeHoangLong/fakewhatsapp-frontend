import { BaseAction } from "../actions/BaseActions";
import { EFoundUserActionTypes, FoundUserActionAddFoundUsers, FoundUserActionUpdateSearchTerm } from "../actions/FoundUserAction";
import { FoundUserState } from "../state/FoundUserState"

export const initialFoundUserState: FoundUserState = new FoundUserState('', [], true);
export const foundUserReducer = (state: FoundUserState = initialFoundUserState, action: BaseAction) => {
    switch (action.type) {
        case EFoundUserActionTypes.UPDATE_SEARCH_TERM:
            let updateSearchTermAction: FoundUserActionUpdateSearchTerm = action as FoundUserActionUpdateSearchTerm;
            return new FoundUserState(
                updateSearchTermAction.searchTerm,
                [],
                false,
            );
        case EFoundUserActionTypes.ADD_FOUND_USERS:
            let updateFoundUserAction: FoundUserActionAddFoundUsers = action as FoundUserActionAddFoundUsers;
            if (updateFoundUserAction.searchTerm === state.searchName) {
                return new FoundUserState(
                    state.searchName,
                    state.addUsers(updateFoundUserAction.foundUsers),
                    updateFoundUserAction.isEndReached,
                );
            } else {
                return state;
            }
        case EFoundUserActionTypes.CLEAR_SEARCH_RESULT:
            return new FoundUserState(
                state.searchName,
                [],
                false,
            );
        default:
            return state;
    }
}
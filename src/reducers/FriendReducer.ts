import { BaseAction } from "../actions/BaseActions";
import { EFriendActionTypes, FriendActionAddFriends, FriendActionSetpage, FriendActionSetTotalNumberOfFriends } from "../actions/FriendActions";
import { User } from "../model/UserModel";
import { FriendState } from "../state/FriendState";

export const initialFriendState  = new FriendState([], [], 0, 0, null);

export const friendReducer = (state: FriendState = initialFriendState, action: BaseAction) => {
    switch (action.type) {
        case EFriendActionTypes.ADD_FRIENDS:
            let addFriendAction = action as FriendActionAddFriends;
            let newFriends: User[] = [];
            for (let i = 0; i < addFriendAction.newFriends.length; i++) {
                if (!state.doesFriendWithInfoIdExists(addFriendAction.newFriends[i].infoId)) {
                    //add new friend
                    newFriends.push(addFriendAction.newFriends[i]);
                }
            }
            if (newFriends.length > 0) {
                return new FriendState(
                    state.allFriends.concat(newFriends),
                    state.filteredFriends,
                    state.currentOffset,
                    state.currentPageSize,
                    state.totalNumberOfFriends,
                );
            } else {
                return state;
            }
        case EFriendActionTypes.SET_TOTAL_NUMBER_OF_FRIENDS:
            let setTotalNumberOfFriendsAction = action as FriendActionSetTotalNumberOfFriends;
            return new FriendState(
                state.allFriends,
                state.filteredFriends,
                state.currentOffset,
                state.currentPageSize,
                setTotalNumberOfFriendsAction.numberOfFriends
            );
        case EFriendActionTypes.SET_PAGE:
            let setPageAction = action as FriendActionSetpage;    
            return new FriendState(
                state.allFriends,
                state.getPage(setPageAction.offset, setPageAction.pageSize),
                setPageAction.offset,
                setPageAction.pageSize,
                state.totalNumberOfFriends,
            )
        default:
            return state;
    }
}
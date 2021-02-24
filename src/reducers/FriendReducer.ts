import { BaseAction } from "../actions/BaseActions";
import { EFriendActionTypes, FriendActionAddFriends } from "../actions/FriendActions";
import { User } from "../model/UserModel";
import { FriendState } from "../state/FriendState";

export const initialFriendState  = new FriendState([], true);

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
            let isEndReached = state.isEndReached;
            if (addFriendAction.isEndReached !== null) {
                isEndReached = addFriendAction.isEndReached;
            }
            return new FriendState(
                state.allFriends.concat(newFriends),
                isEndReached,
            );
        default:
            return state;
    }
}
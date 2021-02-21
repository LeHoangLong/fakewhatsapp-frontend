import { BaseAction } from "../actions/BaseActions";
import { EFriendActionTypes, FriendActionAddFriends } from "../actions/FriendActions";
import { User } from "../model/UserModel";
import { FriendState } from "../state/FriendState";

export const initialFriendState  = new FriendState([], true);

export const friendReducer = (state: FriendState = initialFriendState, action: BaseAction) => {
    switch (action.type) {
        case EFriendActionTypes.ADD_FRIENDS:
            let addFriendAction = action as FriendActionAddFriends;
            if (addFriendAction.newFriends.length > 0) {
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
                        false,
                    );
                } else {
                    return state;
                }
            } else {
                return new FriendState(
                    state.allFriends,
                    true,
                )
            }
        default:
            return state;
    }
}
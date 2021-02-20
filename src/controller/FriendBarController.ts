import { config } from "../config";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";

export class FriendBarController {
    friendDispatcher: IFriendDispatcher;
    constructor(friendDispatcher: IFriendDispatcher) {
        this.friendDispatcher = friendDispatcher;
    }

    async onLoadNewFriends(friendState: FriendState, fetchFriendOperationStatus: OperationStatus) {
        if (fetchFriendOperationStatus.status === EOperationStatus.IDLE ||
            fetchFriendOperationStatus.status === EOperationStatus.INIT) {
            if (friendState.totalNumberOfFriends) {
                if (friendState.allFriends.length >= friendState.totalNumberOfFriends) {
                    return;
                } else {
                    let numberOfFriendsToGet = friendState.totalNumberOfFriends - friendState.allFriends.length;
                    if (numberOfFriendsToGet > config.DEFAULT_PAGE_SIZE) {
                        numberOfFriendsToGet = config.DEFAULT_PAGE_SIZE;
                    }
                    await this.friendDispatcher.fetchFriends(friendState.currentOffset, numberOfFriendsToGet, false);
                    await this.friendDispatcher.setPage(0, friendState.currentOffset + numberOfFriendsToGet); //infinite scrolling, so this will effectively show all results
                }
            } else {
                await this.friendDispatcher.fetchFriends(0, config.DEFAULT_PAGE_SIZE, true);
                await this.friendDispatcher.setPage(0, config.DEFAULT_PAGE_SIZE);
            }
        }
    }
}
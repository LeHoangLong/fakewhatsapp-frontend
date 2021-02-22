import { config } from "../config";
import { IFoundUserDispatcher } from "../dispatcher/IFoundUserDispatcher";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { FoundUserState } from "../state/FoundUserState";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";

export class FriendBarController {
    friendDispatcher: IFriendDispatcher;
    findUserDispatcher: IFoundUserDispatcher;
    constructor(friendDispatcher: IFriendDispatcher, findUserDispatcher: IFoundUserDispatcher) {
        this.friendDispatcher = friendDispatcher;
        this.findUserDispatcher = findUserDispatcher;
    }

    private async fetchNewFriends(friendState: FriendState, offset: number, limit: number, fetchFriendOperationStatus: OperationStatus) {
        if (fetchFriendOperationStatus.status === EOperationStatus.INIT) {
            await this.friendDispatcher.fetchFriends(offset, limit);
        }

        if (fetchFriendOperationStatus.status === EOperationStatus.IDLE) {
            if (friendState.isEndReached) {
                return;
            } else {
                await this.friendDispatcher.fetchFriends(offset, limit);
            }
        }
    }

    private async findFriendsByName(name: string) {
        if (name !== '') {
            let offset: number = 0;
            while (true) {
                let friends = await this.friendDispatcher.findFriendByName(name, offset, 10);
                if (friends.length === 0) {
                    break;
                }
            }
        }
    }

    private async findUsersByName(searchTerm: string, offset: number, limit: number, foundUserOperationStatus: EOperationStatus) {
        if (foundUserOperationStatus === EOperationStatus.IDLE || foundUserOperationStatus === EOperationStatus.INIT) {
            this.findUserDispatcher.findUserByName(searchTerm, offset, limit);
        }
    }

    async onSearchFriendNameChangeHandler(value: string) {
        if (value !== '') {
            this.findUserDispatcher.updateSearchTerm(value);
            await this.findFriendsByName(value);
            await this.findUsersByName(value, 0, config.DEFAULT_PAGE_SIZE, EOperationStatus.INIT); //set to init to reset the status because we want to refetch any time a value is changed
        }
    }

    async onLoadingIconShownHandler(searchValue: string, friendState: FriendState, foundUserState: FoundUserState, fetchFriendOperationStatus: OperationStatus, foundUserOperationStatus: OperationStatus) {
        if (searchValue === '') {
            this.fetchNewFriends(friendState, friendState.allFriends.length, friendState.allFriends.length + config.DEFAULT_PAGE_SIZE, fetchFriendOperationStatus);
        } else {
            this.findUsersByName(searchValue, foundUserState.allUsers.length, foundUserState.allUsers.length + config.DEFAULT_PAGE_SIZE, foundUserOperationStatus.status);
        }
    }
    
    onShown(fetchFriendOperationStatus: OperationStatus) {
        if (fetchFriendOperationStatus.status === EOperationStatus.INIT) {
            this.friendDispatcher.fetchFriends(0, config.DEFAULT_PAGE_SIZE);
        }
    }
}
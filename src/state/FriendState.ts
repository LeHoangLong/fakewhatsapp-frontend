import { config } from "../config";
import { User } from "../model/UserModel";

export class FriendStateErrorInfoIdNotFound {}
export class FriendState {
    constructor(
        public allFriends: readonly User[], 
        public filteredFriends: readonly User[], 
        public currentOffset: number, 
        public currentPageSize: number, 
        public totalNumberOfFriends: number | null) {
    }

    doesFriendWithInfoIdExists(infoId: number): boolean {
        let friend = this.allFriends.find((element) => element.infoId === infoId);
        if (!friend) {
            return false;
        } else {
            return true;
        }
    }

    findFriendByInfoId(infoId: number): User {
        let friend = this.allFriends.find((element) => element.infoId === infoId);
        if (!friend) {
            throw new FriendStateErrorInfoIdNotFound();
        } else {
            return friend;
        }
    }

    findFriendsByName(name: string, offset: number = 0, limit: number = config.DEFAULT_PAGE_SIZE) {
        let index: number = 0;
        let result: User[] = this.allFriends.filter((user) => {
            if (user.name.includes(name)) {
                index++;
                if (index >= offset && index < offset + limit) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        return result;
    }

    getPage(offset: number = 0, limit: number = config.DEFAULT_PAGE_SIZE): readonly User[] {
        let end: number = 0;
        if (offset > this.allFriends.length) {
            return [];
        } else {
            if (offset + limit > this.allFriends.length) {
                end = this.allFriends.length;
            } else {
                end = offset + limit;
            }
            return this.allFriends.slice(offset, end);
        }
    }
}
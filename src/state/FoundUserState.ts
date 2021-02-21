import { config } from "../config";
import { User } from "../model/UserModel";

export class FoundUserState {
    constructor(
        public searchName: string,
        public allUsers: readonly User[], 
        public isEndReached: boolean) {
    }

    getPage(offset: number = 0, limit: number = config.DEFAULT_PAGE_SIZE): readonly User[] {
        let end: number = 0;
        if (offset > this.allUsers.length) {
            return [];
        } else {
            if (offset + limit > this.allUsers.length) {
                end = this.allUsers.length;
            } else {
                end = offset + limit;
            }
            return this.allUsers.slice(offset, end);
        }
    }

    addUsers(users: readonly User[]): User[] {
        let ret: User[] = this.allUsers.slice();
        for (let i = 0; i < users.length; i++) {
            if (ret.findIndex((user) => user.infoId === users[i].infoId) === -1) {
                //only add user who has not been included
                ret.push(users[i]);
            }
        }
        return ret;
    }
}
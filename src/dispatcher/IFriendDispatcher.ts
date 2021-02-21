import { User } from "../model/UserModel";

export interface IFriendDispatcher {
    fetchFriends(offset: number, limit: number): Promise<void>;
    findFriendByName(name: string, offset: number, limit: number): Promise<User[]>;
}
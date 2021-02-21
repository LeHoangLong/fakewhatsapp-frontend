import { User } from "../model/UserModel";

export interface IFoundUserDispatcher {
    findUserByName(name: string, offset: number, limit: number): Promise<User[]>;
}
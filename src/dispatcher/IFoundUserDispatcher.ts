import { User } from "../model/UserModel";

export interface IFoundUserDispatcher {
    findUserByName(name: string, offset: number, limit: number): Promise<User[]>;
    clearFindResult(): void;
    updateSearchTerm(name: string): void;
    addUserIfNotYet(user: User): void;
}
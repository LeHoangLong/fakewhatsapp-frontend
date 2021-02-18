export interface IUserDispatcher {
    dispatchGetUserInfo(): Promise<void>;
    dispatchLogin(username: string, password: string): Promise<void>;
}
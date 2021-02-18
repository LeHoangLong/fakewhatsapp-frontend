export interface IUserDispatcher {
    dispatchGetUserInfo(): Promise<void>;
    dispatchLoginAndGetUserInfo(username: string, password: string): Promise<void>;
    dispatchSignUpAndGetUserInfo(username: string, password: string): Promise<void>;
}
import { UserState } from "./UserState";

export class AppState {
    userState: UserState;
    constructor(userState: UserState) {
        this.userState = userState;
    }
}
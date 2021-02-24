import { UserDispatcher } from "../dispatcher/UserDispatcher";
import cookie from 'react-cookies';

export class ProfileBarController {
    constructor(
        public userDispatcher: UserDispatcher,
    ) {
        
    }

    onLogout() {
        cookie.remove('jwt');
        this.userDispatcher.dispatchLogout();
    }
}
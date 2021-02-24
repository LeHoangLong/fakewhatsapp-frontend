import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { ProfileBarController } from "../controller/ProfileBarController";
import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { User } from "../model/UserModel"
import { AppState } from "../state/AppState";
import './ProfileBar.scss';

interface MapStateToProps {
    thisUser: User,
}

export const ProfileBar = () => {
    let { thisUser } = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        thisUser: state.userState.user!,
    }));

    let [showActionContainer, setShowActionContainer] = useState(false);
    let dispatch = useDispatch();
    let userDispatcher = useRef(new UserDispatcher(dispatch)).current;
    let controller = useRef(new ProfileBarController(userDispatcher)).current;

    function onExpandButtonClickHandler() {
        setShowActionContainer(!showActionContainer);
    }


    return (
        <div className="profile-bar">
            <div className="profile-letter">
                { thisUser.name[0].toUpperCase() }
            </div>
            <div className="option">
                <button className="expand-option-button" onClick={onExpandButtonClickHandler}>
                    <i className="fas fa-ellipsis-v"></i>
                </button>
                <div className={showActionContainer? 'action-container-show' : 'action-container-hidden'}>
                    <button className="log-out" onClick={() => controller.onLogout()}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    )
}
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FriendBarController } from '../controller/FriendBarController';
import { FriendDispatcher } from '../dispatcher/FriendDispatcher';
import { User } from '../model/UserModel';
import { AppState } from '../state/AppState';
import { FriendState } from '../state/FriendState';
import { OperationStatus } from '../state/OperationStatusState';
import './FriendBar.scss'
import { LoadingIcon } from './LoadingIcon';
import { SearchBar } from './SearchBar'

export const FriendBar = () => {
    let friendListRef = useRef(null);
    let loadingIconRef = useRef(null);
    let dispatch = useDispatch();
    let friendDispatcher: FriendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let controller: FriendBarController = useRef(new FriendBarController(friendDispatcher)).current;
    let [showLoadingIcon, setShowLoadingIcon] = useState(true);
    let [showAddUserText, setShowAddUserText] = useState(false);
    function onSearchFriendNameChangeHandler(name: string) {
        console.log(name);
    }

    interface MapStateToProps {
        friendState: FriendState,
        filteredFriends: readonly User[],
        fetchFriendOperationStatus: OperationStatus,
    }

    const {friendState, filteredFriends, fetchFriendOperationStatus} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
            friendState: state.friendState,
            filteredFriends: state.friendState.filteredFriends,
            fetchFriendOperationStatus: state.operationStatusState.fetchFriendsStatus,
    }));

    useEffect(() => {
        if (showLoadingIcon) {
            let intersectionObserver = new IntersectionObserver((entries) => {
                controller.onLoadNewFriends(friendState, fetchFriendOperationStatus);
            }, {
                root: friendListRef.current,
                threshold: 0.5,
            });
            intersectionObserver.observe(loadingIconRef.current!);
            return () => intersectionObserver.disconnect();
        }
    }, [controller, friendState, showLoadingIcon]);

    useEffect(() => {
        if (friendState.totalNumberOfFriends !== null) {
            if (friendState.totalNumberOfFriends === 0) {
                setShowAddUserText(true);
                setShowLoadingIcon(false);
            } else {
                setShowAddUserText(false);
                if (friendState.allFriends.length < friendState.totalNumberOfFriends) {
                    setShowLoadingIcon(true);
                } else {
                    setShowLoadingIcon(false);
                }
            }
        }

    }, [friendState])

    function displayFriends(friends: readonly User[]) {
        let ret = [];
        for (let i = 0; i < friends.length; i++) {
            ret.push(
                <div key={ friends[i].infoId } className="friend-card">
                    <div className="profile-letter">
                        { friends[i].name[0].toUpperCase() }
                    </div>
                    <div className="name">
                        { friends[i].name }
                    </div>
                </div>
            )
        }
        return ret;
    }

    return (
        <div className="friend-bar">
            <div className="search-bar-container">
                <SearchBar onTextChange={onSearchFriendNameChangeHandler}></SearchBar>
            </div>
            <div className="friend-list" ref={friendListRef}>
                { displayFriends(filteredFriends) }
                {(() => {
                    if (showAddUserText) {
                        return (
                            <div className="add-user-text">
                                You don't have any friends yet. Use the search bar to find new friends and message them.
                            </div>
                        );
                    } else {
                        if (showLoadingIcon) {
                            return ( 
                                <div className="friend-list-loading-icon-container" ref={loadingIconRef}>
                                    <LoadingIcon sizePx={30}></LoadingIcon>
                                </div>
                            );
                        }
                    }
                })()}
            </div>
        </div>
    )
}
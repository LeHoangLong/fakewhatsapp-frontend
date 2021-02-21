import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FriendBarController } from '../controller/FriendBarController';
import { FoundUserDispatcher } from '../dispatcher/FoundUserDispatcher';
import { FriendDispatcher } from '../dispatcher/FriendDispatcher';
import { User } from '../model/UserModel';
import { AppState } from '../state/AppState';
import { FoundUserState } from '../state/FoundUserState';
import { FriendState } from '../state/FriendState';
import { EOperationStatus, OperationStatus } from '../state/OperationStatusState';
import './FriendBar.scss'
import { LoadingIcon } from './LoadingIcon';
import { SearchBar } from './SearchBar'

interface FriendBarProps {
    onUserSelected(user: User): void;
}

export const FriendBar = ({onUserSelected}: FriendBarProps) => {
    let friendListRef = useRef(null);
    let loadingIconRef = useRef(null);
    let dispatch = useDispatch();
    let friendDispatcher: FriendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let foundUserDispatcher: FoundUserDispatcher = useRef(new FoundUserDispatcher(dispatch)).current;
    let controller: FriendBarController = useRef(new FriendBarController(friendDispatcher, foundUserDispatcher)).current;
    let [showLoadingIcon, setShowLoadingIcon] = useState(true);
    let [addUserText, setAddUserText] = useState('');
    let [searchName, setSearchName] = useState('');

    function onSearchFriendNameChangeHandler(name: string) {
        setSearchName(name);
        controller.onSearchFriendNameChangeHandler(name);
    }

    interface MapStateToProps {
        thisUser: User,
        friendState: FriendState,
        fetchFriendOperationStatus: OperationStatus,
        foundUserState: FoundUserState,
        foundUserOperationStatus: OperationStatus,
    }

    const {thisUser, friendState, fetchFriendOperationStatus, foundUserState,foundUserOperationStatus} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
            thisUser: state.userState.user!,
            friendState: state.friendState,
            fetchFriendOperationStatus: state.operationStatusState.fetchFriendsStatus,
            foundUserState: state.foundUserState,
            foundUserOperationStatus: state.operationStatusState.findUserStatus,
    }));

    useEffect(() => {
        if (showLoadingIcon) {
            let intersectionObserver = new IntersectionObserver((entries) => {
                controller.onLoadingIconShownHandler(searchName, friendState, foundUserState, fetchFriendOperationStatus, foundUserOperationStatus);
            }, {
                root: friendListRef.current,
                threshold: 0.5,
            });
            intersectionObserver.observe(loadingIconRef.current!);
            return () => intersectionObserver.disconnect();
        }
    }, [controller, friendState, showLoadingIcon, fetchFriendOperationStatus, foundUserOperationStatus, foundUserState, searchName]);

    useEffect(() => {
        if (searchName === '') {
            if (friendState.allFriends.length === 0 && friendState.isEndReached) {
                setAddUserText("You don't have any friends yet. Use the search bar to find new friends and message them.");
                setShowLoadingIcon(false);
            } else {
                setAddUserText('');
                if (!friendState.isEndReached ||
                    fetchFriendOperationStatus.status === EOperationStatus.IN_PROGRESS ||
                    fetchFriendOperationStatus.status === EOperationStatus.INIT
                    ) {
                    setShowLoadingIcon(true);
                } else if (friendState.isEndReached){
                    setShowLoadingIcon(false);
                } 
            }
        } else {
            if (friendState.allFriends.length === 0 &&
                friendState.isEndReached &&
                foundUserState.allUsers.length === 0 &&
                foundUserState.isEndReached) {
                setAddUserText("No users found");
                setShowLoadingIcon(false);
            } else {
                setAddUserText('');
                if (!foundUserState.isEndReached ||
                    fetchFriendOperationStatus.status === EOperationStatus.IN_PROGRESS ||
                    fetchFriendOperationStatus.status === EOperationStatus.INIT ||
                    foundUserOperationStatus.status === EOperationStatus.IN_PROGRESS
                    ) {
                    setShowLoadingIcon(true);
                } else {
                    setShowLoadingIcon(false);
                }
            }
        }
    }, [friendState,
        fetchFriendOperationStatus, 
        foundUserOperationStatus.status, 
        foundUserState.isEndReached, 
        searchName, 
        foundUserState.allUsers.length
    ])

    function displayFriends(friendState: FriendState, foundUserState: FoundUserState) {
        let ret = [];
        let friends: User[] = [];
        if (searchName !== '' && thisUser.name.includes(searchName)) {
            ret.push(
                <div key="me-title" className="group-title">
                    Me
                </div>
            )
            ret.push(
                <div key={ thisUser.infoId } className="friend-card">
                    <div className="profile-letter">
                        { thisUser.name[0].toUpperCase() }
                    </div>
                    <div className="name">
                        { thisUser.name }
                    </div>
                </div>
            )
        }

        if (searchName === '') {
            friends = friendState.allFriends as User[];
        } else {
            for (let i = 0; i < friendState.allFriends.length; i++) {
                let friend: User = friendState.allFriends[i];
                if (friend.name.includes(searchName) && friend.infoId !== thisUser.infoId) {
                    friends.push(friendState.allFriends[i]);
                }
            }
        }
        if (friends.length > 0) {
            ret.push(
                <div key="friends-title" className="group-title">
                    Friends
                </div>
            )
        }
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
        if (searchName !== '') {
            let usersToShow: User[] = [];
            for (let i = 0; i < foundUserState.allUsers.length; i++) {
                let user: User = foundUserState.allUsers[i];
                if (!friendState.doesFriendWithInfoIdExists(user.infoId) && user.infoId !== thisUser.infoId) {
                    usersToShow.push(user);
                }
            }
            if (usersToShow.length > 0) {
                ret.push(
                    <div key="stranger-title" className="group-title">
                        People
                    </div>
                )
            }
            for (let i = 0; i < usersToShow.length; i++) {
                ret.push(
                    <div key={ usersToShow[i].infoId } className="friend-card" onClick={() => onUserSelected(usersToShow[i])}>
                        <div className="profile-letter">
                            { usersToShow[i].name[0].toUpperCase() }
                        </div>
                        <div className="name">
                            { usersToShow[i].name }
                        </div>
                    </div>
                )
            }
        }
        return ret;
    }

    return (
        <div className="friend-bar">
            <div className="search-bar-container">
                <SearchBar onTextChange={onSearchFriendNameChangeHandler}></SearchBar>
            </div>
            <div className="friend-list" ref={friendListRef}>
                { displayFriends(friendState, foundUserState) }
                {(() => {
                    if (addUserText !== '') {
                        return (
                            <div className="add-user-text">
                                { addUserText }
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
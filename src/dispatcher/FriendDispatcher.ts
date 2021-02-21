import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { FriendActionAddFriends } from "../actions/FriendActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { config } from "../config";
import { User } from "../model/UserModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { IFriendDispatcher } from "./IFriendDispatcher";

export class FriendDispatcher implements IFriendDispatcher {
    dispatch: Dispatch<BaseAction>;
    constructor(dispatch: Dispatch<BaseAction>) {
        this.dispatch = dispatch;
    }

    async fetchFriends(offset: number, limit: number): Promise<void> {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/friends`, {
                params: {
                    offset: offset,
                    limit: limit,
                }
            });
            let friends: User[] = [];
            let resultData = result.data; 
            for (let i = 0; i < resultData.rows.length; i++) {
                friends.push(new User(resultData.rows[i].name, resultData.rows[i].infoId));
            }
            let isEndReached = resultData.rows.length < limit;
            this.dispatch(new FriendActionAddFriends(friends, isEndReached));
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FETCH_FRIENDS, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IDLE).toPlainObject());
        }
    }

    async findFriendByName(name: string, offset: number, limit: number): Promise<User[]> {
        let friends: User[] = [];
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/friends`, {
                params: {
                    offset: offset,
                    limit: limit,
                    name: name,
                }
            });
            let resultData = result.data;
            for (let i = 0; i < resultData.rows.length; i++) {
                friends.push(new User(resultData.rows[i].name, resultData.rows[i].infoId));
            }
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FETCH_FRIENDS, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
            throw error;
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IDLE).toPlainObject());
        }
        return friends;
    }
}
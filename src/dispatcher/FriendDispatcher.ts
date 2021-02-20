import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { FriendActionAddFriends, FriendActionSetpage, FriendActionSetTotalNumberOfFriends } from "../actions/FriendActions";
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
    async fetchFriends(offset: number, limit: number, getCount: boolean): Promise<void> {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/friends`, {
                params: {
                    offset: offset,
                    limit: limit,
                    getCount: getCount? 'true' : 'false',
                }
            });
            let friends: User[] = [];
            let resutlData = result.data; 
            for (let i = 0; i < resutlData.rows.length; i++) {
                friends.push(new User(resutlData.rows[i].name, resutlData.rows[i].infoId));
            }
            if ('count' in resutlData) {
                this.dispatch(new FriendActionSetTotalNumberOfFriends(parseInt(resutlData.count)).toPlainObject());
            }
            this.dispatch(new FriendActionAddFriends(friends));
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FETCH_FRIENDS, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
        }
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_FRIENDS, EOperationStatus.IDLE).toPlainObject());
    }

    setPage(offset: number, limit: number) {
        this.dispatch(new FriendActionSetpage(offset, limit).toPlainObject());
    }
}
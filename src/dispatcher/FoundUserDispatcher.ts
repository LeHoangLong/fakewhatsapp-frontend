import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { FoundUserActionAddFoundUsers, FoundUserActionAddUserIfNotYet, FoundUserActionClearSearchResult, FoundUserActionUpdateSearchTerm } from "../actions/FoundUserAction";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { config } from "../config";
import { User } from "../model/UserModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { IFoundUserDispatcher } from "./IFoundUserDispatcher";

export class FoundUserDispatcher implements IFoundUserDispatcher {
    constructor(
        public dispatch: Dispatch<BaseAction>,
    ) {

    }

    updateSearchTerm(name: string): void {
        this.dispatch(new FoundUserActionUpdateSearchTerm(name).toPlainObject());
    }

    async findUserByName(name: string, offset: number, limit: number): Promise<User[]> {
        let ret: User[] = [];
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FIND_USER, EOperationStatus.IN_PROGRESS).toPlainObject());    
        try {
            let result = await axios.get(`${config.BACKEND_URL}/user/find`, {
                params: {
                    name: name,
                    offset: offset,
                    limit: limit,
                }
            });
            let resultData = result.data;
            let foundUsers: User[] = [];
            let foundUserRows = resultData.rows;
            for (let i = 0; i < foundUserRows.length; i++) {
                foundUsers.push(new User(foundUserRows[i].name, foundUserRows[i].userInfoId));
            }
            let isEndReached: boolean = foundUserRows.length < limit;
            this.dispatch(new FoundUserActionAddFoundUsers(name, foundUsers, isEndReached).toPlainObject());
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FIND_USER, EOperationStatus.SUCCESS).toPlainObject());    
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FIND_USER, 
                    EOperationStatus.ERROR,
                    new BaseOperationStatusDetail(
                        error.toString(),
                    )
                ).toPlainObject()
            );    
            throw error;
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FIND_USER, EOperationStatus.IDLE).toPlainObject());    
        }
        return ret;
    }

    clearFindResult(): void {
        this.dispatch(new FoundUserActionClearSearchResult().toPlainObject());
    }

    addUserIfNotYet(user: User): void {
        this.dispatch(new FoundUserActionAddUserIfNotYet(user).toPlainObject());
    }
}
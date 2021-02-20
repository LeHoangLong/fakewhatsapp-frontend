import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";

export interface IFriendDispatcher {
    fetchFriends(offset: number, limit: number, getCount: boolean): Promise<void>;
    setPage(offset: number, limit: number): void;
}
import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { ChatActionAddChat,ChatActionInsertChat, ChatActionSetSelectedChat, ChatActionSetSelectedPendingMessage } from "../actions/ChatActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { config } from "../config";
import { Chat } from "../model/ChatModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { IChatDispatcher, IChatDispatcherChatToUserIdDoesNotExists } from "./IChatDispatcher";

export class ChatDispatcher implements IChatDispatcher {
    constructor(
        public dispatch: Dispatch<BaseAction>
    ) {

    }

    async fetchRecentChats(offset: number, limit: number): Promise<void> {
        try {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT, EOperationStatus.IN_PROGRESS).toPlainObject());
            let result = await axios.get(`${config.BACKEND_URL}/chats/recent/`, {
                params: {
                    offset: offset,
                    limit: limit,
                }
            });
            let chats: Chat[] = [];
            let resultData = result.data;
            let isEndReached = resultData.rows.length < limit;
            for (let i = 0; i < resultData.rows.length; i++) {
                chats.push(
                    new Chat(
                        resultData.rows[i].id,
                        resultData.rows[i].latestMessageContent,
                        resultData.rows[i].latestMessageSentTime,
                        [],
                    )
                )
            }
            this.dispatch(new ChatActionAddChat(chats, isEndReached).toPlainObject());
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FETCH_CHAT, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
            throw error;
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT, EOperationStatus.IDLE).toPlainObject());
        }
    }

    async fetchChatToUser(thisUserInfoId: number, userInfoId: number): Promise<Chat> {
        try {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT_TO_USER, EOperationStatus.IN_PROGRESS).toPlainObject());
            let result = await axios.get(`${config.BACKEND_URL}/chats/conversation/`, {
                params: {
                    participantId: userInfoId,
                }
            });
            let resultData = result.data;
            let chat = new Chat(
                resultData.id,
                resultData.latestMessageContent,
                resultData.latestMessageSentTime,
                [thisUserInfoId, userInfoId]
            )
            this.dispatch(new ChatActionInsertChat(chat).toPlainObject());
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT_TO_USER, EOperationStatus.SUCCESS).toPlainObject());
            return chat;
        } catch (error) {
            if (error.response.status === 404) {
                throw new IChatDispatcherChatToUserIdDoesNotExists(userInfoId);
            } else {
                this.dispatch(
                    new OperationStatusActionSetStatus(
                        EOperationType.FETCH_CHAT_TO_USER, 
                        EOperationStatus.ERROR, 
                        new BaseOperationStatusDetail(error.toString())
                    ).toPlainObject()
                );
                throw error;
            }
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_CHAT_TO_USER, EOperationStatus.IDLE).toPlainObject());
        }
    }

    setSelectedChat(chat: Chat | null): void {
        this.dispatch(new ChatActionSetSelectedChat(chat).toPlainObject());
    }

    setWritingMessageToUser(recipientInfoId: number, content: string): void {
        this.dispatch(new ChatActionSetSelectedPendingMessage(recipientInfoId, content).toPlainObject());
    }
}
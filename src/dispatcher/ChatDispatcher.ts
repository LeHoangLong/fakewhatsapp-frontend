import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { ChatActionAddChat,ChatActionAddMessage,ChatActionUpdateMessage,ChatActionInsertChat, ChatActionSetSelectedChat, ChatActionSetSelectedPendingMessage, ChatActionUpdateChatMessageStatus } from "../actions/ChatActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { config } from "../config";
import { Chat, EChatMessageStatus } from "../model/ChatModel";
import { EMessageStatus, Message } from "../model/MessageModel";
import { User } from "../model/UserModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { IChatDispatcher, IChatDispatcherChatToUserIdDoesNotExists, FindUserDelegate } from "./IChatDispatcher";
import { uuid } from 'uuidv4';

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
                        [],
                        EChatMessageStatus.NOT_FETCHED
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
            let result = await axios.get(`${config.BACKEND_URL}/chats/conversation/to/${userInfoId}`);
            let resultData = result.data;
            let latestMessageContent: string;
            if (resultData.latestMessageContent !== null) {
                latestMessageContent = resultData.latestMessageContent;
            } else {
                latestMessageContent = '';
            }

            let latestMessageSentTime: Date;
            if (resultData.latestMessageSentTime !== null) {
                latestMessageSentTime = new Date(resultData.latestMessageSentTime);
            } else{
                latestMessageSentTime = new Date();
            }
            let chat = new Chat(
                resultData.id,
                latestMessageContent,
                latestMessageSentTime,
                [thisUserInfoId, userInfoId],
                [],
                EChatMessageStatus.NOT_FETCHED
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

    async sendMessageToChat(sender: User, chatID: number, content: string): Promise<Message> {
        let token = uuid();
        let message = new Message(
            null,
            sender.infoId,
            sender.name,
            content,
            new Date(),
            EMessageStatus.SENDING,
            token,
        )
        this.dispatch(new ChatActionAddMessage(chatID, message).toPlainObject());
        let result = await axios.post(`${config.BACKEND_URL}/chats/conversation/${chatID}/messages`, {
            content: content,
        });
        let resultData = result.data;
        this.dispatch(new ChatActionUpdateMessage(chatID, resultData.message.id, token, resultData.sentTime, EMessageStatus.SENT).toPlainObject());
        return message;
    }
    
    async createChat(thisUserInfoId: number, otherUserInfoId: number): Promise<Chat> {
        try {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.CREATE_CHAT_TO_USER, EOperationStatus.IN_PROGRESS).toPlainObject());
            let result = await axios.post(`${config.BACKEND_URL}/chats/conversation`, {
                otherUserInfoId: otherUserInfoId,
            });
            let resultData = result.data;
            let chat = new Chat(
                resultData.id,
                resultData.latestMessageContent,
                resultData.latestMessageSentTime,
                [thisUserInfoId, otherUserInfoId],
                [],
                EChatMessageStatus.NOT_FETCHED
            );
            this.dispatch(new ChatActionInsertChat(chat).toPlainObject());
            return chat;
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.CREATE_CHAT_TO_USER, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
            throw error;
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.CREATE_CHAT_TO_USER, EOperationStatus.IDLE).toPlainObject());
        }
    }

    async fetchMessagesFromChat(chatId: number, findUserDelegate: FindUserDelegate): Promise<Message[]> {
        try {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_MESSAGES_FROM_CHAT, EOperationStatus.IN_PROGRESS).toPlainObject());
            let result = await axios.get(`${config.BACKEND_URL}/chats/conversation/${chatId}/messages`);
            let ret: Message[] = [];
            let resultRows = result.data.rows;
            for (let i = 0; i < resultRows.length; i++) {
                let user = await findUserDelegate(resultRows[i].senderInfoId);
                let message = new Message(
                    resultRows[i].id,
                    resultRows[i].senderInfoId,
                    user.name,
                    resultRows[i].content,
                    resultRows[i].sentTime,
                    EMessageStatus.SENT,
                    null,
                );
                ret.push(message);
                this.dispatch(new ChatActionAddMessage(chatId, message).toPlainObject());
            }
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_MESSAGES_FROM_CHAT, EOperationStatus.SUCCESS).toPlainObject());
            return ret;
        } catch (error) {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_MESSAGES_FROM_CHAT, EOperationStatus.ERROR,
                new BaseOperationStatusDetail(error.toString())).toPlainObject());
            throw error;
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_MESSAGES_FROM_CHAT, EOperationStatus.IDLE).toPlainObject());
        }
    }
    
    async updateChatMessageStatus(chatId: number, chatMessageStatus: EChatMessageStatus): Promise<void> {
        this.dispatch(new ChatActionUpdateChatMessageStatus(chatId, chatMessageStatus).toPlainObject());
    }
}
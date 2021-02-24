import { Message } from "./MessageModel";

export enum EChatMessageStatus {
    NOT_FETCHED = 'NOT_FETCHED',
    FETCHED = 'FETCHED',
    FETCHING = 'FETCHING',
}

export class Chat {
    constructor(
        public id: number,
        public latestMessageContent: string,
        public latestMessageSentTime: Date,
        public participantsId: number[],
        public messages: Message[],
        public chatMessageStatus: EChatMessageStatus,
    ){

    }
}
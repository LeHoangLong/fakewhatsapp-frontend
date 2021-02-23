export class Chat {
    constructor(
        public id: number,
        public latestMessageContent: string,
        public latestMessageSentTime: Date,
        public participantsId: number[],
    ){

    }
}
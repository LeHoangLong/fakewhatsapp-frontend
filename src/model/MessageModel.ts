export class Message {
    senderId: number;
    senderName: string;
    message: string;
    sentTime: Date;
    constructor(senderId: number, senderName: string, message: string, sentTime: Date) {
        this.senderName = senderName;
        this.senderId = senderId;
        this.message = message;
        this.sentTime = sentTime;
    }
}
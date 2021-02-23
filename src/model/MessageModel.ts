export enum EMessageStatus {
    SENDING = 'SENDING',
    SENT = 'SENT',
}

export class Message {
    constructor(
        public id: number | null,
        public senderId: number, 
        public senderName: string, 
        public message: string, 
        public sentTime: Date,
        public status: EMessageStatus,
        public token: string | null = null,
    ) {
    }
}
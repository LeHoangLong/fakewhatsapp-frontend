export enum OperationStatus {
    INIT,
    IN_PROGRESS,
    SUCCESS,
    ERROR,
    IDLE,
}

export class OperationState {
    readonly status: OperationStatus;
    readonly detail: any;
    constructor(status: OperationStatus, detail: any = null) {
        this.status = status;
        this.detail = detail;
    }
}

export const initialOperationState = new OperationState(OperationStatus.INIT);
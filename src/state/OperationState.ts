export enum OperationStatus {
    INIT = "INIT",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    IDLE = "IDLE",
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
export enum EOperationType {
    GET_USER_INFO = "GET_USER_INFO",
    LOG_IN = "LOG_IN",
    SIGN_UP = "SIGN_UP",
    FETCH_FRIENDS = 'FETCH_FRIENDS',
    FIND_USER = 'FIND_USER',
    FETCH_INVITATION = 'FETCH_INVITATION',
    SEND_INVITATION = 'SEND_INVITATION',
    DELETE_INVITATION = 'DELETE_INVITATION',
    ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

export enum EOperationStatus {
    INIT = "INIT",
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    IDLE = "IDLE",
}

export class BaseOperationStatusDetail {
    description: string;
    constructor(description: string = "") { 
        this.description = description;
    }
}

export class OperationStatus {
    readonly status: EOperationStatus;
    readonly detail: BaseOperationStatusDetail;
    constructor(status: EOperationStatus, detail: BaseOperationStatusDetail = new BaseOperationStatusDetail()) {
        this.status = status;
        this.detail = detail;
    }
}

export const initialOperationStatus = new OperationStatus(EOperationStatus.INIT);

export interface OperationStatusState {
    readonly [EOperationType.GET_USER_INFO]: OperationStatus;
    readonly [EOperationType.LOG_IN]: OperationStatus;
    readonly [EOperationType.SIGN_UP]: OperationStatus;
    readonly [EOperationType.FETCH_FRIENDS]: OperationStatus;
    readonly [EOperationType.FIND_USER]: OperationStatus;
    readonly [EOperationType.FETCH_INVITATION]: OperationStatus;
    readonly [EOperationType.SEND_INVITATION]: OperationStatus; 
    readonly [EOperationType.DELETE_INVITATION]: OperationStatus;
    readonly [EOperationType.ACCEPT_INVITATION]: OperationStatus;
}

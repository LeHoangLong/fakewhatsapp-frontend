export enum EOperationType {
    GET_USER_INFO,
    LOG_IN
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

export class OperationStatusState {
    readonly getUserInfoStatus: OperationStatus;
    readonly loginStatus: OperationStatus;

    constructor(getUserInfoStatus: OperationStatus, loginStatus: OperationStatus) {
        this.getUserInfoStatus = getUserInfoStatus;
        this.loginStatus = loginStatus;
    }
}

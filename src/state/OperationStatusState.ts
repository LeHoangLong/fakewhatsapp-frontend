export enum EOperationType {
    GET_USER_INFO = "GET_USER_INFO",
    LOG_IN = "LOG_IN",
    SIGN_UP = "SIGN_UP",
    FETCH_FRIENDS = 'FETCH_FRIENDS',
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
    readonly signupStatus: OperationStatus;
    readonly redirectStatus: OperationStatus;
    readonly fetchFriendsStatus: OperationStatus;

    constructor(
        getUserInfoStatus: OperationStatus, 
        loginStatus: OperationStatus, 
        signupStatus: OperationStatus, 
        redirectStatus: OperationStatus,
        fetchFriendsStatus: OperationStatus,
    ) {
        this.getUserInfoStatus = getUserInfoStatus;
        this.loginStatus = loginStatus;
        this.signupStatus = signupStatus;
        this.redirectStatus = redirectStatus;
        this.fetchFriendsStatus = fetchFriendsStatus;
    }
}

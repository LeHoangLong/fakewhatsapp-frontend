import { OperationState, OperationStatus } from "../state/OperationState";
import { BaseAction } from "./BaseActions";

export enum EUserActionTypes {
    eSetOperationStatus = "eUserActionTypesSetOperationStatus",
}

export class UserSetOperationStatusAction extends BaseAction {
    readonly operationState: OperationState;
    constructor(status: OperationStatus, detail?: any) {
        super(EUserActionTypes.eSetOperationStatus);
        this.operationState = new OperationState(status, detail);
    }
}
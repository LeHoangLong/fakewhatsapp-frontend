import { EOperationType, EOperationStatus, OperationStatus, BaseOperationStatusDetail } from "../state/OperationStatusState";
import { BaseAction } from "./BaseActions";

export const EOperationStatusActionTypes = {
    SET_OPERATION_STATUS: Symbol("SET_OPERATION_STATUS"),
}

export class OperationStatusActionSetStatus extends BaseAction {
    readonly operationType: EOperationType;
    readonly operationState: OperationStatus;
    constructor(operationType: EOperationType, operationStatus: EOperationStatus, detail: BaseOperationStatusDetail = new BaseOperationStatusDetail()) {
        super(EOperationStatusActionTypes.SET_OPERATION_STATUS);
        this.operationType = operationType;
        this.operationState = new OperationStatus(operationStatus, detail);
    }
}

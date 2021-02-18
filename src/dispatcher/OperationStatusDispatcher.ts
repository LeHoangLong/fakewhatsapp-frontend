import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";

export class OperationStatusDispatcher {
    dispatch: Dispatch<BaseAction>;
    constructor(dispatch: Dispatch<BaseAction>) {
        this.dispatch = dispatch;
    } 

    async setOperationStatus(operationType: EOperationType, operationStatus: EOperationStatus, detail?: BaseOperationStatusDetail) {
        this.dispatch(new OperationStatusActionSetStatus(operationType, operationStatus, detail).toPlainObject());
    }
}
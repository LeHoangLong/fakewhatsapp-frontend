import { BaseAction } from "../actions/BaseActions";
import { EOperationType, initialOperationStatus, OperationStatusState } from "../state/OperationStatusState";
import { EOperationStatusActionTypes, OperationStatusActionSetStatus } from '../actions/OperationStatusActions';
const update = require('update-immutable').default;

export const initialOperationStatusState: OperationStatusState = {
    [EOperationType.GET_USER_INFO]: initialOperationStatus,
    [EOperationType.LOG_IN]: initialOperationStatus,
    [EOperationType.SIGN_UP]: initialOperationStatus,
    [EOperationType.FETCH_FRIENDS]: initialOperationStatus,
    [EOperationType.FIND_USER]: initialOperationStatus,
    [EOperationType.FETCH_INVITATION]: initialOperationStatus,
    [EOperationType.SEND_INVITATION]: initialOperationStatus,
};

export function operationStatusReducer(state: OperationStatusState, action: BaseAction): OperationStatusState {
    switch (action.type) {
        case EOperationStatusActionTypes.SET_OPERATION_STATUS:
            let operationStatusAction: OperationStatusActionSetStatus = action as OperationStatusActionSetStatus;
            if (operationStatusAction.operationType in EOperationType) {
                return update(state, {
                    [operationStatusAction.operationType]: {
                        $set: operationStatusAction.operationState,
                    }
                });
            } else {
                return state;
            }
        default:
            return state;
    }
}
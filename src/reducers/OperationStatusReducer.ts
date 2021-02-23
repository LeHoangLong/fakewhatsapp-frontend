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
    [EOperationType.DELETE_INVITATION]: initialOperationStatus,
    [EOperationType.ACCEPT_INVITATION]: initialOperationStatus,
    [EOperationType.FETCH_CHAT]: initialOperationStatus,
    [EOperationType.FETCH_CHAT_TO_USER]: initialOperationStatus,
    [EOperationType.CREATE_CHAT_TO_USER]: initialOperationStatus,
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
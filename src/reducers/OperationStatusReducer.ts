import { BaseAction } from "../actions/BaseActions";
import { EOperationType, initialOperationStatus, OperationStatusState } from "../state/OperationStatusState";
import { EOperationStatusActionTypes, OperationStatusActionSetStatus } from '../actions/OperationStatusActions';

export const initialOperationStatusState = new OperationStatusState(
    initialOperationStatus,
    initialOperationStatus,
    initialOperationStatus,
    initialOperationStatus,
);

export function operationStatusReducer(state: OperationStatusState, action: BaseAction): OperationStatusState {
    switch (action.type) {
        case EOperationStatusActionTypes.SET_OPERATION_STATUS:
            let operationStatusAction: OperationStatusActionSetStatus = action as OperationStatusActionSetStatus;
            switch (operationStatusAction.operationType) {
                case EOperationType.GET_USER_INFO:
                    return new OperationStatusState(
                        operationStatusAction.operationState,
                        state.loginStatus,
                        state.signupStatus,
                        state.redirectStatus,
                    )
                case EOperationType.LOG_IN:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        operationStatusAction.operationState,
                        state.signupStatus,
                        state.redirectStatus,
                    )
                case EOperationType.SIGN_UP:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        state.loginStatus,
                        operationStatusAction.operationState,
                        state.redirectStatus,
                    )
                default:
                    return state;
            }
        default:
            return state;
    }
}
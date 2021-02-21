import { BaseAction } from "../actions/BaseActions";
import { EOperationType, initialOperationStatus, OperationStatusState } from "../state/OperationStatusState";
import { EOperationStatusActionTypes, OperationStatusActionSetStatus } from '../actions/OperationStatusActions';

export const initialOperationStatusState = new OperationStatusState(
    initialOperationStatus,
    initialOperationStatus,
    initialOperationStatus,
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
                        state.fetchFriendsStatus,
                        state.findUserStatus,
                        state.fetchInvitationStatus,
                    )
                case EOperationType.LOG_IN:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        operationStatusAction.operationState,
                        state.signupStatus,
                        state.redirectStatus,
                        state.fetchFriendsStatus,
                        state.findUserStatus,
                        state.fetchInvitationStatus,
                    )
                case EOperationType.SIGN_UP:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        state.loginStatus,
                        operationStatusAction.operationState,
                        state.redirectStatus,
                        state.fetchFriendsStatus,
                        state.findUserStatus,
                        state.fetchInvitationStatus,
                    )
                case EOperationType.FETCH_FRIENDS:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        state.loginStatus,
                        state.signupStatus,
                        state.redirectStatus,
                        operationStatusAction.operationState,
                        state.findUserStatus,
                        state.fetchInvitationStatus,
                    )
                case EOperationType.FIND_USER:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        state.loginStatus,
                        state.signupStatus,
                        state.redirectStatus,
                        state.fetchFriendsStatus,
                        operationStatusAction.operationState,
                        state.fetchInvitationStatus,
                    )
                case EOperationType.FETCH_INVITATION:
                    return new OperationStatusState(
                        state.getUserInfoStatus,
                        state.loginStatus,
                        state.signupStatus,
                        state.redirectStatus,
                        state.fetchFriendsStatus,
                        state.findUserStatus,
                        operationStatusAction.operationState,
                    )
                default:
                    return state;
            }
        default:
            return state;
    }
}
import { BaseAction } from "../actions/BaseActions";
import { AppState } from "../state/AppState";
import { initialOperationStatusState, operationStatusReducer } from "./OperationStatusReducer";
import { userReducer, initialUserState } from "./UserReducer";

const initialAppState: AppState = new AppState(
    initialUserState,
    initialOperationStatusState
);

export function rootReducer(state: AppState = initialAppState, action: BaseAction): AppState{
    return new AppState(
        userReducer(state.userState, action), //user state
        operationStatusReducer(state.operationStatusState, action),
    );    
}
import axios from "axios";
import { Dispatch } from "react";
import { BaseAction } from "../actions/BaseActions";
import { InvitationActionAddPendingInvitation, InvitationActionAddSentInvitation } from "../actions/InvitationActions";
import { OperationStatusActionSetStatus } from "../actions/OperationStatusActions";
import { config } from "../config";
import { Invitation } from "../model/InvitationModel";
import { BaseOperationStatusDetail, EOperationStatus, EOperationType } from "../state/OperationStatusState";
import { IInvitationDispatcher } from "./IInvitationDispatcher";

export class InvitationDispatcher implements IInvitationDispatcher {
    constructor(
        public dispatch: Dispatch<BaseAction>
    ) {

    }

    async fetchFriendRequestForUser(currentUserInfoId: number, userInfoId: number): Promise<void> {
        this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_INVITATION, EOperationStatus.IN_PROGRESS).toPlainObject());
        try {
            let result = await axios.get(`${config.BACKEND_URL}/invitations/to-from/${userInfoId}`);
            let resultData = result.data;
            let invitation = new Invitation(
                resultData.createdTime,
                resultData.senderInfoId,
                resultData.recipientInfoId,
            )
            if (invitation.senderInfoId === currentUserInfoId) {
                this.dispatch(new InvitationActionAddSentInvitation(invitation).toPlainObject());
            } else if (invitation.recipientInfoId === currentUserInfoId) {
                this.dispatch(new InvitationActionAddPendingInvitation(invitation).toPlainObject());
            }
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_INVITATION, EOperationStatus.SUCCESS).toPlainObject());
        } catch (error) {
            this.dispatch(
                new OperationStatusActionSetStatus(
                    EOperationType.FETCH_INVITATION, 
                    EOperationStatus.ERROR, 
                    new BaseOperationStatusDetail(error.toString())
                ).toPlainObject()
            );
            if (error.response.status !== 404) {
                throw error;
            }
        } finally {
            this.dispatch(new OperationStatusActionSetStatus(EOperationType.FETCH_INVITATION, EOperationStatus.IDLE).toPlainObject());
        }
    }
}
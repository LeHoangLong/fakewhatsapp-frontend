import { User } from "../model/UserModel";
import './StrangerView.scss';

interface StrangerViewProps {
    user: User
}

export const StrangerView = ({user}: StrangerViewProps) => {
    return (
        <div className="stranger-view">
            <div className="profile-icon">
                { user.name[0].toUpperCase() }
            </div>
            <div className="name">
                { user.name }
            </div>
            <button className="send-friend-request-button">
                Send friend request
            </button>
        </div>
    )
}
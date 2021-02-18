import React from 'react';
import './LoadingIcon.scss';

export interface LoadingIconProps {
    sizePx?: number;
}

export const LoadingIcon = ({ sizePx = 24 }: LoadingIconProps) => {
    return (
        <div className="loading-icon-container">
            <svg height={sizePx} width={sizePx}>
                <circle className="loading-icon" r={ sizePx / 2 - 5 }/>
            </svg>
        </div>
    )
}

import { useState } from "react";
import React from 'react';
import './SearchBar.scss';

interface SearchBarProps {
    onTextChange(text: string): void;
}

export const SearchBar = ({onTextChange}: SearchBarProps) => {
    let [value, setValue] = useState('');

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
        onTextChange(event.target.value);
    }

    return (
        <div className="search-bar">
            <i className="fas fa-search"></i>
            <div className="input-container">
                <input placeholder="Search" type="text" value={value} onChange={onChange}></input>
            </div>
        </div>
    );
}
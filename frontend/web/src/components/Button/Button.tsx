import React from "react";
import './Button.css';

const Button: React.FC<{
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}> = ({ onClick, children, className }) => {
    return (
        <button
            className={`custom-button ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;

import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

export default function ContextMenu({ x, y, options, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Adjust position to stay in viewport
    // (Simplified for now, can be improved later)
    const style = {
        top: y,
        left: x,
    };

    return (
        <div className="context-menu" style={style} ref={menuRef}>
            {options.map((option, index) => (
                <div
                    key={index}
                    className="context-menu-item"
                    onClick={() => {
                        option.onClick();
                        onClose();
                    }}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
}

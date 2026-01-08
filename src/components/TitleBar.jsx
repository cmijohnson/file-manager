import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './TitleBar.css';

export default function TitleBar() {
    // Safe handler in case running outside Electron
    const handleMinimize = () => {
        window.electron?.minimize();
    };

    const handleMaximize = () => {
        window.electron?.maximize();
    };

    const handleClose = () => {
        window.electron?.close();
    };

    return (
        <div className="titlebar">
            <div className="titlebar-drag-region">
                <span className="app-title">File Manager</span>
            </div>
            <div className="window-controls">
                <button className="control-btn minimize" onClick={handleMinimize}>
                    <Minus size={16} />
                </button>
                <button className="control-btn maximize" onClick={handleMaximize}>
                    <Square size={14} />
                </button>
                <button className="control-btn close" onClick={handleClose}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

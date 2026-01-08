import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose, currentTheme, onThemeChange, apiSettings, onApiSettingsChange }) {
    const { t, i18n } = useTranslation();

    if (!isOpen) return null;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const themes = [
        { id: 'win11', label: 'Windows 11' },
        { id: 'winxp', label: 'Windows XP' },
        { id: 'win7', label: 'Windows 7' },
        { id: 'win8', label: 'Windows 8.1' },
        { id: 'win2000', label: 'Windows 2000' },
        { id: 'linux', label: 'Linux (Generic)' },
        { id: 'kali', label: 'Kali Linux' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h2>{t('settings.settings')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="modal-body">
                    <div className="setting-group">
                        <label>{t('settings.language')}</label>
                        <div className="language-options">
                            <button
                                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                                onClick={() => changeLanguage('en')}
                            >
                                English
                            </button>
                            <button
                                className={`lang-btn ${i18n.language === 'zh' ? 'active' : ''}`}
                                onClick={() => changeLanguage('zh')}
                            >
                                中文
                            </button>
                        </div>
                    </div>

                    <div className="setting-group">
                        <label>{t('settings.theme')}</label>
                        <div className="theme-grid">
                            {themes.map(theme => (
                                <button
                                    key={theme.id}
                                    className={`theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
                                    onClick={() => onThemeChange(theme.id)}
                                >
                                    {theme.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group">
                        <label>{t('settings.aiSettings')}</label>
                        <div className="setting-row">
                            <label className="sub-label">{t('settings.geminiKey')}</label>
                            <input
                                type="password"
                                className="setting-input"
                                value={apiSettings?.geminiKey || ''}
                                onChange={(e) => onApiSettingsChange(prev => ({ ...prev, geminiKey: e.target.value }))}
                                placeholder="sk-..."
                            />
                        </div>
                        <div className="setting-row">
                            <label className="sub-label">{t('settings.deepseekKey')}</label>
                            <input
                                type="password"
                                className="setting-input"
                                value={apiSettings?.deepseekKey || ''}
                                onChange={(e) => onApiSettingsChange(prev => ({ ...prev, deepseekKey: e.target.value }))}
                                placeholder="sk-..."
                            />
                        </div>
                        <div className="setting-row">
                            <label className="sub-label">{t('settings.defaultProvider')}</label>
                            <select
                                className="setting-select"
                                value={apiSettings?.defaultProvider || 'gemini'}
                                onChange={(e) => onApiSettingsChange(prev => ({ ...prev, defaultProvider: e.target.value }))}
                            >
                                <option value="gemini">Gemini</option>
                                <option value="deepseek">DeepSeek</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

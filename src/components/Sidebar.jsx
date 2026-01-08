import React from 'react';
import { Home, Folder, Gamepad2, Settings, Plus, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

export default function Sidebar({ categories, activeCategory, onSelectCategory, onOpenSettings, onAddCategory, onCategoryContextMenu }) {
    const { t } = useTranslation();

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'home': return <Home size={18} />;
            case 'games': return <Gamepad2 size={18} />;
            case 'bot': return <Bot size={18} />;
            default: return <Folder size={18} />;
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                        onContextMenu={(e) => onCategoryContextMenu && onCategoryContextMenu(e, cat)}
                    >
                        <span className="nav-icon">{getIcon(cat.icon)}</span>
                        <span className="nav-label">{cat.label || cat.name}</span>
                    </button>
                ))}
            </div>

            <div className="sidebar-footer">
                <button className="nav-item" onClick={onAddCategory}>
                    <span className="nav-icon"><Plus size={18} /></span>
                    <span className="nav-label">{t('sidebar.categories')} +</span>
                </button>

                <button className="nav-item" onClick={onOpenSettings}>
                    <span className="nav-icon"><Settings size={18} /></span>
                    <span className="nav-label">{t('sidebar.settings')}</span>
                </button>
            </div>
        </div >
    );
}

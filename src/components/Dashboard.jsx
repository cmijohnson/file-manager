import React from 'react';
import { Plus, File, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

export default function Dashboard({ category, items, onAddItem, onContextMenu, onLaunchItem, onDrop, onDragOver, searchQuery, onSearchChange }) {
    const { t } = useTranslation();

    return (
        <div
            className="dashboard"
            onContextMenu={(e) => onContextMenu(e, 'background')}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <header className="dashboard-header">
                <h1 className="category-title">{category?.label || category?.name || 'Dashboard'}</h1>
                <button className="add-btn" onClick={onAddItem}>
                    <Plus size={16} style={{ marginRight: 6 }} />
                    {t('dashboard.addItem')}
                </button>
            </header>

            {/* Search Box */}
            <div className="search-container">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder={t('dashboard.search')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="items-grid">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="item-card"
                        onClick={() => onLaunchItem?.(item)}
                        onContextMenu={(e) => {
                            e.stopPropagation();
                            onContextMenu(e, 'item', item);
                        }}
                    >
                        <div className="item-icon">
                            {item.iconData ? (
                                <img src={item.iconData} alt={item.name} style={{ width: '48px', height: '48px' }} />
                            ) : (
                                <File size={48} strokeWidth={1.5} />
                            )}
                        </div>
                        <span className="item-name">{item.name}</span>
                    </div>
                ))}

                {/* Empty state if no items */}
                {items.length === 0 && (
                    <div className="empty-state">
                        <p>{t('dashboard.noItems')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

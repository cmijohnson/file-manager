import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AddCategoryModal.css';

export default function RenameItemModal({ isOpen, onClose, onRename, currentName }) {
    const { t } = useTranslation();
    const [itemName, setItemName] = useState('');

    useEffect(() => {
        if (isOpen && currentName) {
            setItemName(currentName);
        }
    }, [isOpen, currentName]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (itemName.trim() && itemName !== currentName) {
            onRename(itemName.trim());
            setItemName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-category-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{t('item.renameItem')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="itemName">{t('item.displayName')}</label>
                        <input
                            id="itemName"
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder={t('item.placeholder')}
                            autoFocus
                        />
                        <small style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                            {t('item.renameHint')}
                        </small>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="btn-primary">
                            {t('common.rename')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

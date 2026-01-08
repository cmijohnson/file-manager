import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AddCategoryModal.css';

export default function RenameCategoryModal({ isOpen, onClose, onRename, currentName }) {
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        if (isOpen && currentName) {
            setCategoryName(currentName);
        }
    }, [isOpen, currentName]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (categoryName.trim() && categoryName !== currentName) {
            onRename(categoryName.trim());
            setCategoryName('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-category-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{t('category.renameCategory')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="categoryName">{t('category.name')}</label>
                        <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder={t('category.placeholder')}
                            autoFocus
                        />
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

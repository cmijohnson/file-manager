import React from 'react';
import { X, File, Folder, Calendar, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './AddCategoryModal.css';

export default function PropertiesModal({ isOpen, onClose, item }) {
    const { t } = useTranslation();

    if (!isOpen || !item) return null;

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content properties-modal" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{t('item.properties')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </header>

                <div className="modal-body properties-body">
                    <div className="properties-icon">
                        {item.isFolder ? <Folder size={48} /> : <File size={48} />}
                    </div>

                    <div className="properties-info">
                        <div className="property-row">
                            <span className="property-label">{t('item.name')}:</span>
                            <span className="property-value">{item.name}</span>
                        </div>

                        <div className="property-row">
                            <span className="property-label">{t('item.type')}:</span>
                            <span className="property-value">{item.isFolder ? t('item.folder') : t('item.file')}</span>
                        </div>

                        <div className="property-row">
                            <span className="property-label">{t('item.path')}:</span>
                            <span className="property-value" style={{ wordBreak: 'break-all' }}>{item.path}</span>
                        </div>

                        {item.size && (
                            <div className="property-row">
                                <span className="property-label">{t('item.size')}:</span>
                                <span className="property-value">{formatFileSize(item.size)}</span>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn-primary" onClick={onClose}>
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

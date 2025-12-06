import { useState } from 'react';
import { useTechnologies } from '../contexts/TechnologyContext';
import './BulkStatusEditor.css';

function BulkStatusEditor({ onClose }) {
    const { technologies, updateTechnologyStatus } = useTechnologies();
    const [selectedTechs, setSelectedTechs] = useState(new Set());
    const [newStatus, setNewStatus] = useState('not-started');
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const statusOptions = [
        { value: 'not-started', label: 'Не начато' },
        { value: 'in-progress', label: 'В процессе' },
        { value: 'completed', label: 'Изучено' }
    ];

    const handleTechSelect = (techId) => {
        const newSelected = new Set(selectedTechs);
        if (newSelected.has(techId)) {
            newSelected.delete(techId);
        } else {
            newSelected.add(techId);
        }
        setSelectedTechs(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedTechs.size === technologies.length) {
            setSelectedTechs(new Set());
        } else {
            setSelectedTechs(new Set(technologies.map(tech => tech.id)));
        }
    };

    const handleBulkUpdate = async () => {
        if (selectedTechs.size === 0) {
            setStatusMessage('Выберите хотя бы одну технологию');
            return;
        }

        try {
            setIsUpdating(true);
            setStatusMessage('');

            // Update all selected technologies
            const updatePromises = Array.from(selectedTechs).map(techId =>
                updateTechnologyStatus(techId, newStatus)
            );

            await Promise.all(updatePromises);

            setStatusMessage(`✅ Статус обновлен для ${selectedTechs.size} технологий`);
            setSelectedTechs(new Set());

            // Auto-close after success
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            setStatusMessage('❌ Ошибка при обновлении статусов');
            console.error('Bulk update error:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'in-progress': return '🔄';
            case 'not-started': return '⏳';
            default: return '❓';
        }
    };

    return (
        <div className="bulk-editor-overlay" role="dialog" aria-labelledby="bulk-editor-title">
            <div className="bulk-editor-modal">
                <div className="bulk-editor-header">
                    <h2 id="bulk-editor-title">Массовое редактирование статусов</h2>
                    <button
                        onClick={onClose}
                        className="close-button"
                        aria-label="Закрыть"
                    >
                        ✕
                    </button>
                </div>

                <div className="bulk-editor-content">
                    {/* Status selection */}
                    <div className="status-selection">
                        <label htmlFor="status-select">Выберите новый статус:</label>
                        <select
                            id="status-select"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="status-select"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {getStatusIcon(option.value)} {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Technology selection */}
                    <div className="tech-selection">
                        <div className="selection-header">
                            <h3>Выберите технологии ({selectedTechs.size} из {technologies.length})</h3>
                            <button
                                onClick={handleSelectAll}
                                className="select-all-btn"
                                aria-label={selectedTechs.size === technologies.length ? 'Снять выделение со всех' : 'Выбрать все'}
                            >
                                {selectedTechs.size === technologies.length ? 'Снять все' : 'Выбрать все'}
                            </button>
                        </div>

                        <div className="tech-list" role="group" aria-label="Список технологий">
                            {technologies.map(tech => (
                                <div key={tech.id} className="tech-item">
                                    <label className="tech-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedTechs.has(tech.id)}
                                            onChange={() => handleTechSelect(tech.id)}
                                            className="tech-checkbox"
                                            aria-describedby={`tech-status-${tech.id}`}
                                        />
                                        <span className="tech-info">
                                            <span className="tech-name">{tech.title}</span>
                                            <span
                                                id={`tech-status-${tech.id}`}
                                                className={`tech-status status-${tech.status}`}
                                            >
                                                {getStatusIcon(tech.status)} {tech.status === 'completed' ? 'Изучено' :
                                                  tech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status message */}
                    {statusMessage && (
                        <div
                            className={`status-message ${statusMessage.includes('✅') ? 'success' : 'error'}`}
                            role="status"
                            aria-live="polite"
                        >
                            {statusMessage}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="bulk-editor-actions">
                        <button
                            onClick={handleBulkUpdate}
                            disabled={isUpdating || selectedTechs.size === 0}
                            className="apply-btn"
                            aria-busy={isUpdating}
                        >
                            {isUpdating ? 'Обновление...' : `Применить к ${selectedTechs.size} технологиям`}
                        </button>
                        <button
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={isUpdating}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BulkStatusEditor;
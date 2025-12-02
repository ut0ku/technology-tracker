import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './Settings.css';

function Settings() {
    const [technologies, setTechnologies] = useState([]);
    const [settings, setSettings] = useState({
        exportFormat: 'json'
    });
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            setTechnologies(JSON.parse(saved));
        }
        
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const handleExportData = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies,
            settings: settings
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = () => {
        try {
            const parsedData = JSON.parse(importData);
            if (parsedData.technologies) {
                localStorage.setItem('technologies', JSON.stringify(parsedData.technologies));
                
                if (parsedData.settings) {
                    localStorage.setItem('appSettings', JSON.stringify(parsedData.settings));
                }
                
                alert('✅ Данные успешно импортированы!');
                setShowImportModal(false);
                setImportData('');
                window.location.reload();
            } else {
                alert('❌ Некорректный формат данных');
            }
        } catch (error) {
            alert('❌ Ошибка при импорте данных: ' + error.message);
        }
    };

    const handleResetData = () => {
        // Удаляем ВСЕ данные приложения
        localStorage.removeItem('technologies');
        localStorage.removeItem('appSettings');
        
        alert('✅ Все данные приложения сброшены!');
        setShowResetModal(false);
        
        // Перенаправляем на главную страницу
        navigate('/', { replace: true });
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>⚙️ Настройки приложения</h1>
                <button onClick={() => navigate('/')} className="btn btn-primary back-btn">
                    ← На главную
                </button>
            </div>

            <div className="settings-container">
                <div className="settings-section">
                    <h2>Управление данными</h2>
                    <div className="data-management">
                        <button onClick={handleExportData} className="btn btn-success">
                            📤 Экспорт всех данных
                        </button>
                        <button onClick={() => setShowImportModal(true)} className="btn btn-info">
                            📥 Импорт данных
                        </button>
                        <button onClick={() => setShowResetModal(true)} className="btn btn-warning">
                            🗑️ Сбросить все данные
                        </button>
                    </div>
                    <div className="data-info">
                        <p>Всего технологий в базе: <strong>{technologies.length}</strong></p>
                        <p>Изучено: <strong>{technologies.filter(t => t.status === 'completed').length}</strong></p>
                        <p>В процессе: <strong>{technologies.filter(t => t.status === 'in-progress').length}</strong></p>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Экспорт данных</h2>
                    <div className="setting-item">
                        <label>Формат экспорта:</label>
                        <select 
                            value={settings.exportFormat}
                            onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="txt">Текстовый файл</option>
                        </select>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Импорт данных"
            >
                <div className="import-modal-content">
                    <p>Вставьте JSON-данные для импорта:</p>
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='{"technologies": [...]}'
                        rows="10"
                        className="import-textarea"
                    />
                    <div className="modal-actions">
                        <button onClick={handleImportData} className="btn btn-success">
                            Импортировать
                        </button>
                        <button onClick={() => setShowImportModal(false)} className="btn btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Сброс всех данных"
            >
                <div className="reset-modal-content">
                    <p>⚠️ Внимание!</p>
                    <p>Вы собираетесь удалить ВСЕ данные приложения:</p>
                    <ul>
                        <li>Все технологии ({technologies.length} записей)</li>
                        <li>Все заметки и статусы</li>
                        <li>Все настройки приложения</li>
                    </ul>
                    <p className="warning-note">
                        🔄 После сброса вы будете перенаправлены на главную страницу.
                    </p>
                    <p>Это действие нельзя отменить!</p>
                    <div className="modal-actions">
                        <button onClick={handleResetData} className="btn btn-danger">
                            Да, сбросить все
                        </button>
                        <button onClick={() => setShowResetModal(false)} className="btn btn-secondary">
                            Отмена
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Settings;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologyContext';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const { addTechnology } = useTechnologies();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'database', label: 'База данных' },
        { value: 'devops', label: 'DevOps' },
        { value: 'other', label: 'Другое' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await addTechnology({
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category,
                difficulty: 'beginner', // По умолчанию
                status: 'not-started',
                notes: '',
                resources: []
            });

            alert('✅ Технология успешно добавлена!');
            navigate('/technologies');

        } catch (err) {
            setError('Ошибка при добавлении технологии: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-technology-page">
            <div className="page-header">
                <h1>➕ Добавить технологию</h1>
                <button onClick={() => navigate('/technologies')} className="btn btn-primary back-btn">
                    ← К технологиям
                </button>
            </div>

            <div className="add-technology-container">
                <form onSubmit={handleSubmit} className="add-technology-form">
                    <div className="form-group">
                        <label htmlFor="title">Название технологии *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Например: React, Node.js, PostgreSQL"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Опишите, что это за технология и для чего она используется..."
                            rows="4"
                            required
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Категория</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-success submit-btn"
                        >
                            {loading ? 'Добавление...' : '➕ Добавить технологию'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/technologies')}
                            className="btn btn-secondary cancel-btn"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTechnology;
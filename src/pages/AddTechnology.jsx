import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologyContext';
import './AddTechnology.css';

function AddTechnology() {
    const navigate = useNavigate();
    const { addTechnology } = useTechnologies();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        deadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const categories = [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'database', label: 'База данных' },
        { value: 'devops', label: 'DevOps' },
        { value: 'other', label: 'Другое' }
    ];

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Validate title
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }

        // Validate description
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }

        // Validate deadline (not in the past)
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    // Real-time validation
    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isFormValid) {
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
                    resources: [],
                    deadline: formData.deadline || undefined
                });

                alert('✅ Технология успешно добавлена!');
                navigate('/technologies');

            } catch (err) {
                setError('Ошибка при добавлении технологии: ' + err.message);
            } finally {
                setLoading(false);
            }
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
                        <label htmlFor="title">
                            Название технологии <span aria-label="обязательное поле">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Например: React, Node.js, PostgreSQL"
                            className={errors.title ? 'error' : 'form-input'}
                            aria-required="true"
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? 'title-error' : undefined}
                        />
                        {errors.title && (
                            <span id="title-error" className="error-message" role="alert">
                                {errors.title}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Описание <span aria-label="обязательное поле">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Опишите, что это за технология и для чего она используется..."
                            rows="4"
                            className={errors.description ? 'error' : 'form-textarea'}
                            aria-required="true"
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                        {errors.description && (
                            <span id="description-error" className="error-message" role="alert">
                                {errors.description}
                            </span>
                        )}
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

                    <div className="form-group">
                        <label htmlFor="deadline">Дедлайн (необязательно)</label>
                        <input
                            id="deadline"
                            name="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className={errors.deadline ? 'error' : ''}
                            aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                        />
                        {errors.deadline && (
                            <span id="deadline-error" className="error-message" role="alert">
                                {errors.deadline}
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
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
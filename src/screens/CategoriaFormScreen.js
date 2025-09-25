import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function CategoriaFormScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        tipo: 'DESPESA',
    });
    const [loading, setLoading] = useState(false);

    const tipos = ['RECEITA', 'DESPESA'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome) {
            alert('Preencha o nome da categoria');
            return;
        }

        try {
            setLoading(true);
            await ApiService.createCategoria(formData);
            alert('Categoria criada com sucesso');
            navigate('/categorias');
        } catch (error) {
            alert('Erro ao criar categoria');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Nova Categoria</h1>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                            placeholder="Ex: Alimentação"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo *</label>
                        <div className="form-select">
                            {tipos.map((tipo) => (
                                <div
                                    key={tipo}
                                    className={`select-option ${formData.tipo === tipo ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, tipo}))}
                                >
                                    {tipo === 'RECEITA' ? '💰' : '💸'} {tipo}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/categorias')}
                            className="btn"
                            style={{ backgroundColor: '#ccc', color: '#333' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar Categoria'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
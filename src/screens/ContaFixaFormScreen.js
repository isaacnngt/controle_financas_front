import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function ContaFixaFormScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        valorEstimado: '',
        diaVencimento: '1',
        recorrente: true,
        idCategoria: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            const data = await ApiService.getCategorias();
            setCategorias(data.filter(cat => cat.tipo === 'DESPESA'));
        } catch (error) {
            alert('Erro ao carregar categorias');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.valorEstimado || !formData.idCategoria) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const dia = parseInt(formData.diaVencimento);
        if (dia < 1 || dia > 31) {
            alert('Dia de vencimento deve estar entre 1 e 31');
            return;
        }

        try {
            setLoading(true);

            const submitData = {
                ...formData,
                valorEstimado: parseFloat(formData.valorEstimado),
                diaVencimento: dia,
            };

            await ApiService.createContaFixa(submitData);
            alert('Conta fixa criada com sucesso');
            navigate('/contas-fixas');
        } catch (error) {
            alert('Erro ao criar conta fixa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Nova Conta Fixa</h1>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                            placeholder="Ex: Energia Elétrica"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Valor Estimado *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.valorEstimado}
                            onChange={(e) => setFormData(prev => ({...prev, valorEstimado: e.target.value}))}
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Dia do Vencimento *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.diaVencimento}
                            onChange={(e) => setFormData(prev => ({...prev, diaVencimento: e.target.value}))}
                            min="1"
                            max="31"
                        />
                    </div>

                    <div className="switch-container">
                        <label className="form-label">Conta Recorrente?</label>
                        <div
                            className={`switch ${formData.recorrente ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, recorrente: !prev.recorrente}))}
                        >
                            <div className="switch-handle"></div>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', margin: '0.5rem 0 1rem 0' }}>
                        {formData.recorrente
                            ? "🔄 Esta conta será cobrada todos os meses"
                            : "📅 Esta conta é única ou pontual"
                        }
                    </p>

                    <div className="form-group">
                        <label className="form-label">Categoria *</label>
                        <div className="form-select">
                            {categorias.map((categoria) => (
                                <div
                                    key={categoria.idCategoria}
                                    className={`select-option ${formData.idCategoria === categoria.idCategoria ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, idCategoria: categoria.idCategoria}))}
                                >
                                    {categoria.nome}
                                </div>
                            ))}
                        </div>
                    </div>

                    {categorias.length === 0 && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#ffebee',
                            color: '#F44336',
                            borderRadius: '4px',
                            textAlign: 'center',
                            margin: '1rem 0'
                        }}>
                            ⚠️ Nenhuma categoria de despesa encontrada. Crie categorias de despesa primeiro.
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/contas-fixas')}
                            className="btn"
                            style={{ backgroundColor: '#ccc', color: '#333' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`btn ${categorias.length === 0 ? '' : 'btn-primary'}`}
                            disabled={loading || categorias.length === 0}
                            style={categorias.length === 0 ? { backgroundColor: '#ccc' } : {}}
                        >
                            {loading ? 'Salvando...' : 'Salvar Conta Fixa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
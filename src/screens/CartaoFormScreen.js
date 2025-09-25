import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function CartaoFormScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        bandeira: 'MASTERCARD',
        limiteTotal: '',
        diaVencimento: '1',
        melhorDiaCompra: '1',
        finalCartao: '',
        ativo: true,
        idCategoria: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);

    const bandeiras = ['VISA', 'MASTERCARD', 'ELO', 'AMEX'];

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            const data = await ApiService.getCategorias();
            setCategorias(data);
        } catch (error) {
            alert('Erro ao carregar categorias');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.limiteTotal || !formData.idCategoria || !formData.finalCartao) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        if (formData.finalCartao.length !== 4) {
            alert('Final do cartão deve ter 4 dígitos');
            return;
        }

        try {
            setLoading(true);

            const submitData = {
                ...formData,
                limiteTotal: parseFloat(formData.limiteTotal),
                diaVencimento: parseInt(formData.diaVencimento),
                melhorDiaCompra: parseInt(formData.melhorDiaCompra),
            };

            await ApiService.createCartao(submitData);
            alert('Cartão criado com sucesso');
            navigate('/cartoes');
        } catch (error) {
            alert('Erro ao criar cartão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Novo Cartão</h1>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                            placeholder="Ex: Nubank Ultravioleta"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Final do Cartão (4 dígitos) *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.finalCartao}
                            onChange={(e) => setFormData(prev => ({...prev, finalCartao: e.target.value}))}
                            placeholder="1234"
                            maxLength="4"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Limite Total *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.limiteTotal}
                            onChange={(e) => setFormData(prev => ({...prev, limiteTotal: e.target.value}))}
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                        <div className="form-group">
                            <label className="form-label">Melhor Dia para Compras *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.melhorDiaCompra}
                                onChange={(e) => setFormData(prev => ({...prev, melhorDiaCompra: e.target.value}))}
                                min="1"
                                max="31"
                            />
                        </div>
                    </div>

                    <div className="switch-container">
                        <label className="form-label">Cartão Ativo?</label>
                        <div
                            className={`switch ${formData.ativo ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, ativo: !prev.ativo}))}
                        >
                            <div className="switch-handle"></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bandeira *</label>
                        <div className="form-select">
                            {bandeiras.map((bandeira) => (
                                <div
                                    key={bandeira}
                                    className={`select-option ${formData.bandeira === bandeira ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, bandeira}))}
                                >
                                    {bandeira}
                                </div>
                            ))}
                        </div>
                    </div>

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

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/cartoes')}
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
                            {loading ? 'Salvando...' : 'Salvar Cartão'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

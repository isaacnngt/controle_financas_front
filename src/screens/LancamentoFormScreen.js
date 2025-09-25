import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

export default function LancamentoFormScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        descricao: '',
        valorTotal: '',
        dtLancamento: '',
        dtVencimento: '',
        idCategoria: null,
        pago: false,
        valorPago: '0',
        mesAno: '',
        idCartao: null,
        idContaFixa: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [cartoes, setCartoes] = useState([]);
    const [contasFixas, setContasFixas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
        setMesAnoAtual();
    }, []);

    const loadData = async () => {
        try {
            const [categoriasData, cartoesData, contasData] = await Promise.all([
                ApiService.getCategorias(),
                ApiService.getCartoes(),
                ApiService.getContasFixas()
            ]);

            setCategorias(categoriasData);
            setCartoes(cartoesData.filter(cartao => cartao.ativo));
            setContasFixas(contasData);
        } catch (error) {
            alert('Erro ao carregar dados do formulário');
        }
    };

    const setMesAnoAtual = () => {
        const hoje = new Date();
        const mesAno = hoje.toLocaleDateString('pt-BR', {
            month: '2-digit',
            year: 'numeric'
        }).replace('/', '/');

        const dataFormatada = hoje.toISOString().split('T')[0];

        setFormData(prev => ({
            ...prev,
            mesAno,
            dtLancamento: dataFormatada,
            dtVencimento: dataFormatada,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.descricao || !formData.valorTotal || !formData.idCategoria) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setLoading(true);

            const submitData = {
                ...formData,
                valorTotal: parseFloat(formData.valorTotal),
                valorPago: formData.pago ? parseFloat(formData.valorTotal) : 0,
            };

            // Remove campos opcionais se não foram preenchidos
            if (!submitData.idCartao) delete submitData.idCartao;
            if (!submitData.idContaFixa) delete submitData.idContaFixa;

            await ApiService.createLancamento(submitData);
            alert('Lançamento criado com sucesso');
            navigate('/lancamentos');
        } catch (error) {
            alert('Erro ao criar lançamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">Novo Lançamento</h1>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Descrição *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.descricao}
                            onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
                            placeholder="Ex: Compra supermercado"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Valor *</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.valorTotal}
                            onChange={(e) => setFormData(prev => ({...prev, valorTotal: e.target.value}))}
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Data do Lançamento *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.dtLancamento}
                                onChange={(e) => setFormData(prev => ({...prev, dtLancamento: e.target.value}))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Data de Vencimento *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.dtVencimento}
                                onChange={(e) => setFormData(prev => ({...prev, dtVencimento: e.target.value}))}
                            />
                        </div>
                    </div>

                    <div className="switch-container">
                        <label className="form-label">Já foi pago?</label>
                        <div
                            className={`switch ${formData.pago ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, pago: !prev.pago}))}
                        >
                            <div className="switch-handle"></div>
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
                                    style={{ minWidth: '120px' }}
                                >
                                    <div style={{ fontWeight: 'bold' }}>{categoria.nome}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{categoria.tipo}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Cartão de Crédito (Opcional)</label>
                        <div className="form-select">
                            <div
                                className={`select-option ${formData.idCartao === null ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({...prev, idCartao: null}))}
                            >
                                Nenhum
                            </div>

                            {cartoes.map((cartao) => (
                                <div
                                    key={cartao.idCartao}
                                    className={`select-option ${formData.idCartao === cartao.idCartao ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, idCartao: cartao.idCartao}))}
                                    style={{ minWidth: '120px' }}
                                >
                                    <div style={{ fontWeight: 'bold' }}>{cartao.nome}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>****{cartao.finalCartao}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Conta Fixa (Opcional)</label>
                        <div className="form-select">
                            <div
                                className={`select-option ${formData.idContaFixa === null ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({...prev, idContaFixa: null}))}
                            >
                                Nenhuma
                            </div>

                            {contasFixas.map((conta) => (
                                <div
                                    key={conta.idContaFixa}
                                    className={`select-option ${formData.idContaFixa === conta.idContaFixa ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({...prev, idContaFixa: conta.idContaFixa}))}
                                    style={{ minWidth: '120px' }}
                                >
                                    <div style={{ fontWeight: 'bold' }}>{conta.nome}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Dia {conta.diaVencimento}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/lancamentos')}
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
                            {loading ? 'Salvando...' : 'Salvar Lançamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
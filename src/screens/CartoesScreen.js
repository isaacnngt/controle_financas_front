import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

export default function CartoesScreen() {
    const [cartoes, setCartoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCartoes();
    }, []);

    const loadCartoes = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getCartoes();
            setCartoes(data);
        } catch (error) {
            alert('Erro ao carregar cartões');
        } finally {
            setLoading(false);
        }
    };

    const deleteCartao = async (id) => {
        if (window.confirm('Deseja realmente excluir este cartão?')) {
            try {
                await ApiService.deleteCartao(id);
                loadCartoes();
            } catch (error) {
                alert('Erro ao excluir cartão');
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Cartões</h1>
                <Link to="/cartoes/novo" className="btn btn-primary">+ Novo Cartão</Link>
            </div>

            {cartoes.length === 0 ? (
                <div className="empty-state">Nenhum cartão encontrado</div>
            ) : (
                <div>
                    {cartoes.map((cartao) => (
                        <div key={cartao.idCartao} className="card">
                            <div className="card-header">
                                <h3 className="card-title">{cartao.nome}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                  }}>
                    {cartao.bandeira}
                  </span>
                                    <span style={{ fontSize: '1.2rem' }}>
                    {cartao.ativo ? '✅' : '❌'}
                  </span>
                                </div>
                            </div>

                            <p className="card-content">Final: ****{cartao.finalCartao}</p>
                            <p className="card-content" style={{ color: '#2196F3', fontWeight: 'bold' }}>
                                Limite: {formatCurrency(cartao.limiteTotal)}
                            </p>
                            <p className="card-content">Vencimento: Dia {cartao.diaVencimento}</p>
                            <p className="card-content">Melhor dia compra: Dia {cartao.melhorDiaCompra}</p>

                            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                <button
                                    onClick={() => deleteCartao(cartao.idCartao)}
                                    className="btn btn-danger btn-small"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
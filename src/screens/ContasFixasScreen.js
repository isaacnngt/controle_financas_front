import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

export default function ContasFixasScreen() {
    const [contasFixas, setContasFixas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContasFixas();
    }, []);

    const loadContasFixas = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getContasFixas();
            setContasFixas(data);
        } catch (error) {
            alert('Erro ao carregar contas fixas');
        } finally {
            setLoading(false);
        }
    };

    const deleteContaFixa = async (id) => {
        if (window.confirm('Deseja realmente excluir esta conta fixa?')) {
            try {
                await ApiService.deleteContaFixa(id);
                loadContasFixas();
            } catch (error) {
                alert('Erro ao excluir conta fixa');
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
                <h1 className="page-title" style={{ margin: 0 }}>Contas Fixas</h1>
                <Link to="/contas-fixas/nova" className="btn btn-primary">+ Nova Conta Fixa</Link>
            </div>

            {contasFixas.length === 0 ? (
                <div className="empty-state">Nenhuma conta fixa encontrada</div>
            ) : (
                <div>
                    {contasFixas.map((conta) => (
                        <div key={conta.idContaFixa} className="card">
                            <div className="card-header">
                                <h3 className="card-title">{conta.nome}</h3>
                                <span style={{ fontSize: '1.2rem' }}>
                  {conta.recorrente ? '🔄' : '📅'}
                </span>
                            </div>

                            <p className="card-content">{conta.categoria.nome}</p>
                            <p className="card-content" style={{ color: '#F44336', fontWeight: 'bold' }}>
                                Valor: {formatCurrency(conta.valorEstimado)}
                            </p>
                            <p className="card-content">Vencimento: Dia {conta.diaVencimento}</p>

                            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                <button
                                    onClick={() => deleteContaFixa(conta.idContaFixa)}
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
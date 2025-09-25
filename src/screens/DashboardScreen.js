import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

export default function DashboardScreen() {
    const [resumo, setResumo] = useState(null);
    const [vencidos, setVencidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const mesAtual = new Date().toLocaleDateString('pt-BR', {
                month: '2-digit',
                year: 'numeric'
            }).replace('/', '/');

            const [resumoData, vencidosData] = await Promise.all([
                ApiService.getResumoMensal(mesAtual),
                ApiService.getLancamentosVencidos()
            ]);

            setResumo(resumoData);
            setVencidos(vencidosData);
        } catch (error) {
            alert('Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
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
            <h1 className="page-title">Resumo Financeiro</h1>

            {resumo && (
                <div className="card">
                    <h2 style={{ textAlign: 'center', margin: '0 0 1rem 0' }}>{resumo.mesAno}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Total</p>
                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(resumo.valorTotal)}</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Pago</p>
                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50' }}>{formatCurrency(resumo.valorPago)}</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Pendente</p>
                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#F44336' }}>{formatCurrency(resumo.dividaTotal)}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                        <span>Lançamentos: {resumo.lancamentosPagos}/{resumo.totalLancamentos}</span>
                        <span>% Pago: {resumo.percentualPago.toFixed(1)}%</span>
                    </div>
                </div>
            )}

            {vencidos.length > 0 && (
                <div className="card" style={{ backgroundColor: '#ffebee', border: '1px solid #f44336' }}>
                    <h3 style={{ color: '#d32f2f', margin: '0 0 1rem 0' }}>🚨 Lançamentos Vencidos ({vencidos.length})</h3>
                    {vencidos.map((item) => (
                        <div key={item.idLancamento} style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid #ffcdd2' }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{item.descricao}</p>
                            <p style={{ margin: 0, color: '#d32f2f', fontWeight: 'bold' }}>{formatCurrency(item.valorPendente)}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Venc: {item.dtVencimento}</p>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn btn-primary" onClick={loadDashboardData} style={{ width: '100%' }}>
                🔄 Atualizar
            </button>
        </div>
    );
}
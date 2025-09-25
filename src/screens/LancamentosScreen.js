import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

export default function LancamentosScreen() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLancamentos();
  }, []);

  const loadLancamentos = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLancamentos();
      setLancamentos(data);
    } catch (error) {
      alert('Erro ao carregar lançamentos');
    } finally {
      setLoading(false);
    }
  };

  const marcarComoPago = async (id, valorTotal) => {
    try {
      await ApiService.marcarLancamentoPago(id, valorTotal);
      loadLancamentos();
      alert('Lançamento marcado como pago');
    } catch (error) {
      alert('Erro ao marcar como pago');
    }
  };

  const deleteLancamento = async (id) => {
    if (window.confirm('Deseja realmente excluir este lançamento?')) {
      try {
        await ApiService.deleteLancamento(id);
        loadLancamentos();
      } catch (error) {
        alert('Erro ao excluir lançamento');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Lançamentos</h1>
        <Link to="/lancamentos/novo" className="btn btn-primary">+ Novo Lançamento</Link>
      </div>

      {lancamentos.length === 0 ? (
        <div className="empty-state">Nenhum lançamento encontrado</div>
      ) : (
        <div>
          {lancamentos.map((lancamento) => (
            <div key={lancamento.idLancamento} className="card">
              <div className="card-header">
                <h3 className="card-title">{lancamento.descricao}</h3>
                <span style={{ fontSize: '1.2rem' }}>
                  {lancamento.pago ? '✅' : '⏳'}
                </span>
              </div>

              <p className="card-content">{lancamento.categoria.nome}</p>
              <p className="card-content">Vencimento: {formatDate(lancamento.dtVencimento)}</p>

              {lancamento.cartaoCredito && (
                <p className="card-content" style={{ color: '#2196F3' }}>
                  💳 {lancamento.cartaoCredito.nome}
                </p>
              )}

              {lancamento.contaFixa && (
                <p className="card-content" style={{ color: '#9C27B0' }}>
                  🏠 {lancamento.contaFixa.nome}
                </p>
              )}

              <div style={{ margin: '0.5rem 0' }}>
                <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>
                  Total: {formatCurrency(lancamento.valorTotal)}
                </p>
                {!lancamento.pago && (
                  <p style={{ margin: 0, color: '#F44336', fontWeight: 'bold' }}>
                    Pendente: {formatCurrency(lancamento.valorPendente)}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                {!lancamento.pago && (
                  <button
                    onClick={() => marcarComoPago(lancamento.idLancamento, lancamento.valorTotal)}
                    className="btn btn-success btn-small"
                  >
                    Pagar
                  </button>
                )}
                <button
                  onClick={() => deleteLancamento(lancamento.idLancamento)}
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

export default function CategoriasScreen() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getCategorias();
            setCategorias(data);
        } catch (error) {
            alert('Erro ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    const deleteCategoria = async (id) => {
        if (window.confirm('Deseja realmente excluir esta categoria?')) {
            try {
                await ApiService.deleteCategoria(id);
                loadCategorias();
            } catch (error) {
                alert('Erro ao excluir categoria');
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Categorias</h1>
                <Link to="/categorias/nova" className="btn btn-primary">+ Nova Categoria</Link>
            </div>

            {categorias.length === 0 ? (
                <div className="empty-state">Nenhuma categoria encontrada</div>
            ) : (
                <div>
                    {categorias.map((categoria) => (
                        <div key={categoria.idCategoria} className="card">
                            <div className="card-header">
                                <h3 className="card-title">{categoria.nome}</h3>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    backgroundColor: categoria.tipo === 'RECEITA' ? '#e8f5e8' : '#ffebee',
                                    color: categoria.tipo === 'RECEITA' ? '#4CAF50' : '#F44336'
                                }}>
                  {categoria.tipo === 'RECEITA' ? '💰' : '💸'} {categoria.tipo}
                </span>
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                <button
                                    onClick={() => deleteCategoria(categoria.idCategoria)}
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
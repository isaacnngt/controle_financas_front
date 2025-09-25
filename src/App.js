import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

// Importar telas
import DashboardScreen from './screens/DashboardScreen';
import LancamentosScreen from './screens/LancamentosScreen';
import LancamentoFormScreen from './screens/LancamentoFormScreen';
import ContasFixasScreen from './screens/ContasFixasScreen';
import ContaFixaFormScreen from './screens/ContaFixaFormScreen';
import CartoesScreen from './screens/CartoesScreen';
import CartaoFormScreen from './screens/CartaoFormScreen';
import CategoriasScreen from './screens/CategoriasScreen';
import CategoriaFormScreen from './screens/CategoriaFormScreen';

function App() {
  return (
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="nav-container">
              <h1 className="nav-title">💰 Sistema de Finanças</h1>
              <div className="nav-links">
                <NavLink to="/" className="nav-link">
                  📊 Dashboard
                </NavLink>
                <NavLink to="/lancamentos" className="nav-link">
                  💸 Lançamentos
                </NavLink>
                <NavLink to="/contas-fixas" className="nav-link">
                  🏠 Contas Fixas
                </NavLink>
                <NavLink to="/cartoes" className="nav-link">
                  💳 Cartões
                </NavLink>
                <NavLink to="/categorias" className="nav-link">
                  🏷️ Categorias
                </NavLink>
              </div>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/lancamentos" element={<LancamentosScreen />} />
              <Route path="/lancamentos/novo" element={<LancamentoFormScreen />} />
              <Route path="/contas-fixas" element={<ContasFixasScreen />} />
              <Route path="/contas-fixas/nova" element={<ContaFixaFormScreen />} />
              <Route path="/cartoes" element={<CartoesScreen />} />
              <Route path="/cartoes/novo" element={<CartaoFormScreen />} />
              <Route path="/categorias" element={<CategoriasScreen />} />
              <Route path="/categorias/nova" element={<CategoriaFormScreen />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;
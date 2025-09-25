const API_BASE_URL = 'https://controle-financasback-production.up.railway.app/api';

class ApiService {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Lançamentos
    async getLancamentos() {
        return this.request('/lancamentos');
    }

    async createLancamento(data) {
        return this.request('/lancamentos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateLancamento(id, data) {
        return this.request(`/lancamentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteLancamento(id) {
        return this.request(`/lancamentos/${id}`, {
            method: 'DELETE',
        });
    }

    async marcarLancamentoPago(id, valorPago) {
        return this.request(`/lancamentos/${id}/marcar-pago?valorPago=${valorPago}`, {
            method: 'PATCH',
        });
    }

    async getLancamentosVencidos() {
        return this.request('/lancamentos/vencidos');
    }

    async getResumoMensal(mesAno) {
        return this.request(`/lancamentos/resumo-mensal/${mesAno}`);
    }

    // Contas Fixas
    async getContasFixas() {
        return this.request('/contas-fixas');
    }

    async createContaFixa(data) {
        return this.request('/contas-fixas', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateContaFixa(id, data) {
        return this.request(`/contas-fixas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteContaFixa(id) {
        return this.request(`/contas-fixas/${id}`, {
            method: 'DELETE',
        });
    }

    // Cartões
    async getCartoes() {
        return this.request('/cartoes');
    }

    async createCartao(data) {
        return this.request('/cartoes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCartao(id, data) {
        return this.request(`/cartoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCartao(id) {
        return this.request(`/cartoes/${id}`, {
            method: 'DELETE',
        });
    }

    // Categorias
    async getCategorias() {
        return this.request('/categorias');
    }

    async createCategoria(data) {
        return this.request('/categorias', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCategoria(id, data) {
        return this.request(`/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCategoria(id) {
        return this.request(`/categorias/${id}`, {
            method: 'DELETE',
        });
    }
}

// Crie uma instância nomeada
const apiService = new ApiService();

// Exporte a instância nomeada
export default apiService;
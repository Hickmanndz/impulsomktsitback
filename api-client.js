(function (globalScope) {
    const API_BASE = (() => {
        if (typeof globalScope.location !== 'undefined' && globalScope.location.protocol === 'file:') {
            return 'http://localhost:3000';
        }

        if (typeof globalScope.location !== 'undefined' && globalScope.location.origin) {
            return globalScope.location.origin;
        }

        return 'http://localhost:3000';
    })();

    async function request(path, options = {}) {
        if (typeof globalScope.location !== 'undefined' && globalScope.location.protocol === 'file:') {
            throw new Error('Abra o sistema pelo endereço http://localhost:3000 para acessar sua conta.');
        }

        let response;
        try {
            response = await fetch(`${API_BASE}${path}`, {
                credentials: 'include',
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            });
        } catch (erro) {
            if (erro && erro.name === 'TypeError') {
                throw new Error('Não foi possível conectar ao servidor. Verifique se o sistema está aberto em http://localhost:3000.');
            }
            throw erro;
        }

        const text = await response.text();
        let payload = null;

        try {
            payload = text ? JSON.parse(text) : null;
        } catch (erro) {
            payload = text;
        }

        if (!response.ok) {
            throw new Error((payload && payload.error) || 'Erro na requisição.');
        }

        return payload;
    }

    globalScope.ImpulsoApi = {
        async register(dados) {
            return request('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async login(dados) {
            return request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async logout() {
            return request('/api/auth/logout', {
                method: 'POST'
            });
        },

        async changePassword(dados) {
            return request('/api/auth/change-password', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async updateProfilePhoto(foto) {
            return request('/api/auth/profile-photo', {
                method: 'POST',
                body: JSON.stringify({ foto })
            });
        },

        async updateProfile(dados) {
            return request('/api/auth/profile', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async me() {
            return request('/api/auth/me');
        },

        async getPlans() {
            return request('/api/plans');
        },

        async getPosts() {
            return request('/api/posts');
        },

        async getAdminDashboard() {
            return request('/api/admin/dashboard');
        },

        async getAdminUsers() {
            return request('/api/admin/users');
        },

        async getPaymentConfig() {
            return request('/api/config/payment');
        },

        async createPost(dados) {
            return request('/api/posts', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async createPayment(dados) {
            return request('/api/payments', {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        },

        async confirmPayment(id, dados = {}) {
            return request(`/api/payments/${encodeURIComponent(id)}/confirm`, {
                method: 'POST',
                body: JSON.stringify(dados)
            });
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);

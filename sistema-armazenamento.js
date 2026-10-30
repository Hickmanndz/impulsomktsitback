(function (globalScope) {
    const STORAGE_KEYS = {
        usuarios: 'impulsoUsuarios',
        posts: 'impulsoPosts',
        usuarioLogado: 'impulsoUsuarioLogado',
        pagamentos: 'impulsoPagamentos'
    };

    const storage = globalScope.localStorage;
    const db = globalScope.DB || null;
    const apiBaseUrl = (() => {
        if (typeof globalScope.location !== 'undefined' && globalScope.location.origin) {
            return globalScope.location.origin;
        }

        return 'http://localhost:3000';
    })();
    const usaApiRemota = typeof globalScope.fetch === 'function' && (!globalScope.location || globalScope.location.protocol !== 'file:');

    function normalizarEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    function lerJSON(chave, padrao) {
        if (!storage) {
            return padrao;
        }

        try {
            const valor = storage.getItem(chave);
            return valor === null ? padrao : JSON.parse(valor);
        } catch (erro) {
            console.warn('Erro ao ler storage:', chave, erro);
            return padrao;
        }
    }

    function salvarJSON(chave, valor) {
        if (!storage) {
            return false;
        }

        try {
            storage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (erro) {
            console.warn('Erro ao salvar storage:', chave, erro);
            return false;
        }
    }

    async function carregarViaAPI(chave, padrao) {
        if (!usaApiRemota) {
            return padrao;
        }

        try {
            const resposta = await fetch(`${apiBaseUrl}/api/collections/${encodeURIComponent(chave)}`);
            if (!resposta.ok) {
                return padrao;
            }

            const dados = await resposta.json();
            if (Array.isArray(dados)) {
                salvarJSON(chave, dados);
                return dados;
            }

            return padrao;
        } catch (erro) {
            return padrao;
        }
    }

    async function salvarViaAPI(chave, valor) {
        if (!usaApiRemota) {
            return false;
        }

        try {
            const resposta = await fetch(`${apiBaseUrl}/api/collections/${encodeURIComponent(chave)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valor)
            });

            return resposta.ok;
        } catch (erro) {
            console.warn('Erro ao sincronizar com a API:', chave, erro);
            return false;
        }
    }

    async function carregarSessaoViaAPI(chave, padrao) {
        if (!usaApiRemota) {
            return padrao;
        }

        try {
            const resposta = await fetch(`${apiBaseUrl}/api/session/${encodeURIComponent(chave)}`);
            if (!resposta.ok) {
                return padrao;
            }

            const dados = await resposta.json();
            if (dados !== null) {
                salvarJSON(chave, dados);
            }

            return dados ?? padrao;
        } catch (erro) {
            return padrao;
        }
    }

    async function salvarSessaoViaAPI(chave, valor) {
        if (!usaApiRemota) {
            return false;
        }

        try {
            const resposta = await fetch(`${apiBaseUrl}/api/session/${encodeURIComponent(chave)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valor)
            });

            return resposta.ok;
        } catch (erro) {
            console.warn('Erro ao sincronizar sessão via API:', chave, erro);
            return false;
        }
    }

    const ImpulsoStorage = {
        STORAGE_KEYS,

        getUsers() {
            if (db && db.getCollection) {
                return db.getCollection('usuarios');
            }

            if (usaApiRemota) {
                const local = lerJSON(STORAGE_KEYS.usuarios, []);
                carregarViaAPI(STORAGE_KEYS.usuarios, []).catch(() => {});
                return local;
            }

            return lerJSON(STORAGE_KEYS.usuarios, []);
        },

        saveUsers(usuarios) {
            if (db && db.setCollection) {
                db.setCollection('usuarios', usuarios);
                return true;
            }

            const salvoLocal = salvarJSON(STORAGE_KEYS.usuarios, usuarios);
            salvarViaAPI(STORAGE_KEYS.usuarios, usuarios).catch(() => {});
            return salvoLocal;
        },

        getPosts() {
            if (db && db.getCollection) {
                return db.getCollection('posts');
            }

            if (usaApiRemota) {
                const local = lerJSON(STORAGE_KEYS.posts, []);
                carregarViaAPI(STORAGE_KEYS.posts, []).catch(() => {});
                return local;
            }

            return lerJSON(STORAGE_KEYS.posts, []);
        },

        savePosts(posts) {
            if (db && db.setCollection) {
                db.setCollection('posts', posts);
                return true;
            }

            const salvoLocal = salvarJSON(STORAGE_KEYS.posts, posts);
            salvarViaAPI(STORAGE_KEYS.posts, posts).catch(() => {});
            return salvoLocal;
        },

        getCurrentUser() {
            if (db && db.getUsuarioLogado) {
                return db.getUsuarioLogado();
            }

            if (usaApiRemota) {
                const local = lerJSON(STORAGE_KEYS.usuarioLogado, null);
                carregarSessaoViaAPI(STORAGE_KEYS.usuarioLogado, null).catch(() => {});
                return local;
            }

            return lerJSON(STORAGE_KEYS.usuarioLogado, null);
        },

        getPagamentos() {
            if (db && db.getCollection) {
                return db.getCollection('pagamentos');
            }

            if (usaApiRemota) {
                const local = lerJSON(STORAGE_KEYS.pagamentos, []);
                carregarViaAPI(STORAGE_KEYS.pagamentos, []).catch(() => {});
                return local;
            }

            return lerJSON(STORAGE_KEYS.pagamentos, []);
        },

        savePagamentos(pagamentos) {
            if (db && db.setCollection) {
                db.setCollection('pagamentos', pagamentos);
                return true;
            }

            const salvoLocal = salvarJSON(STORAGE_KEYS.pagamentos, pagamentos);
            salvarViaAPI(STORAGE_KEYS.pagamentos, pagamentos).catch(() => {});
            return salvoLocal;
        },

        setCurrentUser(usuario) {
            if (db && db.setUsuarioLogado) {
                return db.setUsuarioLogado(usuario);
            }

            if (!usuario) {
                if (storage) {
                    storage.removeItem(STORAGE_KEYS.usuarioLogado);
                }
                salvarSessaoViaAPI(STORAGE_KEYS.usuarioLogado, null).catch(() => {});
                return true;
            }

            const salvoLocal = salvarJSON(STORAGE_KEYS.usuarioLogado, usuario);
            salvarSessaoViaAPI(STORAGE_KEYS.usuarioLogado, usuario).catch(() => {});
            return salvoLocal;
        },

        clearCurrentUser() {
            if (!storage) {
                return true;
            }

            storage.removeItem(STORAGE_KEYS.usuarioLogado);
            return true;
        },

        registerUser({ nome, email, senha }) {
            const usuarios = this.getUsers();
            const emailNormalizado = normalizarEmail(email);

            if (!nome || !emailNormalizado || !senha) {
                throw new Error('Nome, e-mail e senha são obrigatórios.');
            }

            const jaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === emailNormalizado);

            if (jaExiste) {
                throw new Error('Este e-mail já está cadastrado.');
            }

            const usuario = {
                id: Date.now() + Math.random().toString(16).slice(2),
                nome: String(nome).trim(),
                email: emailNormalizado,
                senha: String(senha),
                plano: null,
                criadoEm: new Date().toISOString()
            };

            usuarios.push(usuario);
            this.saveUsers(usuarios);
            return usuario;
        },

        createPost({ user, post }) {
            if (!user || !user.email) {
                throw new Error('É necessário estar logado para criar uma publicação.');
            }

            const dadosPost = {
                id: Date.now() + Math.random().toString(16).slice(2),
                email: normalizarEmail(user.email),
                usuarioId: user.id || null,
                nome: (post && post.nome) ? String(post.nome).trim() : (user.nome || 'Usuário'),
                titulo: (post && post.titulo) ? String(post.titulo).trim() : 'Publicação',
                descricao: (post && post.descricao) ? String(post.descricao).trim() : '',
                categoria: (post && post.categoria) ? String(post.categoria).trim() : 'Geral',
                contato: (post && post.contato) ? String(post.contato).trim() : '',
                plano: (post && post.plano) ? String(post.plano) : 'Básico',
                visualizacoes: 0,
                criadoEm: new Date().toISOString()
            };

            if (!dadosPost.titulo || !dadosPost.descricao) {
                throw new Error('Título e descrição são obrigatórios.');
            }

            const posts = this.getPosts();
            posts.unshift(dadosPost);
            this.savePosts(posts);
            return dadosPost;
        },

        canEditPost({ user, post }) {
            if (!user || !post) {
                return false;
            }

            const emailUser = normalizarEmail(user.email);
            const emailPost = normalizarEmail(post.email || post.usuarioEmail || post.autorEmail || '');

            if (emailPost && emailPost === emailUser) {
                return true;
            }

            if (post.usuarioId != null && user.id != null) {
                return String(post.usuarioId) === String(user.id);
            }

            return false;
        },

        registrarPagamento({ user, plano, valor, metodo, status = 'pendente', detalhes = {} }) {
            if (!user || !user.email || !plano) {
                throw new Error('Usuário e plano são obrigatórios para registrar o pagamento.');
            }

            const pagamentos = this.getPagamentos();
            const pagamento = {
                id: Date.now() + Math.random().toString(16).slice(2),
                usuarioId: user.id || null,
                usuarioEmail: normalizarEmail(user.email),
                usuarioNome: user.nome || 'Usuário',
                plano: String(plano),
                valor: Number(valor || 0),
                metodo: String(metodo || 'pix'),
                status: String(status).toLowerCase(),
                detalhes: detalhes || {},
                criadoEm: new Date().toISOString(),
                confirmadoEm: null,
                planoValidoAte: null
            };

            pagamentos.unshift(pagamento);
            this.savePagamentos(pagamentos);
            return pagamento;
        },

        confirmarPagamentoPix({ user, pagamentoId }) {
            if (!user || !pagamentoId) {
                return null;
            }

            const pagamentos = this.getPagamentos();
            const pagamento = pagamentos.find((item) => item.id === pagamentoId);

            if (!pagamento) {
                return null;
            }

            if (normalizarEmail(pagamento.usuarioEmail) !== normalizarEmail(user.email)) {
                return null;
            }

            pagamento.status = 'confirmado';
            pagamento.confirmadoEm = new Date().toISOString();
            pagamento.planoValidoAte = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            const usuarios = this.getUsers();
            const indiceUsuario = usuarios.findIndex((item) => String(item.id) === String(user.id));

            if (indiceUsuario >= 0) {
                usuarios[indiceUsuario].plano = pagamento.plano;
                usuarios[indiceUsuario].planoInicio = new Date().toISOString();
                usuarios[indiceUsuario].planoValidoAte = pagamento.planoValidoAte;
                this.saveUsers(usuarios);
            }

            this.savePagamentos(pagamentos);
            return pagamento;
        },

        podeAutorizarCompra({ user, pagamento }) {
            if (!user || !pagamento) {
                return false;
            }

            const emailUser = normalizarEmail(user.email);
            const emailPagamento = normalizarEmail(pagamento.usuarioEmail || '');

            return (
                emailUser === emailPagamento &&
                String(pagamento.status || '').toLowerCase() === 'confirmado'
            );
        }
    };

    globalScope.ImpulsoStorage = ImpulsoStorage;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ImpulsoStorage, STORAGE_KEYS };
    }
})(typeof window !== 'undefined' ? window : globalThis);

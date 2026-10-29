(function (globalScope) {
    const STORAGE_KEYS = {
        usuarios: 'impulsoUsuarios',
        posts: 'impulsoPosts',
        usuarioLogado: 'impulsoUsuarioLogado',
        pagamentos: 'impulsoPagamentos'
    };

    const storage = globalScope.localStorage;
    const db = globalScope.DB || null;

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

    const ImpulsoStorage = {
        STORAGE_KEYS,

        getUsers() {
            if (db && db.getCollection) {
                return db.getCollection('usuarios');
            }
            return lerJSON(STORAGE_KEYS.usuarios, []);
        },

        saveUsers(usuarios) {
            if (db && db.setCollection) {
                db.setCollection('usuarios', usuarios);
                return true;
            }
            return salvarJSON(STORAGE_KEYS.usuarios, usuarios);
        },

        getPosts() {
            if (db && db.getCollection) {
                return db.getCollection('posts');
            }
            return lerJSON(STORAGE_KEYS.posts, []);
        },

        savePosts(posts) {
            if (db && db.setCollection) {
                db.setCollection('posts', posts);
                return true;
            }
            return salvarJSON(STORAGE_KEYS.posts, posts);
        },

        getCurrentUser() {
            if (db && db.getUsuarioLogado) {
                return db.getUsuarioLogado();
            }
            return lerJSON(STORAGE_KEYS.usuarioLogado, null);
        },

        getPagamentos() {
            if (db && db.getCollection) {
                return db.getCollection('pagamentos');
            }
            return lerJSON(STORAGE_KEYS.pagamentos, []);
        },

        savePagamentos(pagamentos) {
            if (db && db.setCollection) {
                db.setCollection('pagamentos', pagamentos);
                return true;
            }
            return salvarJSON(STORAGE_KEYS.pagamentos, pagamentos);
        },

        setCurrentUser(usuario) {
            if (db && db.setUsuarioLogado) {
                return db.setUsuarioLogado(usuario);
            }

            if (!usuario) {
                storage.removeItem(STORAGE_KEYS.usuarioLogado);
                return true;
            }

            return salvarJSON(STORAGE_KEYS.usuarioLogado, usuario);
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

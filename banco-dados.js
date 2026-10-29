(function (globalScope) {
    const CHAVE_DB = 'impulsoDB';
    const estadoPadrao = {
        usuarios: [],
        posts: [],
        usuarioLogado: null,
        pagamentos: []
    };

    function getStorage() {
        if (typeof localStorage === 'undefined') {
            return null;
        }

        return localStorage;
    }

    function lerEstado() {
        const storage = getStorage();

        if (!storage) {
            return { ...estadoPadrao };
        }

        try {
            const bruto = storage.getItem(CHAVE_DB);
            if (!bruto) {
                storage.setItem(CHAVE_DB, JSON.stringify(estadoPadrao));
                return { ...estadoPadrao };
            }

            const parsed = JSON.parse(bruto);
            return {
                usuarios: Array.isArray(parsed.usuarios) ? parsed.usuarios : [],
                posts: Array.isArray(parsed.posts) ? parsed.posts : [],
                usuarioLogado: parsed.usuarioLogado || null,
                pagamentos: Array.isArray(parsed.pagamentos) ? parsed.pagamentos : []
            };
        } catch (erro) {
            console.warn('Erro ao ler banco local:', erro);
            storage.setItem(CHAVE_DB, JSON.stringify(estadoPadrao));
            return { ...estadoPadrao };
        }
    }

    function salvarEstado(novoEstado) {
        const storage = getStorage();

        if (!storage) {
            return false;
        }

        try {
            storage.setItem(CHAVE_DB, JSON.stringify(novoEstado));
            return true;
        } catch (erro) {
            console.warn('Erro ao salvar banco local:', erro);
            return false;
        }
    }

    const DB = {
        init() {
            return lerEstado();
        },

        state() {
            return lerEstado();
        },

        saveState(proximoEstado) {
            return salvarEstado(proximoEstado);
        },

        getCollection(nome) {
            const estado = lerEstado();
            return Array.isArray(estado[nome]) ? estado[nome] : [];
        },

        setCollection(nome, itens) {
            const estado = lerEstado();
            estado[nome] = Array.isArray(itens) ? itens : [];
            return salvarEstado(estado);
        },

        getUsuarioLogado() {
            const estado = lerEstado();
            return estado.usuarioLogado || null;
        },

        setUsuarioLogado(usuario) {
            const estado = lerEstado();
            estado.usuarioLogado = usuario || null;
            return salvarEstado(estado);
        },

        limpar() {
            const storage = getStorage();
            if (storage) {
                storage.removeItem(CHAVE_DB);
            }
            return this.init();
        }
    };

    const mapearChave = (chave) => {
        const nome = String(chave || '');

        if (nome === 'impulsoUsuarios') {
            return { tipo: 'colecao', nomeColecao: 'usuarios' };
        }

        if (nome === 'impulsoPosts') {
            return { tipo: 'colecao', nomeColecao: 'posts' };
        }

        if (nome === 'impulsoPagamentos') {
            return { tipo: 'colecao', nomeColecao: 'pagamentos' };
        }

        if (nome === 'impulsoUsuarioLogado') {
            return { tipo: 'usuario' };
        }

        return null;
    };

    if (typeof globalScope.localStorage !== 'undefined' && !globalScope.localStorage.__dbPatched) {
        const storageOriginal = globalScope.localStorage;
        const getItemOriginal = storageOriginal.getItem.bind(storageOriginal);
        const setItemOriginal = storageOriginal.setItem.bind(storageOriginal);
        const removeItemOriginal = storageOriginal.removeItem.bind(storageOriginal);

        storageOriginal.__dbPatched = true;

        storageOriginal.getItem = function (chave) {
            const mapeamento = mapearChave(chave);

            if (!mapeamento) {
                return getItemOriginal(chave);
            }

            if (mapeamento.tipo === 'colecao') {
                return JSON.stringify(DB.getCollection(mapeamento.nomeColecao));
            }

            if (mapeamento.tipo === 'usuario') {
                return JSON.stringify(DB.getUsuarioLogado());
            }

            return getItemOriginal(chave);
        };

        storageOriginal.setItem = function (chave, valor) {
            const mapeamento = mapearChave(chave);

            if (!mapeamento) {
                return setItemOriginal(chave, valor);
            }

            try {
                if (mapeamento.tipo === 'colecao') {
                    const dados = valor === null ? [] : JSON.parse(String(valor));
                    DB.setCollection(mapeamento.nomeColecao, dados);
                    return true;
                }

                if (mapeamento.tipo === 'usuario') {
                    const dados = valor === null ? null : JSON.parse(String(valor));
                    DB.setUsuarioLogado(dados);
                    return true;
                }
            } catch (erro) {
                console.warn('Erro ao redirecionar dado do localStorage para o banco:', erro);
            }

            return setItemOriginal(chave, valor);
        };

        storageOriginal.removeItem = function (chave) {
            const mapeamento = mapearChave(chave);

            if (!mapeamento) {
                return removeItemOriginal(chave);
            }

            if (mapeamento.tipo === 'colecao') {
                DB.setCollection(mapeamento.nomeColecao, []);
                return true;
            }

            if (mapeamento.tipo === 'usuario') {
                DB.setUsuarioLogado(null);
                return true;
            }

            return removeItemOriginal(chave);
        };
    }

    globalScope.DB = DB;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { DB };
    }
})(typeof window !== 'undefined' ? window : globalThis);

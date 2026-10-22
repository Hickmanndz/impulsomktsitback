
/* =====================================================
   IMPULSO MKT
   SISTEMA DE PLANOS E RECURSOS
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const abrirLogin =
    document.getElementById("abrirLogin");

const modalLogin =
    document.getElementById("modalLogin");

const modalCadastro =
    document.getElementById("modalCadastro");

const modalConta =
    document.getElementById("modalConta");

const modalCompra =
    document.getElementById("modalCompra");

const modalPerfil =
    document.getElementById("modalPerfil");

const modalPost =
    document.getElementById("modalPost");


const fecharLogin =
    document.getElementById("fecharLogin");

const fecharCadastro =
    document.getElementById("fecharCadastro");

const fecharConta =
    document.getElementById("fecharConta");

const fecharCompra =
    document.getElementById("fecharCompra");

const fecharPerfil =
    document.getElementById("fecharPerfil");

const fecharPost =
    document.getElementById("fecharPost");


const formLogin =
    document.getElementById("formLogin");

const formCadastro =
    document.getElementById("formCadastro");

const formPost =
    document.getElementById("formPost");


const abrirCadastro =
    document.getElementById("abrirCadastro");

const botaoSair =
    document.getElementById("botaoSair");

const botaoCriarPost =
    document.getElementById("botaoCriarPost");

const botaoMeusPosts =
    document.getElementById("botaoMeusPosts");

const botaoMudarPlano =
    document.getElementById("botaoMudarPlano");

const confirmarCompra =
    document.getElementById("confirmarCompra");


const pesquisa =
    document.getElementById("pesquisa");

const filtroCategoria =
    document.getElementById("filtroCategoria");


const areaPosts =
    document.getElementById("areaPosts");

const semPosts =
    document.getElementById("semPosts");


/* =====================================================
   DADOS
===================================================== */

let usuarios =
    JSON.parse(
        localStorage.getItem(
            "impulsoUsuarios"
        )
    ) || [];


let posts =
    JSON.parse(
        localStorage.getItem(
            "impulsoPosts"
        )
    ) || [];


let usuarioLogado =
    JSON.parse(
        localStorage.getItem(
            "impulsoUsuarioLogado"
        )
    ) || null;


/* =====================================================
   CONFIGURAÇÃO DOS PLANOS
===================================================== */

const planos = {

    "Básico": {

        preco: 10,

        limitePosts: 3,

        destaque: false,

        prioridade: false,

        selo: false,

        premium: false,

        descricao:
            "Plano inicial para começar sua divulgação."

    },


    "Destaque": {

        preco: 20,

        limitePosts: 10,

        destaque: true,

        prioridade: true,

        selo: true,

        premium: false,

        descricao:
            "Mais visibilidade e prioridade."

    },


    "Premium": {

        preco: 40,

        limitePosts: Infinity,

        destaque: true,

        prioridade: true,

        selo: true,

        premium: true,

        descricao:
            "Máxima exposição para seu trabalho."

    }

};


/* =====================================================
   MODAIS
===================================================== */

function abrirModal(modal) {
    if (!modal) {
        return;
    }

    // Fecha outros modais antes de abrir este
    document.querySelectorAll(".modal").forEach(function (outroModal) {
        if (outroModal !== modal) {
            outroModal.classList.remove("ativo");
            outroModal.style.display = "none";
        }
    });

    modal.classList.add("ativo");
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function fecharModal(modal) {
    if (!modal) {
        return;
    }

    modal.classList.remove("ativo");
    modal.style.display = "none";

    // Garante que a página volte a rolar
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
}


/* =====================================================
   LOGIN
===================================================== */

abrirLogin.addEventListener(
    "click",
    function () {

        if (usuarioLogado) {

            atualizarConta();

            abrirModal(modalConta);

        } else {

            abrirModal(modalLogin);

        }

    }
);


fecharLogin.addEventListener(
    "click",
    function () {

        fecharModal(modalLogin);

    }
);


/* =====================================================
   CADASTRO
===================================================== */

abrirCadastro.addEventListener(
    "click",
    function () {

        fecharModal(modalLogin);

        abrirModal(modalCadastro);

    }
);


fecharCadastro.addEventListener(
    "click",
    function () {

        fecharModal(modalCadastro);

    }
);


formCadastro.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const nome =
            document
            .getElementById("cadastroNome")
            .value
            .trim();


        const email =
            document
            .getElementById("cadastroEmail")
            .value
            .trim()
            .toLowerCase();


        const senha =
            document
            .getElementById("cadastroSenha")
            .value;


        const confirmar =
            document
            .getElementById("cadastroConfirmar")
            .value;


        if (senha.length < 4) {

            alert(
                "A senha precisa ter pelo menos 4 caracteres."
            );

            return;

        }


        if (senha !== confirmar) {

            alert(
                "As senhas não são iguais."
            );

            return;

        }


        const existe =
            usuarios.find(
                function (usuario) {

                    return (
                        usuario.email ===
                        email
                    );

                }
            );


        if (existe) {

            alert(
                "Este e-mail já está cadastrado."
            );

            return;

        }


        const novoUsuario = {

            id: Date.now(),

            nome: nome,

            email: email,

            senha: senha,

            plano: null

        };


        usuarios.push(
            novoUsuario
        );


        salvarUsuarios();


        usuarioLogado =
            novoUsuario;


        salvarUsuarioLogado();


        formCadastro.reset();


        fecharModal(
            modalCadastro
        );


        atualizarInterface();


        alert(
            "Conta criada com sucesso!"
        );

    }
);


/* =====================================================
   LOGIN
===================================================== */

formLogin.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const email =
            document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();


        const senha =
            document
            .getElementById("loginSenha")
            .value;


        const usuario =
            usuarios.find(
                function (item) {

                    return (
                        item.email ===
                        email &&
                        item.senha ===
                        senha
                    );

                }
            );


        if (!usuario) {

            alert(
                "E-mail ou senha incorretos."
            );

            return;

        }


        usuarioLogado =
            usuario;


        salvarUsuarioLogado();


        formLogin.reset();


        fecharModal(
            modalLogin
        );


        atualizarInterface();


        alert(
            "Login realizado com sucesso!"
        );

    }
);


/* =====================================================
   SALVAR
===================================================== */

function salvarUsuarios() {

    localStorage.setItem(
        "impulsoUsuarios",
        JSON.stringify(
            usuarios
        )
    );
    atualizarCategoriasImpulso();
    document.getElementById("filtroCategoria")
    ?.dispatchEvent(new Event("change"));

}


function salvarUsuarioLogado() {

    localStorage.setItem(
        "impulsoUsuarioLogado",
        JSON.stringify(
            usuarioLogado
        )
    );

}


/* =====================================================
   INTERFACE
===================================================== */

function atualizarInterface() {

    if (usuarioLogado) {

        abrirLogin.textContent =
            "Minha conta";

    } else {

        abrirLogin.textContent =
            "Entrar";

    }

}


/* =====================================================
   OBTER PLANO
===================================================== */

function obterPlano() {

    if (
        !usuarioLogado ||
        !usuarioLogado.plano
    ) {

        return null;

    }


    return planos[
        usuarioLogado.plano
    ];

}


/* =====================================================
   CONTA
===================================================== */

function atualizarConta() {

    if (!usuarioLogado) {
        return;
    }


    document.getElementById(
        "nomeConta"
    ).textContent =
        usuarioLogado.nome;


    document.getElementById(
        "emailConta"
    ).textContent =
        usuarioLogado.email;


    document.getElementById(
        "avatarConta"
    ).textContent =
        usuarioLogado.nome
        .charAt(0)
        .toUpperCase();


    const nomePlano =
        document.getElementById(
            "nomePlanoAtual"
        );


    const listaRecursos =
        document.getElementById(
            "listaRecursos"
        );


    const plano =
        obterPlano();


    /* SEM PLANO */

    if (!plano) {

        nomePlano.textContent =
            "Sem plano";


        listaRecursos.innerHTML = `

            <div class="recurso-conta bloqueado">
                🔒 Criação de posts
            </div>

            <div class="recurso-conta bloqueado">
                🔒 Destaque nas buscas
            </div>

            <div class="recurso-conta bloqueado">
                🔒 Selo de destaque
            </div>

            <div class="recurso-conta bloqueado">
                🔒 Recursos Premium
            </div>

        `;

        return;

    }


    nomePlano.textContent =
        usuarioLogado.plano;


    let limiteTexto;


    if (
        plano.limitePosts ===
        Infinity
    ) {

        limiteTexto =
            "Posts ilimitados";

    } else {

        limiteTexto =
            "Até " +
            plano.limitePosts +
            " posts";

    }


    listaRecursos.innerHTML = `

        <div class="recurso-conta ativo">
            ✓ ${limiteTexto}
        </div>

        <div class="recurso-conta ativo">
            ✓ Perfil público
        </div>

        <div class="recurso-conta ativo">
            ✓ Informações de contato
        </div>

        <div class="recurso-conta ${
            plano.destaque
            ? "ativo"
            : "bloqueado"
        }">

            ${
                plano.destaque
                ? "✓"
                : "🔒"
            }

            Destaque nas buscas

        </div>

        <div class="recurso-conta ${
            plano.selo
            ? "ativo"
            : "bloqueado"
        }">

            ${
                plano.selo
                ? "✓"
                : "🔒"
            }

            Selo de destaque

        </div>

        <div class="recurso-conta ${
            plano.premium
            ? "ativo"
            : "bloqueado"
        }">

            ${
                plano.premium
                ? "✓"
                : "🔒"
            }

            Recursos Premium

        </div>

    `;

}


fecharConta.addEventListener(
    "click",
    function () {

        fecharModal(
            modalConta
        );

    }
);


/* =====================================================
   SAIR
===================================================== */

botaoSair.addEventListener(
    "click",
    function () {

        usuarioLogado = null;


        localStorage.removeItem(
            "impulsoUsuarioLogado"
        );


        atualizarInterface();


        fecharModal(
            modalConta
        );


        alert(
            "Você saiu da conta."
        );

    }
);


/* =====================================================
   MUDAR DE PLANO
===================================================== */

botaoMudarPlano.addEventListener(
    "click",
    function () {

        fecharModal(
            modalConta
        );


        document
            .getElementById(
                "planos"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =====================================================
   COMPRAR PLANO
===================================================== */

const botoesPlanos =
    document.querySelectorAll(
        ".botao-plano"
    );


botoesPlanos.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                if (!usuarioLogado) {

                    alert(
                        "Entre ou crie uma conta primeiro."
                    );

                    abrirModal(
                        modalLogin
                    );

                    return;

                }


                const plano =
                    botao.getAttribute(
                        "data-plano"
                    );


                const preco =
                    botao.getAttribute(
                        "data-preco"
                    );


                document.getElementById(
                    "planoEscolhido"
                ).textContent =
                    "Plano " +
                    plano;


                document.getElementById(
                    "precoEscolhido"
                ).textContent =
                    "R$" +
                    preco +
                    "/mês";


                confirmarCompra.dataset.plano =
                    plano;


                confirmarCompra.dataset.preco =
                    preco;


                abrirModal(
                    modalCompra
                );

            }
        );

    }
);


/* =====================================================
   FECHAR COMPRA
===================================================== */

fecharCompra.addEventListener(
    "click",
    function () {

        fecharModal(
            modalCompra
        );

    }
);


/* =====================================================
   CONFIRMAR PLANO
===================================================== */

confirmarCompra.addEventListener(
    "click",
    function () {

        const novoPlano =
            confirmarCompra.dataset.plano;


        if (!usuarioLogado) {

            fecharModal(
                modalCompra
            );

            abrirModal(
                modalLogin
            );

            return;

        }


        usuarioLogado.plano =
            novoPlano;


        const indice =
            usuarios.findIndex(
                function (usuario) {

                    return (
                        usuario.id ===
                        usuarioLogado.id
                    );

                }
            );


        if (indice !== -1) {

            usuarios[indice] =
                usuarioLogado;

        }


        salvarUsuarios();

        salvarUsuarioLogado();


        fecharModal(
            modalCompra
        );


        alert(
            "Seu plano agora é " +
            novoPlano +
            "!"
        );


        atualizarConta();

    }
);




/* =====================================================
   FECHAR POST
===================================================== */

fecharPost.addEventListener(
    "click",
    function () {

        fecharModal(
            modalPost
        );

    }
);





function mostrarPosts() {

    // Remove os cartões antigos
    const postsExistentes =
        areaPosts.querySelectorAll(".post");

    postsExistentes.forEach(function (post) {
        post.remove();
    });

    // Mostra o aviso caso não existam publicações
    if (posts.length === 0) {
        semPosts.style.display = "block";
        return;
    }

    semPosts.style.display = "none";

    // Premium primeiro, depois Destaque e Básico
    const postsOrdenados = [...posts].sort(function (a, b) {

        const prioridade = function (post) {
            if (post.premium) return 3;
            if (post.destaque) return 2;
            return 1;
        };

        return prioridade(b) - prioridade(a);
    });

    postsOrdenados.forEach(function (post) {

        const elemento = document.createElement("div");

        elemento.className = "post";
        elemento.dataset.postId = String(post.id);

        // Classes visuais dos planos
        if (post.premium) {
            elemento.classList.add("post-premium");
        } else if (post.destaque) {
            elemento.classList.add("post-destaque");
        }

        // Selo do plano
        let selo = "";

        if (post.premium) {
            selo = `
                <span class="selo-post premium">
                    ★ PREMIUM
                </span>
            `;
        } else if (post.destaque) {
            selo = `
                <span class="selo-post destaque">
                    ★ DESTAQUE
                </span>
            `;
        }

        // Imagem opcional da publicação
        const imagemHTML = post.imagem
            ? `
                <img
                    class="post-imagem"
                    src="${escaparHTML(post.imagem)}"
                    alt="${escaparHTML(post.titulo || post.nome || "Imagem da publicação")}"
                    loading="lazy"
                >
            `
            : `
                <div class="post-imagem-vazia">
                    📢
                </div>
            `;

        // Cartão simplificado
        elemento.innerHTML = `
            ${selo}

            ${imagemHTML}

            <div class="post-conteudo">

                <div class="post-autor">
                    ${escaparHTML(post.nome || "Profissional")}
                </div>

                <span class="post-categoria">
                    ${escaparHTML(post.categoria || "Serviço")}
                </span>

                <h3>
                    ${escaparHTML(post.titulo || "Serviço publicado")}
                </h3>

                <button
                    type="button"
                    class="botao-ver-publicacao"
                    data-abrir-publicacao="${escaparHTML(post.id)}"
                >
                    Ver publicação
                </button>

            </div>
        `;

        areaPosts.appendChild(elemento);
    });
}


/* =====================================================
   ABRIR A PÁGINA DA PUBLICAÇÃO
===================================================== */

areaPosts.addEventListener("click", function (event) {

    const botao = event.target.closest(
        "[data-abrir-publicacao]"
    );

    if (!botao) return;

    const id = botao.dataset.abrirPublicacao;

    if (!id) return;

    // Confirma que a publicação ainda existe
    const publicacaoExiste = posts.some(function (post) {
        return String(post.id) === String(id);
    });

    if (!publicacaoExiste) {
        alert("Esta publicação não foi encontrada.");
        return;
    }

    // Abre os detalhes da empresa
    window.open(
        "empresa.html?id=" + encodeURIComponent(id),
        "_blank"
    );

});

/* =====================================================
   SEGURANÇA DO TEXTO
===================================================== */

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;

}


/* =====================================================
   MEUS POSTS
===================================================== */




/* =====================================================
   PERFIS DEMO
===================================================== */

const perfis =
    document.querySelectorAll(
        ".perfil"
    );


const dadosPerfis = {

    "Alpha Design": {

        categoria:
            "Design",

        descricao:
            "Criação de artes, logos, banners e identidade visual.",

        iniciais:
            "AD"

    },


    "Bella Store": {

        categoria:
            "Beleza",

        descricao:
            "Produtos e serviços voltados para beleza e estética.",

        iniciais:
            "BS"

    },


    "Creative Media": {

        categoria:
            "Marketing",

        descricao:
            "Marketing digital e criação de conteúdo.",

        iniciais:
            "CM"

    },


    "Studio Pro": {

        categoria:
            "Tecnologia",

        descricao:
            "Criação de sites e soluções digitais.",

        iniciais:
            "SP"

    }

};


perfis.forEach(
    function (perfil) {

        const botao =
            perfil.querySelector(
                ".ver-perfil"
            );


        botao.addEventListener(
            "click",
            function () {

                const nome =
                    perfil.getAttribute(
                        "data-nome"
                    );


                const dados =
                    dadosPerfis[nome];


                if (!dados) {
                    return;
                }


                document.getElementById(
                    "perfilNome"
                ).textContent =
                    nome;


                document.getElementById(
                    "perfilCategoria"
                ).textContent =
                    dados.categoria;


                document.getElementById(
                    "perfilDescricao"
                ).textContent =
                    dados.descricao;


                document.getElementById(
                    "avatarPerfil"
                ).textContent =
                    dados.iniciais;


                abrirModal(
                    modalPerfil
                );

            }
        );

    }
);


/* =====================================================
   FECHAR PERFIL
===================================================== */

fecharPerfil.addEventListener(
    "click",
    function () {

        fecharModal(
            modalPerfil
        );

    }
);


/* =====================================================
   CONTATO
===================================================== */

document
    .getElementById(
        "entrarEmContato"
    )
    .addEventListener(
        "click",
        function () {

            alert(
                "Sistema de contato em desenvolvimento."
            );

        }
    );


/* =====================================================
   PESQUISA
===================================================== */

function filtrarPerfis() {

    const texto =
        pesquisa.value
        .toLowerCase()
        .trim();


    const categoria =
        filtroCategoria.value;


    perfis.forEach(
        function (perfil) {

            const nome =
                perfil
                .getAttribute(
                    "data-nome"
                )
                .toLowerCase();


            const categoriaPerfil =
                perfil
                .getAttribute(
                    "data-categoria"
                );


            const nomeCorresponde =
                nome.includes(
                    texto
                );


            const categoriaCorresponde =
                categoria ===
                    "todos" ||
                categoriaPerfil ===
                    categoria;


            if (
                nomeCorresponde &&
                categoriaCorresponde
            ) {

                perfil.style.display =
                    "block";

            } else {

                perfil.style.display =
                    "none";

            }

        }
    );

}



if (pesquisa) {
    pesquisa.addEventListener(
        "input",
        filtrarPerfis
    );
}

// Só conecta o filtro antigo se ele existir
// e se a pesquisa antiga ainda estiver no HTML.
if (pesquisa && filtroCategoria) {
    filtroCategoria.addEventListener(
        "change",
        filtrarPerfis
    );
}


/* =====================================================
   FECHAR MODAIS
===================================================== */

const todosModais =
    document.querySelectorAll(
        ".modal"
    );


todosModais.forEach(
    function (modal) {

        modal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target ===
                    modal
                ) {

                    fecharModal(
                        modal
                    );

                }

            }
        );

    }
);


/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            evento.key ===
            "Escape"
        ) {

            todosModais.forEach(
                function (modal) {

                    fecharModal(
                        modal
                    );

                }
            );

        }

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

atualizarInterface();

mostrarPosts();


console.log(
    "Impulso MKT iniciado corretamente."
);


// ============================================
// IMPULSO MKT - MINHA CONTA
// Perfil, foto, senha, plano e logout
// ============================================

(function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const PLANOS_CONTA = {
        "Básico": [
            ["Criar até 3 posts", true],
            ["Perfil profissional", true],
            ["Informações de contato", true],
            ["Aparecer em destaque", false],
            ["Selo de destaque", false],
            ["Recursos Premium", false]
        ],
        "Destaque": [
            ["Criar até 10 posts", true],
            ["Perfil profissional", true],
            ["Informações de contato", true],
            ["Aparecer em destaque", true],
            ["Prioridade nas buscas", true],
            ["Selo de destaque", true],
            ["Recursos Premium", false]
        ],
        "Premium": [
            ["Posts ilimitados", true],
            ["Perfil profissional completo", true],
            ["Informações de contato", true],
            ["Aparecer em destaque", true],
            ["Prioridade nas buscas", true],
            ["Selo Premium", true],
            ["Todos os recursos disponíveis", true]
        ]
    };

    function usuarioAtual() {
        try {
            const usuario = JSON.parse(
                localStorage.getItem("impulsoUsuarioLogado")
            );

            return usuario && typeof usuario === "object"
                ? usuario
                : null;
        } catch (erro) {
            return null;
        }
    }

    function salvarUsuario(usuario) {
        try {
            const lista = JSON.parse(
                localStorage.getItem("impulsoUsuarios") || "[]"
            );

            const indice = lista.findIndex(
                item => item.email === usuario.email
            );

            if (indice < 0) {
                alert(
                    "Não foi possível localizar esse cadastro. " +
                    "Entre novamente na sua conta."
                );
                return false;
            }

            lista[indice] = {
                ...lista[indice],
                ...usuario
            };

            localStorage.setItem(
                "impulsoUsuarios",
                JSON.stringify(lista)
            );

            localStorage.setItem(
                "impulsoUsuarioLogado",
                JSON.stringify(usuario)
            );

            return true;
        } catch (erro) {
            alert(
                "Não foi possível salvar os dados. " +
                "Verifique o espaço disponível no navegador."
            );
            return false;
        }
    }

    
function abrirModal(id) {
    const modal = $(id);
    if (!modal) return;

    document.querySelectorAll(".modal").forEach(function (outro) {
        if (outro !== modal) {
            outro.classList.remove("ativo");
            outro.style.display = "none";
        }
    });

    modal.classList.add("ativo");
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function fecharModal(id) {
    const modal = $(id);
    if (!modal) return;

    modal.classList.remove("ativo");
    modal.style.display = "none";

    const existeOutroAberto = Array.from(
        document.querySelectorAll(".modal")
    ).some(function (outro) {
        return outro !== modal &&
            outro.classList.contains("ativo") &&
            getComputedStyle(outro).display !== "none";
    });

    if (!existeOutroAberto) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }
}


    function atualizarRecursos(plano) {
        const lista = $("listaRecursos");
        if (!lista) return;

        lista.replaceChildren();

        const recursos = PLANOS_CONTA[plano] || [
            ["Escolha um plano para liberar os recursos", false]
        ];

        recursos.forEach(([nome, ativo]) => {
            const item = document.createElement("div");

            item.className = "recurso-conta " +
                (ativo ? "ativo" : "bloqueado");

            item.textContent = (ativo ? "✓  " : "🔒  ") + nome;
            lista.appendChild(item);
        });
    }

    function atualizarContaUI() {
        const usuario = usuarioAtual();
        if (!usuario) return;

        const nome = usuario.nome || "Usuário";
        const plano = usuario.plano || "";

        if ($("nomeConta")) $("nomeConta").textContent = nome;
        if ($("emailConta")) {
            $("emailConta").textContent = usuario.email || "";
        }

        if ($("contaNomeProfissional")) {
            $("contaNomeProfissional").textContent =
                usuario.nomeProfissional || nome;
        }

        if ($("contaCategoria")) {
            $("contaCategoria").textContent =
                usuario.categoria || "Não informada";
        }

        if ($("contaDescricao")) {
            $("contaDescricao").textContent =
                usuario.descricao || "Adicione uma descrição.";
        }

        if ($("nomePlanoAtual")) {
            $("nomePlanoAtual").textContent = plano || "Sem plano";
        }

        const avatar = $("avatarConta");

        if (avatar) {
            if (usuario.foto) {
                avatar.style.backgroundImage =
                    `url("${usuario.foto}")`;
                avatar.textContent = "";
            } else {
                avatar.style.backgroundImage = "none";
                avatar.textContent =
                    nome.trim().charAt(0).toUpperCase() || "U";
            }
        }

        atualizarRecursos(plano);

        // Atualiza também a função antiga de recursos, se existir.
        if (typeof window.atualizarConta === "function") {
            // Evita recursão se a função antiga tiver o mesmo propósito.
            // A lista desta versão já foi atualizada acima.
        }
    }


    // Atualiza perfil quando o modal é aberto.
    $("modalConta")?.addEventListener("click", function (evento) {
        if (evento.target === this) {
            fecharModal("modalConta");
        }
    });

    $("fecharConta")?.addEventListener("click", function () {
        fecharModal("modalConta");
    });

    // FOTO DE PERFIL
    $("fotoPerfil")?.addEventListener("change", function () {
        const arquivo = this.files && this.files[0];
        if (!arquivo) return;

        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta primeiro.");
            this.value = "";
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            alert("Use uma imagem JPG, PNG ou WebP.");
            this.value = "";
            return;
        }

        if (arquivo.size > 700 * 1024) {
            alert("Escolha uma imagem de até 700 KB.");
            this.value = "";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function () {
            usuario.foto = leitor.result;

            if (salvarUsuario(usuario)) {
                atualizarContaUI();
                alert("Foto atualizada!");
            }
        };

        leitor.onerror = function () {
            alert("Não foi possível abrir essa imagem.");
        };

        leitor.readAsDataURL(arquivo);
    });

    // ABRIR E PREENCHER EDIÇÃO DE PERFIL
    $("botaoEditarPerfil")?.addEventListener("click", function () {
        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta primeiro.");
            return;
        }

        $("editarNome").value =
            usuario.nomeProfissional || usuario.nome || "";

        $("editarCategoria").value = usuario.categoria || "";
        $("editarDescricao").value = usuario.descricao || "";

        fecharModal("modalConta");
        abrirModal("modalEditarPerfil");
    });

    $("fecharEditarPerfil")?.addEventListener("click", function () {
        fecharModal("modalEditarPerfil");
        abrirModal("modalConta");
    });

    $("formEditarPerfil")?.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const usuario = usuarioAtual();
        if (!usuario) {
            alert("Entre novamente na sua conta.");
            return;
        }

        const nome = $("editarNome").value.trim();
        const categoria = $("editarCategoria").value;
        const descricao = $("editarDescricao").value.trim();

        if (!nome || !categoria) {
            alert("Informe o nome e a categoria.");
            return;
        }

        usuario.nomeProfissional = nome;
        usuario.categoria = categoria;
        usuario.descricao = descricao;

        if (!salvarUsuario(usuario)) return;

        fecharModal("modalEditarPerfil");
        atualizarContaUI();
        abrirModal("modalConta");

        alert("Perfil atualizado com sucesso!");
    });

    // ALTERAR SENHA
    $("botaoAlterarSenha")?.addEventListener("click", function () {
        if (!usuarioAtual()) {
            alert("Entre na sua conta primeiro.");
            return;
        }

        $("formAlterarSenha")?.reset();
        fecharModal("modalConta");
        abrirModal("modalAlterarSenha");
    });

    $("fecharAlterarSenha")?.addEventListener("click", function () {
        fecharModal("modalAlterarSenha");
        abrirModal("modalConta");
    });

    $("formAlterarSenha")?.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const usuario = usuarioAtual();
        if (!usuario) {
            alert("Entre novamente na sua conta.");
            return;
        }

        const atual = $("senhaAtualConta").value;
        const nova = $("novaSenhaConta").value;
        const confirmar = $("confirmarSenhaConta").value;

        // Compatibilidade com o cadastro demonstrativo atual.
        if (atual !== usuario.senha) {
            alert("A senha atual está incorreta.");
            return;
        }

        if (nova.length < 8) {
            alert("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (nova !== confirmar) {
            alert("As senhas novas não coincidem.");
            return;
        }

        usuario.senha = nova;

        if (!salvarUsuario(usuario)) return;

        $("formAlterarSenha").reset();
        fecharModal("modalAlterarSenha");
        abrirModal("modalConta");

        alert("Senha alterada com sucesso!");
    });

    // MUDAR PLANO
    $("botaoMudarPlano")?.addEventListener("click", function () {
        fecharModal("modalConta");

        const secaoPlanos = $("planos");

        if (secaoPlanos) {
            secaoPlanos.scrollIntoView({ behavior: "smooth" });
        } else {
            alert("Não foi possível encontrar a seção de planos.");
        }
    });

    // CRIAR POST E VER POSTS
    // Reutiliza os botões do sistema de publicações existente.


    // LOGOUT
    $("botaoSair")?.addEventListener("click", function () {
        if (!usuarioAtual()) {
            fecharModal("modalConta");
            return;
        }

        const confirmar = confirm("Deseja realmente sair da sua conta?");
        if (!confirmar) return;

        localStorage.removeItem("impulsoUsuarioLogado");

        fecharModal("modalConta");
        fecharModal("modalEditarPerfil");
        fecharModal("modalAlterarSenha");

        // Atualiza o botão de cabeçalho, se o sistema existente o utiliza.
        const botao = $("abrirLogin");
        if (botao) botao.textContent = "Entrar";

        alert("Você saiu da sua conta.");
    });

    // Atualiza os dados ao carregar a página.
    document.addEventListener("DOMContentLoaded", atualizarContaUI);

    // Permite que o restante do sistema atualize a conta após o login.
    window.atualizarMinhaContaImpulso = atualizarContaUI;

})();

if (typeof window.atualizarMinhaContaImpulso === "function") {
    window.atualizarMinhaContaImpulso();
}


// ==============================================
// IMPULSO MKT - SISTEMA DE PUBLICAÇÕES
// Edite, exclua, imagem, WhatsApp e visualizações
// ==============================================

(function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const LIMITES_POSTS = {
        "Básico": 3,
        "Destaque": 10,
        "Premium": Infinity
    };

    const NOMES_PLANOS = {
        "basico": "Básico",
        "básico": "Básico",
        "destaque": "Destaque",
        "premium": "Premium"
    };

    let imagemSelecionada = null;
    let carregamentoImagem = 0;

    function usuarioAtual() {
        try {
            return JSON.parse(
                localStorage.getItem("impulsoUsuarioLogado")
            );
        } catch {
            return null;
        }
    }

    function lerPosts() {
        try {
            const dados = JSON.parse(
                localStorage.getItem("impulsoPosts") || "[]"
            );

            return Array.isArray(dados) ? dados : [];
        } catch {
            return [];
        }
    }

  
function salvarPosts(posts) {
    try {
        localStorage.setItem(
            "impulsoPosts",
            JSON.stringify(posts)
        );

        // Atualiza as categorias assim que os posts forem salvos.
        if (typeof window.atualizarCategoriasImpulso === "function") {
            window.atualizarCategoriasImpulso();
        }

        // Executa novamente a busca com os dados atualizados.
        if (typeof window.filtrarPerfisImpulso === "function") {
            window.filtrarPerfisImpulso();
        }

        // Atualiza o limite de publicações do plano.
        if (typeof window.atualizarLimitePostsImpulso === "function") {
            window.atualizarLimitePostsImpulso();
        }

        return true;
    } catch (erro) {
        console.error("Erro ao salvar publicações:", erro);

        alert(
            "Não foi possível salvar as publicações. " +
            "A imagem pode ser grande demais para o armazenamento local."
        );

        return false;
    }
}


    function nomePlano(usuario) {
        if (!usuario || !usuario.plano) return "";

        const chave = String(usuario.plano).trim().toLowerCase();

        return NOMES_PLANOS[chave] || "";
    }

    function normalizarPlano(plano) {
        const chave = String(plano || "").trim().toLowerCase();

        return NOMES_PLANOS[chave] || "Básico";
    }

    
function donoDoPost(post, usuario) {
    if (!post || !usuario) {
        return false;
    }

    // Compatibilidade com os formatos de posts existentes.
    const emailPost =
        post.email ||
        post.usuarioEmail ||
        post.autorEmail ||
        "";

    if (
        emailPost &&
        usuario.email &&
        emailPost.toLowerCase() === usuario.email.toLowerCase()
    ) {
        return true;
    }

    // Posts antigos que identificam o dono pelo ID.
    if (
        post.usuarioId != null &&
        usuario.id != null &&
        String(post.usuarioId) === String(usuario.id)
    ) {
        return true;
    }

    return false;
}


function abrirModal(id) {
    const modal = $(id);
    if (!modal) return;

    document.querySelectorAll(".modal").forEach(function (outro) {
        if (outro !== modal) {
            outro.classList.remove("ativo");
            outro.style.display = "none";
        }
    });

    modal.classList.add("ativo");
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function fecharModal(id) {
    const modal = $(id);
    if (!modal) return;

    modal.classList.remove("ativo");
    modal.style.display = "none";

    const existeOutroAberto = Array.from(
        document.querySelectorAll(".modal")
    ).some(function (outro) {
        return outro !== modal &&
            outro.classList.contains("ativo") &&
            getComputedStyle(outro).display !== "none";
    });

    if (!existeOutroAberto) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }
}


    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }

    function telefoneWhatsApp(valor) {
        let numero = String(valor || "").replace(/\D/g, "");

        // Adiciona o código do Brasil se ele não estiver presente.
        if (numero.length === 10 || numero.length === 11) {
            numero = "55" + numero;
        }

        // Aceita somente números brasileiros com DDD.
        if (!/^55[1-9]\d9?\d{8}$/.test(numero)) {
            return "";
        }

        return numero;
    }

    function resetarFormulario() {
        $("formPost")?.reset();

        if ($("postIdEdicao")) {
            $("postIdEdicao").value = "";
        }

        imagemSelecionada = null;

        if ($("previewImagemPost")) {
            $("previewImagemPost").replaceChildren();
        }

        if ($("botaoSalvarPost")) {
            $("botaoSalvarPost").textContent = "Publicar post";
        }
    }

    function imagemDoPost(post) {
        if (!post.imagem) return "";

        return `
            <img
                class="post-imagem"
                src="${escaparHTML(post.imagem)}"
                alt="Imagem da publicação"
                loading="lazy"
            >
        `;
    }

    function classePlano(plano) {
        const nome = normalizarPlano(plano);

        if (nome === "Premium") return "post-premium";
        if (nome === "Destaque") return "post-destaque";

        return "post-basico";
    }

    function mostrarPosts() {
        const area = $("areaPosts");
        if (!area) return;

        const usuario = usuarioAtual();

        const posts = lerPosts().sort((a, b) => {
            const prioridade = {
                "Premium": 3,
                "Destaque": 2,
                "Básico": 1
            };

            const planoA = normalizarPlano(a.plano);
            const planoB = normalizarPlano(b.plano);

            return prioridade[planoB] - prioridade[planoA];
        });

        area.replaceChildren();

        if (posts.length === 0) {
            const vazio = document.createElement("div");

            vazio.className = "sem-posts";
            vazio.innerHTML = `
                <div class="icone-post">📢</div>
                <h3>Ainda não existem publicações</h3>
                <p>Seja o primeiro a divulgar seu trabalho.</p>
            `;

            area.appendChild(vazio);
            return;
        }

        posts.forEach(post => {
            const plano = normalizarPlano(post.plano);
            const categoria = String(post.categoria || "Outros");
            const nome = String(post.nome || "Profissional");
            const titulo = String(post.titulo || "Publicação");
            const descricao = String(post.descricao || "");
            const contato = String(post.contato || "");
            const views = Number(post.visualizacoes) || 0;
            const meuPost = donoDoPost(post, usuario);

            const card = document.createElement("article");
            card.className = `post ${classePlano(plano)}`;

            card.dataset.postId = post.id;

            const avatarLetra = escaparHTML(
                nome.trim().charAt(0).toUpperCase() || "P"
            );

            const selo = plano === "Premium"
                ? "★ PREMIUM"
                : plano === "Destaque"
                    ? "★ DESTAQUE"
                    : "PLANO BÁSICO";

            
            card.innerHTML = `
                ${imagemDoPost(post)}

                <span class="post-plano">${selo}</span>

                <div class="post-topo">
                    <div class="post-avatar">${avatarLetra}</div>
                    <div>
                        <div class="post-autor">${escaparHTML(nome)}</div>
                        <span class="post-categoria">
                            ${escaparHTML(categoria)}
                        </span>
                    </div>
                </div>

                <h3>${escaparHTML(titulo)}</h3>

             

                <div class="post-estatisticas">
                    👁️ <span class="contador-views">${views}</span>
                    visualizações
                </div>

                <div class="post-acoes">
                    <button type="button" class="post-ver">
                        Ver publicação
                    </button>

        
                    ${meuPost ? `
                        <button type="button" class="post-editar">
                            ✏️ Editar publicação
                        </button>

                        <button type="button" class="post-excluir">
                            🗑️ Excluir publicação
                        </button>
                    ` : ""}
                </div>
            `;

            // Visualizar publicação incrementa a contagem local.
           card.querySelector(".post-ver").addEventListener(
    "click",
    function () {
        const postsAtuais = lerPosts();

        const indice = postsAtuais.findIndex(
            item => item.id === post.id
        );

        if (indice < 0) return;

        // Aumenta as visualizações
        postsAtuais[indice].visualizacoes =
            (Number(postsAtuais[indice].visualizacoes) || 0) + 1;

        if (!salvarPosts(postsAtuais)) return;

        // Atualiza o contador na publicação
        card.querySelector(".contador-views").textContent =
            postsAtuais[indice].visualizacoes;

        // Abre a página detalhada em uma NOVA GUIA
        window.open(
            `empresa.html?id=${encodeURIComponent(post.id)}`,
            "_blank"
        );
    }
);
            // Somente o dono pode editar.
            if (meuPost) {
                card.querySelector(".post-editar").addEventListener(
                    "click",
                    function () {
                        editarPost(post.id);
                    }
                );

                card.querySelector(".post-excluir").addEventListener(
                    "click",
                    function () {
                        excluirPost(post.id);
                    }
                );
            }

           
            area.appendChild(card);
        });

        // Reaplica a busca após recriar os cards.
        if (typeof window.filtrarPerfisImpulso === "function") {
            window.filtrarPerfisImpulso();
        }
    }


    function editarPost(id) {
        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta para editar uma publicação.");
            return;
        }

        const post = lerPosts().find(item => item.id === id);

        if (!post || !donoDoPost(post, usuario)) {
            alert("Você não tem permissão para editar esta publicação.");
            return;
        }

        resetarFormulario();

        $("postIdEdicao").value = post.id;
        $("postNome").value = post.nome || "";
        $("postCategoria").value = post.categoria || "";
        $("postTitulo").value = post.titulo || "";
        $("postDescricao").value = post.descricao || "";
        $("postContato").value = post.contato || "";

        imagemSelecionada = post.imagem || null;

        if (imagemSelecionada && $("previewImagemPost")) {
            const imagem = document.createElement("img");
            imagem.src = imagemSelecionada;
            imagem.alt = "Pré-visualização da imagem";

            $("previewImagemPost").replaceChildren(imagem);
        }

        if ($("botaoSalvarPost")) {
            $("botaoSalvarPost").textContent = "Salvar alterações";
        }

        fecharModal("modalConta");
        abrirModal("modalPost");
    }

    function excluirPost(id) {
        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta primeiro.");
            return;
        }

        const post = lerPosts().find(item => item.id === id);

        if (!post || !donoDoPost(post, usuario)) {
            alert("Você não pode excluir esta publicação.");
            return;
        }

        if (!confirm("Deseja realmente excluir esta publicação?")) {
            return;
        }

        const restantes = lerPosts().filter(item => item.id !== id);

        if (salvarPosts(restantes)) {
            mostrarPosts();
            alert("Publicação excluída.");
        }
    }

    // IMAGEM E PRÉ-VISUALIZAÇÃO
    $("postImagem")?.addEventListener("change", function () {
        const arquivo = this.files && this.files[0];

        if (!arquivo) {
            imagemSelecionada = null;
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            alert("Escolha uma imagem JPG, PNG ou WebP.");
            this.value = "";
            return;
        }

        if (arquivo.size > 500 * 1024) {
            alert("A imagem deve ter no máximo 500 KB.");
            this.value = "";
            return;
        }

        const leitor = new FileReader();
        const tentativa = ++carregamentoImagem;

        leitor.onload = function () {
            if (tentativa !== carregamentoImagem) return;

            imagemSelecionada = leitor.result;

            const preview = $("previewImagemPost");
            if (!preview) return;

            const imagem = document.createElement("img");
            imagem.src = imagemSelecionada;
            imagem.alt = "Pré-visualização da publicação";

            preview.replaceChildren(imagem);
        };

        leitor.onerror = function () {
            alert("Não foi possível carregar a imagem.");
        };

        leitor.readAsDataURL(arquivo);
    });

    // CRIAR OU SALVAR ALTERAÇÕES
    $("formPost")?.addEventListener("submit", function (evento) {
        
        if (verificarConteudoInadequado(event.currentTarget)) {
    event.preventDefault();

    alert(
        "⚠️ Publicação não permitida!\n\n" +
        "O Impulso MKT não permite conteúdo sexual explícito " +
        "ou anúncios inadequados. Revise os campos e tente novamente."
    );

    return;
}
        evento.preventDefault();

        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta para publicar.");
            return;
        }

        const plano = nomePlano(usuario);

        if (!plano) {
            alert("Escolha um plano antes de publicar.");
            fecharModal("modalPost");
            $("planos")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        const idEdicao = $("postIdEdicao")?.value;
        const posts = lerPosts();

        const existente = idEdicao
            ? posts.find(post => post.id === idEdicao)
            : null;

        if (idEdicao && (!existente || !donoDoPost(existente, usuario))) {
            alert("Não foi possível localizar sua publicação.");
            return;
        }

        const meusPosts = posts.filter(post => donoDoPost(post, usuario));
        const limite = LIMITES_POSTS[plano];

        if (!existente && meusPosts.length >= limite) {
            alert(
                `Seu plano ${plano} permite ` +
                `${limite === Infinity ? "posts ilimitados" : limite + " posts"}. ` +
                "Mude de plano para publicar mais."
            );
            return;
        }

        const contato = $("postContato").value.trim();
        const numero = telefoneWhatsApp(contato);

        if (!numero) {
            alert(
                "Informe um número brasileiro válido com DDD, " +
                "por exemplo: 49999999999."
            );
            return;
        }

        const post = {
            id: existente ? existente.id : (
                "post_" + Date.now() + "_" +
                Math.random().toString(36).slice(2, 8)
            ),
            email: usuario.email,
            nome: $("postNome").value.trim(),
            categoria: $("postCategoria").value,
            titulo: $("postTitulo").value.trim(),
            descricao: $("postDescricao").value.trim(),
            contato: contato,
            imagem: imagemSelecionada ||
                (existente ? existente.imagem || null : null),
            plano: plano,
            visualizacoes: existente
                ? Number(existente.visualizacoes) || 0
                : 0,
            criadoEm: existente ? existente.criadoEm : new Date().toISOString()
        };

        if (!post.nome || !post.titulo || !post.descricao) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const atualizados = existente
            ? posts.map(item => item.id === post.id ? post : item)
            : [post, ...posts];

        if (!salvarPosts(atualizados)) return;

        resetarFormulario();
        fecharModal("modalPost");
        mostrarPosts();

        alert(existente
            ? "Publicação atualizada com sucesso!"
            : "Publicação criada com sucesso!"
        );
    });

    // Botão para criar post na área da conta.
    // Este evento evita abrir o formulário sem login ou plano.
    $("botaoCriarPost")?.addEventListener("click", function () {
        const usuario = usuarioAtual();

        if (!usuario) {
            alert("Entre na sua conta primeiro.");
            return;
        }

        if (!nomePlano(usuario)) {
            alert("Escolha um plano antes de publicar.");
            fecharModal("modalConta");
            $("planos")?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        resetarFormulario();
        fecharModal("modalConta");
        abrirModal("modalPost");
    });

    // Botão de fechar o modal de publicação.
    $("fecharPost")?.addEventListener("click", function () {
        fecharModal("modalPost");
        resetarFormulario();
    });

    // Atualiza a lista quando a página abre.
    document.addEventListener("DOMContentLoaded", mostrarPosts);

    // Permite que o restante do site atualize os cards após login.
    window.atualizarPostsImpulso = mostrarPosts;
    // Permite gerenciar posts pela janela "Meus posts".
    window.editarPostImpulso = editarPost;
    window.excluirPostImpulso = excluirPost;

    // Executa também caso este script seja carregado após o evento DOMContentLoaded.
    mostrarPosts();

})();





/* =========================================
   SISTEMA DE PLANOS - IMPULSO MKT
========================================= */

const PLANOS_IMPULSO = {
    basico: {
        nome: "Básico",
        limitePosts: 3,
        prioridade: 1,
        destaque: false,
        ilimitado: false,
        recursos: {
            publicar: true,
            editar: true,
            excluir: true,
            destaqueVisual: false,
            prioridadeBusca: false,
            estatisticas: false,
            seloPremium: false
        }
    },

    destaque: {
        nome: "Destaque",
        limitePosts: 10,
        prioridade: 2,
        destaque: true,
        ilimitado: false,
        recursos: {
            publicar: true,
            editar: true,
            excluir: true,
            destaqueVisual: true,
            prioridadeBusca: true,
            estatisticas: true,
            seloPremium: false
        }
    },

    premium: {
        nome: "Premium",
        limitePosts: Infinity,
        prioridade: 3,
        destaque: true,
        ilimitado: true,
        recursos: {
            publicar: true,
            editar: true,
            excluir: true,
            destaqueVisual: true,
            prioridadeBusca: true,
            estatisticas: true,
            seloPremium: true
        }
    }
};

/* Obtém o usuário conectado */
function usuarioAtualImpulso() {
    try {
        return JSON.parse(
            localStorage.getItem("impulsoUsuarioLogado") || "null"
        );
    } catch {
        return null;
    }
}

/* Normaliza o nome do plano */
function normalizarPlanoImpulso(plano) {
    const nome = String(plano || "basico")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (nome.includes("premium")) return "premium";
    if (nome.includes("destaque")) return "destaque";

    return "basico";
}

/* Descobre o plano do usuário */
function planoAtualImpulso() {
    const usuario = usuarioAtualImpulso();

    if (!usuario) return "basico";

    return normalizarPlanoImpulso(
        usuario.plano || usuario.assinatura || "basico"
    );
}

/* Retorna a configuração do plano */
function configuracaoPlanoImpulso(plano) {
    return PLANOS_IMPULSO[normalizarPlanoImpulso(plano)];
}

/* Conta os posts de um usuário */
function contarPostsUsuarioImpulso(email) {
    const posts = JSON.parse(
        localStorage.getItem("impulsoPosts") || "[]"
    );

    return posts.filter(post =>
        String(post.email || post.usuarioEmail || post.autorEmail || "")
            .toLowerCase() === String(email || "").toLowerCase()
    ).length;
}

/* Verifica se pode publicar */
function podePublicarImpulso() {
    const usuario = usuarioAtualImpulso();

    if (!usuario || !usuario.email) {
        return {
            permitido: false,
            mensagem: "Entre na sua conta para publicar."
        };
    }

    const plano = planoAtualImpulso();
    const config = configuracaoPlanoImpulso(plano);
    const quantidade = contarPostsUsuarioImpulso(usuario.email);

    if (quantidade >= config.limitePosts) {
        return {
            permitido: false,
            mensagem: `Você atingiu o limite de ${config.limitePosts} publicações do plano ${config.nome}. Faça um upgrade para publicar mais.`
        };
    }

    return {
        permitido: true,
        mensagem: "",
        quantidade,
        limite: config.limitePosts,
        plano
    };
}

/* Exibe o uso de publicações */
function atualizarLimitePostsImpulso() {
    const usuario = usuarioAtualImpulso();
    const elemento = document.getElementById("limite-posts");

    if (!elemento) return;

    if (!usuario || !usuario.email) {
        elemento.textContent = "Entre na conta para ver seu limite.";
        return;
    }

    const plano = planoAtualImpulso();
    const config = configuracaoPlanoImpulso(plano);
    const quantidade = contarPostsUsuarioImpulso(usuario.email);

    elemento.textContent = config.ilimitado
        ? `${quantidade} publicações utilizadas · Ilimitado`
        : `${quantidade} de ${config.limitePosts} publicações utilizadas`;
}

/* Bloqueia visualmente recursos indisponíveis */
function atualizarRecursosImpulso() {
    const plano = planoAtualImpulso();
    const recursos = configuracaoPlanoImpulso(plano).recursos;

    document.querySelectorAll("[data-recurso]").forEach(elemento => {
        const recurso = elemento.dataset.recurso;
        const liberado = recursos[recurso] === true;

        elemento.classList.toggle("recurso-bloqueado", !liberado);
        elemento.setAttribute("aria-disabled", String(!liberado));

        if ("disabled" in elemento && elemento.tagName !== "A") {
            elemento.disabled = !liberado;
        }

        let aviso = elemento.querySelector(".aviso-plano");

        if (!liberado) {
            if (!aviso) {
                aviso = document.createElement("span");
                aviso.className = "aviso-plano";
                aviso.textContent = " 🔒 Recurso indisponível no seu plano";
                elemento.appendChild(aviso);
            }
        } else if (aviso) {
            aviso.remove();
        }
    });
}

/* Ordem: Premium > Destaque > Básico */
function ordenarPostsImpulso(posts) {
    return [...posts].sort((a, b) => {
        const prioridadeA =
            configuracaoPlanoImpulso(a.plano).prioridade;
        const prioridadeB =
            configuracaoPlanoImpulso(b.plano).prioridade;

        if (prioridadeA !== prioridadeB) {
            return prioridadeB - prioridadeA;
        }

        return new Date(b.criadoEm || 0) -
               new Date(a.criadoEm || 0);
    });
}

/* Inicializa os indicadores */
document.addEventListener("DOMContentLoaded", () => {
    atualizarLimitePostsImpulso();
    atualizarRecursosImpulso();
});


/* =====================================================
   SISTEMA DE BUSCA - IMPULSO MKT (CORRIGIDO)
===================================================== */

(function () {
    "use strict";

    function normalizar(texto) {
        return String(texto ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function obterPosts() {
        try {
            const dados = JSON.parse(
                localStorage.getItem("impulsoPosts") || "[]"
            );

            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error("Erro ao carregar publicações:", erro);
            return [];
        }
    }

    function iniciarBusca() {
        const campo = document.getElementById("campoBusca");
        const categoria = document.getElementById("filtroCategoria");
        const cidade = document.getElementById("filtroCidade");
        const servico = document.getElementById("filtroServico");
        const plano = document.getElementById("filtroPlano");
        const avaliacao = document.getElementById("filtroAvaliacao");

        const botaoBuscar = document.getElementById("btnBuscar");
        const botaoLimpar = document.getElementById("btnLimparBusca");
        const contador = document.getElementById("quantidadeResultados");

        const areaPosts = document.getElementById("areaPosts");

        if (!campo || !areaPosts) {
            console.error(
                "Busca: confira os IDs campoBusca e areaPosts no HTML."
            );
            return;
        }

        function valorFiltro(elemento) {
            const valor = normalizar(elemento?.value || "");

            // Opções que significam "não filtrar".
            if (["", "todos", "todas", "qualquer"].includes(valor)) {
                return "";
            }

            return valor;
        }

function filtrar() {
    const posts = obterPosts();

    const termo = normalizar(campo.value);
    const cat = valorFiltro(categoria);
    const cid = valorFiltro(cidade);
    const tipoServico = valorFiltro(servico);
    const tipoPlano = valorFiltro(plano);
    const notaMinima = Number(avaliacao?.value || 0);

    // Verifica se o visitante realizou alguma pesquisa.
    const pesquisando =
        termo !== "" ||
        cat !== "" ||
        cid !== "" ||
        tipoServico !== "" ||
        tipoPlano !== "" ||
        notaMinima > 0;

    const resultados = posts.filter(function (post) {
        // Identifica o plano do profissional.
        const planoPost = normalizar(post.plano)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const ehPremium = planoPost === "premium";

        // Sem pesquisa, mostra somente os Premium.
        if (!pesquisando && !ehPremium) {
            return false;
        }

        const textoCompleto = normalizar([
            post.nome,
            post.empresa,
            post.titulo,
            post.descricao,
            post.categoria,
            post.servico,
            post.tipoServico,
            post.profissao,
            post.especialidade,
            post.cidade,
            post.regiao,
            post.localizacao,
            post.bairro,
            post.estado
        ].join(" "));

        // Pesquisa por nome, empresa, serviço ou descrição.
        if (termo && !textoCompleto.includes(termo)) {
            return false;
        }

        // Categoria.
        if (
            cat &&
            !normalizar(post.categoria).includes(cat)
        ) {
            return false;
        }

        // Cidade ou região.
        const localizacao = normalizar([
            post.cidade,
            post.regiao,
            post.localizacao,
            post.bairro,
            post.estado
        ].join(" "));

        if (cid && !localizacao.includes(cid)) {
            return false;
        }

        // Tipo de serviço.
        const servicosPost = normalizar([
            post.servico,
            post.tipoServico,
            post.profissao,
            post.especialidade,
            post.titulo,
            post.descricao
        ].join(" "));

        if (
            tipoServico &&
            !servicosPost.includes(tipoServico)
        ) {
            return false;
        }

        // Plano selecionado.
        const planoFiltro = tipoPlano
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (planoFiltro && planoPost !== planoFiltro) {
            return false;
        }

        // Nota mínima.
        if (notaMinima > 0) {
            const nota = Number(
                post.avaliacao ??
                post.avaliacaoMedia ??
                post.nota ??
                post.estrelas ??
                0
            );

            if (nota < notaMinima) {
                return false;
            }
        }

        return true;
    });

    // Premium primeiro, depois Destaque e Básico.
    const prioridade = {
        premium: 3,
        destaque: 2,
        basico: 1
    };

    resultados.sort(function (a, b) {
        const planoA = normalizar(a.plano)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const planoB = normalizar(b.plano)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        return (prioridade[planoB] || 0) -
               (prioridade[planoA] || 0);
    });

    // Mostra ou esconde os cards já existentes.
    const ids = new Set(
        resultados.map(post => String(post.id))
    );

    const cards = areaPosts.querySelectorAll(
        ".post[data-post-id]"
    );

    cards.forEach(function (card) {
        const id = card.getAttribute("data-post-id");

        card.style.display = ids.has(String(id))
            ? ""
            : "none";
    });

    // Atualiza a mensagem de resultados.
    if (contador) {
        contador.textContent = resultados.length === 0
            ? "Nenhum profissional ou empresa encontrado."
            : resultados.length +
              (resultados.length === 1
                  ? " resultado encontrado."
                  : " resultados encontrados.");
    }

    window.resultadosBuscaImpulso = resultados;

    console.log("Resultados da busca:", resultados);
}

        function limpar() {
            campo.value = "";

            [categoria, cidade, servico, plano, avaliacao]
                .forEach(function (filtro) {
                    if (filtro) filtro.value = "";
                });

            filtrar();
        }

        // Busca pelo botão.
        if (botaoBuscar) {
            botaoBuscar.addEventListener("click", function (evento) {
                evento.preventDefault();
                filtrar();
            });
        }

        // Limpa todos os filtros.
        if (botaoLimpar) {
            botaoLimpar.addEventListener("click", function (evento) {
                evento.preventDefault();
                limpar();
            });
        }

        // Enter pesquisa; demais campos atualizam os resultados.
        campo.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
                filtrar();
            }
        });

        campo.addEventListener("input", filtrar);

        [categoria, cidade, servico, plano, avaliacao]
            .forEach(function (filtro) {
                if (filtro) {
                    filtro.addEventListener("change", filtrar);
                }
            });

        // Torna a função disponível para testes e atualizações.
        window.filtrarPerfisImpulso = filtrar;

        filtrar();

        console.log("Sistema de busca do Impulso MKT iniciado.");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarBusca,
            { once: true }
        );
    } else {
        iniciarBusca();
    }
})();



/* =====================================================
   IMPULSO MKT - JANELA MEUS POSTS
===================================================== */

(function () {
    "use strict";

    const botao = document.getElementById("botaoMeusPosts");

    if (!botao) {
        console.warn("Botão botaoMeusPosts não encontrado.");
        return;
    }

    // Cria a janela sem precisar alterar o HTML.
    const modal = document.createElement("div");
    modal.className = "modal modal-meus-posts-impulso";
    modal.id = "modalMeusPostsImpulso";

    modal.innerHTML = `
        <div class="meus-posts-painel" role="dialog"
             aria-modal="true" aria-labelledby="tituloMeusPosts">

            <div class="meus-posts-cabecalho">
                <div>
                    <h2 id="tituloMeusPosts">📂 Meus posts</h2>
                    <p>Gerencie suas publicações.</p>
                </div>

                <button type="button"
                        class="meus-posts-fechar"
                        aria-label="Fechar">✕</button>
            </div>

            <div class="meus-posts-lista"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const lista = modal.querySelector(".meus-posts-lista");

    function lerUsuario() {
        try {
            return JSON.parse(
                localStorage.getItem("impulsoUsuarioLogado") || "null"
            );
        } catch {
            return null;
        }
    }

    function lerPosts() {
        try {
            const posts = JSON.parse(
                localStorage.getItem("impulsoPosts") || "[]"
            );

            return Array.isArray(posts) ? posts : [];
        } catch {
            return [];
        }
    }

    function escapar(texto) {
        const elemento = document.createElement("span");
        elemento.textContent = String(texto ?? "");
        return elemento.innerHTML;
    }

    function pertenceAoUsuario(post, usuario) {
        const emailPost = String(
            post.email || post.usuarioEmail || post.autorEmail || ""
        ).toLowerCase();

        const emailUsuario = String(usuario.email || "").toLowerCase();

        const mesmoEmail =
            emailPost !== "" &&
            emailUsuario !== "" &&
            emailPost === emailUsuario;

        const mesmoId =
            post.usuarioId != null &&
            usuario.id != null &&
            String(post.usuarioId) === String(usuario.id);

        return mesmoEmail || mesmoId;
    }

    function fecharMeusPosts() {
        modal.classList.remove("ativo");
        modal.style.display = "none";

        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    }

    function abrirMeusPosts() {
        const usuario = lerUsuario();

        if (!usuario) {
            alert("Entre na sua conta primeiro.");
            return;
        }

        renderizarPosts();

        // Fecha os outros modais.
        document.querySelectorAll(".modal").forEach(function (outro) {
            if (outro !== modal) {
                outro.classList.remove("ativo");
                outro.style.display = "none";
            }
        });

        modal.classList.add("ativo");
        modal.style.display = "flex";

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    }

    function renderizarPosts() {
        const usuario = lerUsuario();

        if (!usuario) {
            lista.textContent = "Entre na sua conta para ver seus posts.";
            return;
        }

        const meusPosts = lerPosts().filter(function (post) {
            return pertenceAoUsuario(post, usuario);
        });

        lista.replaceChildren();

        if (meusPosts.length === 0) {
            const vazio = document.createElement("div");
            vazio.className = "meus-posts-vazio";

            vazio.innerHTML = `
                <div class="meus-posts-icone">📢</div>
                <h3>Você ainda não tem publicações</h3>
                <p>Crie seu primeiro post para divulgar seu trabalho.</p>
            `;

            lista.appendChild(vazio);
            return;
        }

        const contador = document.createElement("p");
        contador.className = "meus-posts-contador";
        contador.textContent =
            `${meusPosts.length} publicação(ões) encontrada(s)`;

        lista.appendChild(contador);

        meusPosts.forEach(function (post) {
            const card = document.createElement("article");
            card.className = "meus-posts-card";

            const informacoes = document.createElement("div");
            informacoes.className = "meus-posts-informacoes";

            const titulo = document.createElement("h3");
            titulo.textContent = post.titulo || "Publicação sem título";

            const categoria = document.createElement("p");
            categoria.textContent =
                `${post.categoria || "Outros"} · ${post.plano || "Básico"}`;

            const descricao = document.createElement("p");
            descricao.className = "meus-posts-descricao";
            descricao.textContent = post.descricao || "";

            informacoes.append(titulo, categoria, descricao);

            const acoes = document.createElement("div");
            acoes.className = "meus-posts-acoes";

            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "meus-posts-editar";
            editar.textContent = "✏️ Editar";

            editar.addEventListener("click", function () {
                if (typeof window.editarPostImpulso !== "function") {
                    alert("A função de edição não foi encontrada.");
                    return;
                }

                window.editarPostImpulso(post.id);
            });

            const excluir = document.createElement("button");
            excluir.type = "button";
            excluir.className = "meus-posts-excluir";
            excluir.textContent = "🗑️ Excluir";

            excluir.addEventListener("click", function () {
                if (typeof window.excluirPostImpulso !== "function") {
                    alert("A função de exclusão não foi encontrada.");
                    return;
                }

                window.excluirPostImpulso(post.id);

                // Atualiza a lista depois da confirmação de exclusão.
                renderizarPosts();
            });

            acoes.append(editar, excluir);
            card.append(informacoes, acoes);
            lista.appendChild(card);
        });
    }

    botao.addEventListener("click", abrirMeusPosts);

    modal.querySelector(".meus-posts-fechar")
        .addEventListener("click", fecharMeusPosts);

    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            fecharMeusPosts();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && modal.classList.contains("ativo")) {
            fecharMeusPosts();
        }
    });

    // Permite atualizar a janela após editar uma publicação.
    window.atualizarMeusPostsImpulso = renderizarPosts;

})();


function atualizarCategoriasImpulso() {
    const filtroCategoria = document.getElementById("filtroCategoria");

    if (!filtroCategoria) return;

    const posts = JSON.parse(
        localStorage.getItem("impulsoPosts") || "[]"
    );

    // Guarda a categoria atualmente selecionada
    const categoriaSelecionada = filtroCategoria.value;

    // Extrai categorias existentes e elimina duplicatas
    const categorias = [
        ...new Set(
            posts
                .map(post => (post.categoria || "").trim())
                .filter(categoria => categoria.length > 0)
                .map(categoria => ({
                    original: categoria,
                    normalizada: categoria.toLocaleLowerCase("pt-BR")
                }))
                .reduce((lista, categoria) => {
                    if (!lista.some(
                        item => item.normalizada === categoria.normalizada
                    )) {
                        lista.push(categoria);
                    }
                    return lista;
                }, [])
                .map(categoria => categoria.original)
        )
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));

    // Reconstrói o filtro
    filtroCategoria.innerHTML =
        '<option value="">Todas as categorias</option>';

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;
        filtroCategoria.appendChild(opcao);
    });

    // Mantém a seleção, se a categoria ainda existir
    const categoriaMantida = categorias.find(
        categoria =>
            categoria.toLocaleLowerCase("pt-BR") ===
            categoriaSelecionada.toLocaleLowerCase("pt-BR")
    );

    if (categoriaMantida) {
        filtroCategoria.value = categoriaMantida;
    }
    window.atualizarCategoriasImpulso = atualizarCategoriasImpulso;
}

// Atualiza quando o HTML estiver carregado
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        atualizarCategoriasImpulso
    );
} else {
    atualizarCategoriasImpulso();
}



/* IMPULSO MKT — FILTRO DE CONTEÚDO INADEQUADO */


/* IMPULSO MKT — FILTRO AMPLIADO DE CONTEÚDO */

function verificarConteudoInadequado(formulario) {
    const normalizar = texto =>
        String(texto || "")
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .trim()
            .replace(/\s+/g, " ");

    // Expressões inadequadas: é possível acrescentar outras aqui.
    const expressoesProibidas = [
        // Conteúdo sexual explícito
        "sexo explicito",
        "servicos sexuais",
        "servico sexual",
        "exploracao sexual",
        "conteudo pornografico",
        "filme pornografico",
        "venda de nudes",

        // Violência e ameaças
        "ameaca de morte",
        "matar uma pessoa",
        "contratar assassino",
        "incentivo ao suicidio",
        "tortura de pessoas",

        // Drogas e atividades ilegais
        "venda de drogas ilicitas",
        "trafico de drogas",
        "venda de armas ilegais",
        "documentos falsos",
        "dinheiro falso",

        // Golpes e fraudes
        "golpe financeiro",
        "fraude bancaria",
        "roubo de identidade",
        "roubar senhas",
        "hackear contas",
        "dinheiro garantido sem fazer nada",

        // Assédio e discriminação
        "ameacar uma pessoa",
        "perseguir uma pessoa",
        "discurso de odio"
    ];

    // Palavras isoladas que indicam possível conteúdo inadequado.
    // Evite termos ambíguos para reduzir bloqueios indevidos.
    const palavrasProibidas = [
        // Sexual
        "pornografia",
        "pornografico",
        "pornografica",
        "prostituicao",
        "nudes",
        "estupro",
        "estuprar",

        // Ofensas e palavrões comuns
        "caralho",
        "porra",
        "merda",
        "buceta",
        "putaria",
        "foder",
        "fodase",
        "arrombado",
        "arrombada",

        // Violência
        "assassinar",
        "assassinato",
        "tortura",
        "decapitar",

        // Atividades ilegais
        "estelionato",
        "extorsao",
        "sequestro"
    ];

    if (!formulario || !formulario.elements) {
        return false;
    }

    // Analisa os campos textuais do formulário.
    const campos = Array.from(formulario.elements).filter(campo => {
        if (campo.disabled) return false;

        return (
            campo.tagName === "TEXTAREA" ||
            campo.tagName === "SELECT" ||
            ["text", "search", "url", "email", "tel"].includes(campo.type)
        );
    });

    for (const campo of campos) {
        const texto = normalizar(campo.value);

        if (!texto) continue;

        // Procura expressões completas.
        const encontrouExpressao = expressoesProibidas.some(expressao =>
            texto.includes(normalizar(expressao))
        );

        if (encontrouExpressao) {
            return true;
        }

        // Procura palavras isoladas, sem bloquear partes de outras palavras.
        const palavras = new Set(texto.split(" "));

        const encontrouPalavra = palavrasProibidas.some(palavra =>
            palavras.has(normalizar(palavra))
        );

        if (encontrouPalavra) {
            return true;
        }
    }

    return false;
}


/* =====================================================
   RECORTE DA FOTO DE PERFIL
===================================================== */

(function () {

    const fotoPerfil = document.getElementById("fotoPerfil");
    const modalRecorte = document.getElementById("modalRecorteFoto");
    const imagemRecorte = document.getElementById("imagemRecorte");
    const viewport = document.getElementById("recorteViewport");
    const zoomFoto = document.getElementById("zoomFoto");

    const fecharRecorte =
        document.getElementById("fecharRecorteFoto");

    const cancelarRecorte =
        document.getElementById("cancelarRecorte");

    const salvarRecorte =
        document.getElementById("salvarRecorte");


    if (
        !fotoPerfil ||
        !modalRecorte ||
        !imagemRecorte ||
        !viewport ||
        !zoomFoto
    ) {
        return;
    }


    let imagemOriginal = null;

    let posicaoX = 0;
    let posicaoY = 0;

    let arrastando = false;

    let inicioX = 0;
    let inicioY = 0;


    /* =================================================
       ESCOLHER FOTO
    ================================================= */

    fotoPerfil.addEventListener("change", function (event) {

        const arquivo = event.target.files[0];

        if (!arquivo) return;


        if (!arquivo.type.startsWith("image/")) {

            alert("Escolha uma imagem válida.");

            return;
        }


        const leitor = new FileReader();


        leitor.onload = function (e) {

            imagemOriginal = e.target.result;

            imagemRecorte.src = imagemOriginal;


            posicaoX = 0;
            posicaoY = 0;

            zoomFoto.value = "1";


            imagemRecorte.onload = function () {

                ajustarImagemInicial();

                atualizarImagem();

            };


            modalRecorte.style.display = "flex";

        };


        leitor.readAsDataURL(arquivo);

    });


    /* =================================================
       AJUSTE INICIAL
    ================================================= */

    function ajustarImagemInicial() {

        const largura =
            imagemRecorte.naturalWidth;

        const altura =
            imagemRecorte.naturalHeight;


        const tamanhoViewport =
            viewport.clientWidth;


        /*
         * Faz a menor dimensão da imagem
         * preencher o círculo.
         */

        if (largura > altura) {

            imagemRecorte.style.height =
                tamanhoViewport + "px";

            imagemRecorte.style.width =
                "auto";

        } else {

            imagemRecorte.style.width =
                tamanhoViewport + "px";

            imagemRecorte.style.height =
                "auto";
        }


        centralizarImagem();

    }


    function centralizarImagem() {

        const largura =
            imagemRecorte.getBoundingClientRect().width;

        const altura =
            imagemRecorte.getBoundingClientRect().height;


        posicaoX =
            (viewport.clientWidth - largura) / 2;

        posicaoY =
            (viewport.clientHeight - altura) / 2;

    }


    /* =================================================
       ATUALIZAR IMAGEM
    ================================================= */

    function atualizarImagem() {

        const zoom =
            Number(zoomFoto.value);


        imagemRecorte.style.transform =
            `translate(${posicaoX}px, ${posicaoY}px) scale(${zoom})`;

    }


    /* =================================================
       ZOOM
    ================================================= */

    zoomFoto.addEventListener("input", function () {

        atualizarImagem();

    });


    /* =================================================
       ARRASTAR COM MOUSE
    ================================================= */

    viewport.addEventListener("mousedown", function (event) {

        arrastando = true;

        inicioX = event.clientX - posicaoX;
        inicioY = event.clientY - posicaoY;

    });


    window.addEventListener("mousemove", function (event) {

        if (!arrastando) return;


        posicaoX =
            event.clientX - inicioX;

        posicaoY =
            event.clientY - inicioY;


        atualizarImagem();

    });


    window.addEventListener("mouseup", function () {

        arrastando = false;

    });


    /* =================================================
       TOUCH / CELULAR
    ================================================= */

    viewport.addEventListener(
        "touchstart",
        function (event) {

            const toque = event.touches[0];

            arrastando = true;

            inicioX =
                toque.clientX - posicaoX;

            inicioY =
                toque.clientY - posicaoY;

        },
        { passive: true }
    );


    viewport.addEventListener(
        "touchmove",
        function (event) {

            if (!arrastando) return;

            const toque = event.touches[0];

            posicaoX =
                toque.clientX - inicioX;

            posicaoY =
                toque.clientY - inicioY;

            atualizarImagem();

        },
        { passive: true }
    );


    viewport.addEventListener(
        "touchend",
        function () {

            arrastando = false;

        }
    );


    /* =================================================
       SALVAR FOTO
    ================================================= */

    salvarRecorte.addEventListener(
        "click",
        function () {

            const tamanho =
                viewport.clientWidth;


            const canvas =
                document.createElement("canvas");

            canvas.width = tamanho;
            canvas.height = tamanho;


            const contexto =
                canvas.getContext("2d");


            const zoom =
                Number(zoomFoto.value);


            const imagem =
                imagemRecorte;


            const larguraOriginal =
                imagem.naturalWidth;

            const alturaOriginal =
                imagem.naturalHeight;


            /*
             * Descobre o tamanho exibido
             * antes do zoom.
             */

            const larguraExibida =
                imagem.getBoundingClientRect().width / zoom;

            const alturaExibida =
                imagem.getBoundingClientRect().height / zoom;


            const escalaX =
                larguraOriginal / larguraExibida;

            const escalaY =
                alturaOriginal / alturaExibida;


            const xImagem =
                posicaoX / zoom;


            const yImagem =
                posicaoY / zoom;


            contexto.drawImage(
                imagem,
                -xImagem * escalaX,
                -yImagem * escalaY,
                larguraOriginal,
                alturaOriginal,
                0,
                0,
                tamanho,
                tamanho
            );


            const fotoFinal =
                canvas.toDataURL(
                    "image/jpeg",
                    0.90
                );


            salvarFotoPerfil(fotoFinal);

            fecharModalRecorte();

        }
    );


    /* =================================================
       SALVAR NO PERFIL
    ================================================= */

    function salvarFotoPerfil(foto) {

        const avatar =
            document.getElementById("avatarConta");


        if (avatar) {

            avatar.innerHTML =
                `<img src="${foto}" alt="Foto de perfil">`;

        }


        /*
         * Salva temporariamente no usuário logado.
         */

        const usuario =
            JSON.parse(
                localStorage.getItem(
                    "impulsoUsuarioLogado"
                )
            );


        if (!usuario) return;


        usuario.fotoPerfil = foto;


        localStorage.setItem(
            "impulsoUsuarioLogado",
            JSON.stringify(usuario)
        );


        /*
         * Atualiza também o cadastro
         * do usuário.
         */

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    "impulsoUsuarios"
                )
            ) || [];


        const indice =
            usuarios.findIndex(
                item =>
                    String(item.id) ===
                    String(usuario.id)
            );


        if (indice !== -1) {

            usuarios[indice].fotoPerfil =
                foto;

            localStorage.setItem(
                "impulsoUsuarios",
                JSON.stringify(usuarios)
            );

        }

    }


    /* =================================================
       FECHAR
    ================================================= */

    function fecharModalRecorte() {

        modalRecorte.style.display = "none";

        fotoPerfil.value = "";

    }


    fecharRecorte.addEventListener(
        "click",
        fecharModalRecorte
    );


    cancelarRecorte.addEventListener(
        "click",
        fecharModalRecorte
    );


})();

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





/* =====================================================
   MOSTRAR POSTS
===================================================== */

function mostrarPosts() {

    const postsExistentes =
        areaPosts.querySelectorAll(
            ".post"
        );


    postsExistentes.forEach(
        function (post) {

            post.remove();

        }
    );


    if (posts.length === 0) {

        semPosts.style.display =
            "block";

        return;

    }


    semPosts.style.display =
        "none";


    /*
       PRIMEIRO OS POSTS PREMIUM,
       DEPOIS DESTAQUE,
       DEPOIS BÁSICO
    */

    const postsOrdenados =
        [...posts].sort(
            function (a, b) {

                if (
                    a.premium &&
                    !b.premium
                ) {

                    return -1;

                }


                if (
                    a.destaque &&
                    !b.destaque
                ) {

                    return -1;

                }


                return 0;

            }
        );


    postsOrdenados.forEach(
        function (post) {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "post";


                elemento.dataset.postId = 
                String(post.id);

            /*
               CLASSES DO PLANO
            */

            if (post.premium) {

                elemento.classList.add(
                    "post-premium"
                );

            } else if (
                post.destaque
            ) {

                elemento.classList.add(
                    "post-destaque"
                );

            }


            const iniciais =
                post.nome
                .split(" ")
                .map(
                    function (palavra) {

                        return palavra
                            .charAt(0)
                            .toUpperCase();

                    }
                )
                .slice(0, 2)
                .join("");


            let selo =
                "";


            if (post.premium) {

                selo = `
                    <span class="selo-post premium">
                        ★ PREMIUM
                    </span>
                `;

            } else if (
                post.destaque
            ) {

                selo = `
                    <span class="selo-post destaque">
                        ★ DESTAQUE
                    </span>
                `;

            }


            elemento.innerHTML = `

                ${selo}

                <div class="post-topo">

                    <div class="post-avatar">
                        ${iniciais}
                    </div>

                    <div>

                        <div class="post-autor">
                            ${escaparHTML(
                                post.nome
                            )}
                        </div>

                        <span class="post-categoria">
                            ${escaparHTML(
                                post.categoria
                            )}
                        </span>

                    </div>

                </div>


                <h3>
                    ${escaparHTML(
                        post.titulo
                    )}
                </h3>


                <p class="post-descricao">
                    ${escaparHTML(
                        post.descricao
                    )}
                </p>


                <div class="post-contato">

                    <strong>
                        Contato:
                    </strong>

                    ${escaparHTML(
                        post.contato
                    )}

                </div>

            `;


            areaPosts.appendChild(
                elemento
            );

        }
    );

}


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

            return true;
        } catch {
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

            const numeroWhatsApp = telefoneWhatsApp(contato);

            const contatoHTML = numeroWhatsApp
                ? `<a class="post-whatsapp"
                      href="https://wa.me/${numeroWhatsApp}"
                      target="_blank"
                      rel="noopener noreferrer">
                      Conversar pelo WhatsApp
                   </a>`
                : `<p class="post-descricao">
                       Contato indisponível ou número inválido.
                   </p>`;

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

                <p class="post-descricao">
                    ${escaparHTML(descricao)}
                </p>

                <div class="post-estatisticas">
                    👁️ <span class="contador-views">${views}</span>
                    visualizações
                </div>

                <div class="post-acoes">
                    <button type="button" class="post-ver">
                        Ver publicação
                    </button>

                    ${contatoHTML}

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

                    postsAtuais[indice].visualizacoes =
                        (Number(postsAtuais[indice].visualizacoes) || 0) + 1;

                    if (!salvarPosts(postsAtuais)) return;

                    card.querySelector(".contador-views").textContent =
                        postsAtuais[indice].visualizacoes;

                    alert(
                        titulo + "\n\n" +
                        descricao + "\n\n" +
                        "Visualizações: " +
                        postsAtuais[indice].visualizacoes
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
   AVALIAÇÕES COM MEIA ESTRELA - IMPULSO MKT
===================================================== */

(function () {
    "use strict";

    const CHAVE_POSTS = "impulsoPosts";
    const CHAVE_AVALIACOES = "impulsoAvaliacoes";

    function ler(chave) {
        try {
            const dados = JSON.parse(localStorage.getItem(chave) || "[]");
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error("Erro ao ler dados:", erro);
            return [];
        }
    }

    function salvar(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    }

    function obterAvaliacoes(idPost) {
        return ler(CHAVE_AVALIACOES).filter(
            item => String(item.postId) === String(idPost)
        );
    }

    function atualizarMedia(idPost) {
        const avaliacoes = obterAvaliacoes(idPost);
        const media = avaliacoes.length
            ? avaliacoes.reduce((soma, item) => soma + item.nota, 0)
                / avaliacoes.length
            : 0;

        const posts = ler(CHAVE_POSTS);
        const post = posts.find(
            item => String(item.id) === String(idPost)
        );

        if (post) {
            post.avaliacaoMedia = Number(media.toFixed(2));
            post.totalAvaliacoes = avaliacoes.length;
            salvar(CHAVE_POSTS, posts);
        }

        return { media, total: avaliacoes.length };
    }

    function desenharEstrelas(nota) {
        return [1, 2, 3, 4, 5].map(numero => {
            let classe = "";

            if (nota >= numero) {
                classe = "estrela-cheia";
            } else if (nota >= numero - 0.5) {
                classe = "estrela-meia";
            }

            return `<span class="estrela-visual ${classe}">★</span>`;
        }).join("");
    }

    function criarAreaAvaliacao(post) {
        if (post.querySelector(".avaliacoes-impulso")) return;

        const idPost = post.getAttribute("data-post-id");
        if (!idPost) return;

        const resumo = atualizarMedia(idPost);

        const area = document.createElement("section");
        area.className = "avaliacoes-impulso";

        area.innerHTML = `
            <hr>
            <h3>Avaliações</h3>

            <div class="resumo-avaliacao">
                <strong class="media-numero">${resumo.media.toFixed(1)}</strong>
                <div class="estrelas-resumo">
                    ${desenharEstrelas(resumo.media)}
                </div>
                <span class="total-avaliacoes">
                    (${resumo.total} ${
                        resumo.total === 1 ? "avaliação" : "avaliações"
                    })
                </span>
            </div>

            <form class="form-avaliacao" data-post-id="${idPost}">
                <label>Escolha sua nota:</label>

                <div class="seletor-estrelas">
                    ${[1, 2, 3, 4, 5].map(numero => `
                        <div class="estrela-par" aria-label="${numero} estrela(s)">
                            <button
                                type="button"
                                class="estrela-avaliacao metade-esquerda"
                                data-nota="${numero - 0.5}"
                                aria-label="${numero - 0.5} estrelas"
                                aria-pressed="false"
                            ><span>★</span></button>
                            <button
                                type="button"
                                class="estrela-avaliacao metade-direita"
                                data-nota="${numero}"
                                aria-label="${numero} estrelas"
                                aria-pressed="false"
                            ><span>★</span></button>
                        </div>
                    `).join("")}
                </div>

                <p class="nota-escolhida">Nenhuma nota selecionada.</p>

                <label>Seu comentário:</label>
                <textarea
                    name="comentario"
                    rows="3"
                    maxlength="500"
                    placeholder="Conte como foi sua experiência..."
                    required
                ></textarea>

                <button type="submit" class="btn-enviar-avaliacao">
                    Enviar avaliação
                </button>
            </form>

            <div class="lista-comentarios"></div>
        `;

        post.appendChild(area);
        mostrarComentarios(area, idPost);
    }

    function mostrarComentarios(area, idPost) {
        const lista = area.querySelector(".lista-comentarios");
        lista.replaceChildren();

        obterAvaliacoes(idPost).slice().reverse().forEach(item => {
            const bloco = document.createElement("div");
            bloco.className = "comentario-avaliacao";

            const estrelas = document.createElement("div");
            estrelas.className = "estrelas-comentario";
            estrelas.innerHTML = desenharEstrelas(item.nota);

            const nota = document.createElement("p");
            nota.textContent = item.nota.toFixed(1) + " / 5";

            const comentario = document.createElement("p");
            comentario.textContent = item.comentario;

            bloco.append(estrelas, nota, comentario);
            lista.appendChild(bloco);
        });
    }

    function atualizarResumo(area, idPost) {
        const resumo = atualizarMedia(idPost);

        area.querySelector(".media-numero").textContent =
            resumo.media.toFixed(1);

        area.querySelector(".estrelas-resumo").innerHTML =
            desenharEstrelas(resumo.media);

        area.querySelector(".total-avaliacoes").textContent =
            `(${resumo.total} ${
                resumo.total === 1 ? "avaliação" : "avaliações"
            })`;
    }

    function iniciar() {
        const areaPosts = document.getElementById("areaPosts");

        if (!areaPosts) {
            console.error("Avaliações: não encontrei #areaPosts.");
            return;
        }

        function atualizarAreas() {
            areaPosts.querySelectorAll(".post[data-post-id]")
                .forEach(criarAreaAvaliacao);
        }

        atualizarAreas();

        const observador = new MutationObserver(atualizarAreas);
        observador.observe(areaPosts, {
            childList: true,
            subtree: true
        });

        areaPosts.addEventListener("click", function (evento) {
            const botao = evento.target.closest(".estrela-avaliacao");
            if (!botao) return;

            const formulario = botao.closest(".form-avaliacao");
            const nota = Number(botao.dataset.nota);

            formulario.dataset.nota = String(nota);

            formulario.querySelectorAll(".estrela-avaliacao")
                .forEach(estrela => {
                    const valor = Number(estrela.dataset.nota);
                    const selecionada = valor <= nota;

                    estrela.classList.toggle("selecionada", selecionada);
                    estrela.setAttribute(
                        "aria-pressed",
                        String(valor === nota)
                    );
                });

            formulario.querySelector(".nota-escolhida").textContent =
                nota.toFixed(1).replace(".", ",") + " de 5 estrelas.";
        });

        areaPosts.addEventListener("submit", function (evento) {
            const formulario = evento.target.closest(".form-avaliacao");
            if (!formulario) return;

            evento.preventDefault();

            const nota = Number(formulario.dataset.nota);
            const comentario = formulario.elements.comentario.value.trim();
            const idPost = formulario.dataset.postId;

            if (!nota || nota < 0.5 || nota > 5 || nota * 2 % 1 !== 0) {
                alert("Escolha uma nota entre 0,5 e 5 estrelas.");
                return;
            }

            if (!comentario) {
                alert("Escreva um comentário antes de enviar.");
                return;
            }

            const avaliacoes = ler(CHAVE_AVALIACOES);

            avaliacoes.push({
                id: Date.now().toString() +
                    Math.random().toString(36).slice(2),
                postId: idPost,
                nota,
                comentario,
                data: new Date().toISOString()
            });

            try {
                salvar(CHAVE_AVALIACOES, avaliacoes);
            } catch (erro) {
                console.error("Erro ao salvar avaliação:", erro);
                alert("Não foi possível salvar a avaliação.");
                return;
            }

            const card = formulario.closest(".post");
            const area = card.querySelector(".avaliacoes-impulso");

            atualizarResumo(area, idPost);
            mostrarComentarios(area, idPost);

            formulario.reset();
            delete formulario.dataset.nota;

            formulario.querySelectorAll(".estrela-avaliacao")
                .forEach(estrela => {
                    estrela.classList.remove("selecionada");
                    estrela.setAttribute("aria-pressed", "false");
                });

            formulario.querySelector(".nota-escolhida").textContent =
                "Nenhuma nota selecionada.";

            if (typeof window.filtrarPerfisImpulso === "function") {
                window.filtrarPerfisImpulso();
            }

            alert("Avaliação enviada com sucesso!");
        });

        console.log("Avaliações com meia estrela iniciadas!");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
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

const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => [...base.querySelectorAll(seletor)];

/* ---------- Ano do rodapé ---------- */
$("#ano").textContent = new Date().getFullYear();

/* ---------- Barra superior: ganha fundo ao rolar ---------- */
const header = $("#header");
const atualizarHeader = () =>
  header.classList.toggle("scrolled", window.scrollY > 24);
atualizarHeader();
window.addEventListener("scroll", atualizarHeader, { passive: true });

/* ---------- Menu no celular ---------- */
const botaoMenu = $(".menu-toggle");
const menu = $("#menu");

function abrirMenu(abrir) {
  menu.classList.toggle("open", abrir);
  botaoMenu.setAttribute("aria-expanded", String(abrir));
  botaoMenu.textContent = abrir ? "Fechar" : "Menu";
}

botaoMenu.addEventListener("click", () =>
  abrirMenu(!menu.classList.contains("open"))
);
menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) abrirMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") abrirMenu(false);
});

/* ---------- Destaque do link da seção visível ---------- */
const links = $$(".nav a");
// inclui #contato (que não é um link do nav) para limpar o destaque ao chegar nele
const secoes = [...links.map((a) => $(a.getAttribute("href"))), $("#contato")].filter(Boolean);

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const id = "#" + entrada.target.id;
      links.forEach((a) => {
        if (a.getAttribute("href") === id) {
          a.setAttribute("aria-current", "location");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // considera a faixa do meio da tela
);
secoes.forEach((secao) => observador.observe(secao));

/* ---------- Posts: visualizador de imagem ---------- */
const lightbox = $("#lightbox");
const imagemAmpliada = $("img", lightbox);

$$(".post").forEach((botao) => {
  botao.addEventListener("click", () => {
    const miniatura = $("img", botao);
    imagemAmpliada.src = miniatura.src;
    imagemAmpliada.alt = miniatura.alt;
    lightbox.showModal();
  });
});

// clicar fora da imagem (ou no botão Fechar) fecha
lightbox.addEventListener("click", (e) => {
  if (e.target !== imagemAmpliada) lightbox.close();
});

/* ---------- Modelos: botões do carrossel ---------- */
const trilho = $("#models");

$$("[data-scroll]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const item = $(".model", trilho);
    const passo = item.offsetWidth + 20; // largura do card + espaço
    trilho.scrollBy({
      left: Number(botao.dataset.scroll) * passo,
      behavior: "smooth",
    });
  });
});

/* ---------- Formulário: abre o app de e-mail ---------- */
const formulario = $("#contact-form");
const aviso = $("#form-status");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const { nome, email, mensagem } = formulario.elements;
  // o e-mail de destino é o mesmo do link "mailto:" da seção de contato
  const destino = $("#email-link").getAttribute("href").replace("mailto:", "");

  const assunto = `Contato pelo portfólio: ${nome.value}`;
  const corpo = `${mensagem.value}\n\nDe: ${nome.value} (${email.value})`;

  window.location.href =
    `mailto:${destino}?subject=${encodeURIComponent(assunto)}` +
    `&body=${encodeURIComponent(corpo)}`;

  aviso.textContent = "Abrindo seu aplicativo de e-mail...";
});

/* Lightbox mínimo para a galeria. Sem dependências.
   Teclado: Esc fecha, setas navegam. */
(function () {
  "use strict";

  var galerias = document.querySelectorAll("[data-galeria]");
  if (!galerias.length) return;

  var caixa = document.createElement("div");
  caixa.className = "ep-lightbox";
  caixa.setAttribute("role", "dialog");
  caixa.setAttribute("aria-modal", "true");
  caixa.setAttribute("aria-label", "Foto ampliada");
  caixa.innerHTML =
    '<button class="ep-lightbox__fechar" aria-label="Fechar">&times;</button>' +
    '<button class="ep-lightbox__nav ep-lightbox__nav--ant" aria-label="Foto anterior">&#8249;</button>' +
    '<button class="ep-lightbox__nav ep-lightbox__nav--prox" aria-label="Próxima foto">&#8250;</button>' +
    "<figure><img alt=\"\" /><figcaption></figcaption></figure>";
  document.body.appendChild(caixa);

  var img = caixa.querySelector("img");
  var legenda = caixa.querySelector("figcaption");
  var botoes = [];
  var atual = 0;
  var focoAnterior = null;

  function mostrar(i) {
    if (i < 0) i = botoes.length - 1;
    if (i >= botoes.length) i = 0;
    atual = i;
    var b = botoes[i];
    img.src = b.dataset.grande;
    img.alt = b.dataset.legenda;
    legenda.textContent = b.dataset.legenda;
  }

  function abrir(i) {
    focoAnterior = document.activeElement;
    caixa.classList.add("aberto");
    document.body.style.overflow = "hidden";
    mostrar(i);
    caixa.querySelector(".ep-lightbox__fechar").focus();
  }

  function fechar() {
    caixa.classList.remove("aberto");
    document.body.style.overflow = "";
    img.src = "";
    if (focoAnterior) focoAnterior.focus();
  }

  galerias.forEach(function (g) {
    var locais = Array.prototype.slice.call(g.querySelectorAll("button"));
    locais.forEach(function (b) {
      var indice = botoes.length;
      botoes.push(b);
      b.addEventListener("click", function () {
        abrir(indice);
      });
    });
  });

  caixa.querySelector(".ep-lightbox__fechar").addEventListener("click", fechar);
  caixa
    .querySelector(".ep-lightbox__nav--ant")
    .addEventListener("click", function () {
      mostrar(atual - 1);
    });
  caixa
    .querySelector(".ep-lightbox__nav--prox")
    .addEventListener("click", function () {
      mostrar(atual + 1);
    });

  caixa.addEventListener("click", function (e) {
    if (e.target === caixa) fechar();
  });

  document.addEventListener("keydown", function (e) {
    if (!caixa.classList.contains("aberto")) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });
})();


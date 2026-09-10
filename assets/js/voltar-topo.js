/* Botão "voltar ao topo": aparece depois de rolar a página,
   some quando está perto do topo de novo. */
(function () {
  "use strict";

  var botao = document.getElementById("ep-topo");
  if (!botao) return;

  var LIMIAR = 500; // pixels rolados até o botão aparecer

  function atualizar() {
    if (window.scrollY > LIMIAR) {
      botao.classList.add("ep-topo--visivel");
    } else {
      botao.classList.remove("ep-topo--visivel");
    }
  }

  window.addEventListener("scroll", atualizar, { passive: true });
  atualizar();

  botao.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


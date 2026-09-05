/* Menu inteligente: se o link tem data-ancora e a pessoa já
   está na home, rola suavemente até a seção em vez de recarregar
   a página. Em qualquer outra página, o link navega normalmente
   — nada é removido, só interceptado condicionalmente. */
(function () {
  "use strict";

  var links = document.querySelectorAll("[data-ancora]");
  if (!links.length) return;

  links.forEach(function (link) {
    link.addEventListener("click", function (evento) {
      var estaNaHome = window.location.pathname === "/";
      if (!estaNaHome) return; // deixa navegar normalmente para /ensino/

      var alvo = document.getElementById(link.dataset.ancora);
      if (!alvo) return; // não achou a seção nesta página; navega normal

      evento.preventDefault();
      alvo.scrollIntoView({ behavior: "smooth", block: "start" });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", "#" + link.dataset.ancora);
      }
    });
  });
})();


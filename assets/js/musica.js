/* Botão de música de fundo — só toca se a pessoa clicar.
   Nunca toca sozinho (autoplay é bloqueado pelos navegadores de
   propósito, e ninguém gosta de ser surpreendido por som). */
(function () {
  "use strict";

  var audio = document.getElementById("ep-musica");
  var botao = document.getElementById("ep-botao-musica");
  if (!audio || !botao) return;

  botao.addEventListener("click", function () {
    if (audio.paused) {
      audio.play().catch(function () {
        // navegador recusou tocar (ex.: ainda sem interação) — ignora
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", function () {
    botao.classList.add("ep-botao-musica--tocando");
    botao.setAttribute("aria-pressed", "true");
    botao.setAttribute("aria-label", "Pausar música de fundo");
  });

  audio.addEventListener("pause", function () {
    botao.classList.remove("ep-botao-musica--tocando");
    botao.setAttribute("aria-pressed", "false");
    botao.setAttribute("aria-label", "Tocar música de fundo");
  });
})();


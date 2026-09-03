# ==============================================================
# borrar.R — apoio à diretriz de privacidade da proposta:
# "por padrão, o rosto das crianças aparece desfocado/borrado
# nas fotos publicadas no site".
#
# POR QUE ISSO É MANUAL
# Detecção automática de rostos erra: deixa rosto passar em foto
# de grupo, perfil, criança de costas parcialmente virada. Aqui o
# custo de um erro é a privacidade de uma criança, então a conferência
# tem que ser humana. Estas funções aplicam o borrão numa região
# que VOCÊ indica, e mostram o resultado para conferir antes de salvar.
# ==============================================================

library(magick)

#' Mostra a foto com uma grade de coordenadas, para você localizar os rostos
#'
#' @param arquivo caminho da imagem
grade <- function(arquivo) {
  img <- image_read(arquivo)
  info <- image_info(img)
  message("Dimensões: ", info$width, " x ", info$height)
  message("Use essas coordenadas em borrar_regiao(): x e y contam ",
          "do canto superior esquerdo.")
  print(img)
  invisible(info)
}

#' Borra uma região retangular da imagem
#'
#' @param arquivo caminho da imagem de entrada
#' @param x,y canto superior esquerdo da região
#' @param largura,altura tamanho da região
#' @param intensidade quanto borrar (padrão 25 — bem forte)
#' @param saida caminho de saída; NULL = sobrescreve o original
borrar_regiao <- function(arquivo, x, y, largura, altura,
                          intensidade = 25, saida = NULL) {
  img <- image_read(arquivo)

  regiao <- image_crop(img, geometry_area(largura, altura, x, y))
  regiao <- image_blur(regiao, radius = intensidade, sigma = intensidade)

  img <- image_composite(img, regiao, offset = geometry_point(x, y))

  if (is.null(saida)) saida <- arquivo
  image_write(img, saida)
  message("salvo: ", saida)
  print(img)
  invisible(saida)
}

# Exemplo de uso:
#
#   grade("content/vida-no-pequi/rotina.jpg")
#   borrar_regiao("content/vida-no-pequi/rotina.jpg",
#                 x = 420, y = 180, largura = 120, altura = 140)
#
# Para várias regiões na mesma foto, chame borrar_regiao() em
# sequência — cada chamada salva por cima.


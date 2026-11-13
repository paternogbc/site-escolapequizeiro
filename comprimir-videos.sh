#!/usr/bin/env bash
# ==============================================================
# comprimir-videos.sh
# Escola Waldorf Rural Pequizeiro
#
# Comprime todos os .mp4 dentro de assets/video/, SEM reduzir a
# resolução — só melhora a compressão (H.264, sem áudio, já que os
# vídeos do site tocam mudos em loop).
#
# Para cada vídeo:
#   1. Comprime para um arquivo temporário
#   2. Só substitui o original se o resultado for MENOR
#   3. Guarda uma cópia do original em assets/video/originais/,
#      por segurança, antes de qualquer substituição
#
# COMO USAR
#   Precisa ter o ffmpeg instalado (brew install ffmpeg no Mac, ou
#   baixar em ffmpeg.org).
#
#   Salve este arquivo na raiz do projeto e rode:
#     bash comprimir-videos.sh
# ==============================================================

set -euo pipefail

PASTA="assets/video"
PASTA_ORIGINAIS="$PASTA/originais"
CRF=23   # qualidade: 18-23 = visualmente sem perda; quanto maior, mais leve e mais perda

if ! command -v ffmpeg &> /dev/null; then
  echo "❌ ffmpeg não encontrado. Instale com: brew install ffmpeg (Mac) ou veja ffmpeg.org"
  exit 1
fi

if [ ! -d "$PASTA" ]; then
  echo "❌ Pasta $PASTA não encontrada. Rode este script na raiz do projeto."
  exit 1
fi

mkdir -p "$PASTA_ORIGINAIS"

encontrou_algum=false

for video in "$PASTA"/*.mp4; do
  [ -e "$video" ] || continue  # nenhum .mp4 encontrado
  encontrou_algum=true

  nome=$(basename "$video")
  temporario="${video%.mp4}.temp.mp4"

  tamanho_antes=$(du -h "$video" | cut -f1)
  echo ""
  echo "🎬 Comprimindo $nome (atual: $tamanho_antes)..."

  ffmpeg -i "$video" \
    -c:v libx264 -crf "$CRF" -preset slow \
    -an \
    -movflags +faststart \
    -y -loglevel error \
    "$temporario"

  tamanho_novo_bytes=$(stat -f%z "$temporario" 2>/dev/null || stat -c%s "$temporario")
  tamanho_antigo_bytes=$(stat -f%z "$video" 2>/dev/null || stat -c%s "$video")

  if [ "$tamanho_novo_bytes" -lt "$tamanho_antigo_bytes" ]; then
    # guarda o original antes de sobrescrever, por segurança
    cp "$video" "$PASTA_ORIGINAIS/$nome"
    mv "$temporario" "$video"
    tamanho_depois=$(du -h "$video" | cut -f1)
    echo "✅ $nome: $tamanho_antes -> $tamanho_depois (original guardado em $PASTA_ORIGINAIS/$nome)"
  else
    rm "$temporario"
    echo "⚠️  $nome: a compressão não ficou menor que o original — mantido sem alteração."
  fi
done

if [ "$encontrou_algum" = false ]; then
  echo "Nenhum arquivo .mp4 encontrado em $PASTA/"
fi

echo ""
echo "Pronto. Depois de conferir que os vídeos continuam bons, pode apagar"
echo "a pasta $PASTA_ORIGINAIS/ para não deixar os arquivos grandes no projeto."
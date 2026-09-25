# As duas famílias vendorizadas

Ambas estão sob a **SIL Open Font License 1.1**, que permite redistribuir o arquivo junto do
projeto — foi por isso que elas entraram no lugar das equivalentes da Microsoft (Segoe UI
Variable e Constantia), que ficaram melhores na comparação mas **não podem ser redistribuídas**.

| arquivo                     | família         | autor                          |
| --------------------------- | --------------- | ------------------------------ |
| `inter-*.woff2`             | Inter           | Rasmus Andersson               |
| `source-serif-*.woff2`      | Source Serif 4  | Frank Grießhammer / Adobe      |

São **fontes variáveis**: um arquivo cobre toda a faixa de peso, então os dois pesos do
projeto (400 e 700) não custam dois downloads. Cada família vem em dois recortes — `latin` e
`latin-ext` —, e o `unicode-range` do `@font-face` faz o navegador baixar o segundo só se a
página precisar dele.

Texto integral da licença: <https://openfontlicense.org/>

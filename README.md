# MALVA — Ateliê de moda autoral

Vitrine digital e base de controle de estoque de um ateliê de moda
feminina. As peças são vendidas em **série curta**: cada modelagem
existe em poucas unidades, em mais de um banho de cor e em vários
tamanhos — e é essa combinação que o estoque controla.

- **Disciplina:** Análise e Projeto de Sistemas · **Professor:** Samarlon
- **Entrega:** 30/09/2026

---

## Documentação

| Documento | Conteúdo |
|---|---|
| [01 — Requisitos](docs/01-requisitos.md) | 37 requisitos funcionais, 18 não funcionais, 8 regras de negócio e a rastreabilidade requisito × tela |
| [02 — Diagramas UML](docs/02-diagramas.md) | Casos de uso, classes, objetos, interação, atividades e sequência |
| [03 — Modelo de dados](docs/03-modelo-de-dados.md) | MER conceitual, DER lógico, dicionário de dados, normalização e o script SQL |

Os diagramas estão em Mermaid e são desenhados pelo próprio GitHub ao
abrir os arquivos — não é preciso instalar nada para vê-los.

---

## As sete telas

| Tela | Rota | O que faz |
|---|---|---|
| Início | `/` | Herói, vitrine, peça em volume 3D, editorial e manifesto |
| Acervo | `/colecao` | Grade com filtro por categoria e ordenação |
| Ficha da peça | `/produto/:slug` | Foto, desenho técnico e volume 3D girável; cor, tamanho e sacola |
| Lookbook | `/lookbook` | Editorial comandado pela rolagem |
| O ateliê | `/atelie` | Manifesto, linha do tempo e visita |
| **Cadastro** | `/cadastro` | **Formulário de cliente com 22 campos** |
| Provador | `/provador` | Agendamento de prova em três etapas |

A sacola é uma gaveta lateral, disponível em todas as telas.

### O formulário de cadastro

São **22 campos**, todos visíveis numa tela só, em quatro blocos:

| Bloco | Campos |
|---|---|
| 01 Dados pessoais | nome, CPF, nascimento, e-mail, telefone, tratamento |
| 02 Endereço | CEP, logradouro, número, complemento, bairro, cidade, estado |
| 03 Preferências | tamanho, estilos, como conheceu, canal de contato, observações |
| 04 Acesso | senha, confirmação, aceite dos termos, novidades |

A validação é real: o CPF é conferido pelos dois dígitos verificadores
(e sequências de algarismo repetido são recusadas), a idade mínima é 16
anos, a UF é conferida contra a lista dos 27 estados, e a senha exige 8
caracteres misturando letras e números, com confirmação idêntica.

---

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5180
```

Outros comandos:

```bash
npm run build    # verifica os tipos e gera o pacote de produção em dist/
npm run preview  # serve o build de produção
npm run lint     # apenas a verificação de tipos
```

---

## Como foi construído

| Camada | Escolha |
|---|---|
| Interface | React 18 + TypeScript em modo estrito |
| Empacotador | Vite 6 |
| Rotas | React Router 6 |
| Animação | Framer Motion |
| 3D | Three.js com React Three Fiber, carregado sob demanda |
| Estilo | CSS Modules sobre um sistema de design próprio (`src/styles/tokens.css`) |

### Organização

```
src/
├── components/
│   ├── art/        arte gerada: silhuetas paramétricas, fita de seda, transição de fotos
│   ├── form/       campo, seleção, marcação e régua de etapas
│   ├── layout/     cabeçalho, rodapé, sacola, véu de transição
│   ├── product/    cartão de peça
│   ├── sections/   herói
│   ├── three/      cenas 3D
│   └── ui/         botão, revelação de texto, faixa, marca
├── context/        estado da sacola
├── data/           acervo, looks e conteúdo do ateliê
├── hooks/          consultas de mídia e trava de rolagem
├── lib/            modelagem paramétrica, formatação, validação do cadastro e do provador
├── pages/          as sete telas
├── styles/         tokens e fundações
└── types/          contratos do catálogo
```

### Observações

As fotografias das peças (20 imagens, uma por peça × banho de cor) foram
**geradas**, não fotografadas: servem como maquete para a vitrine. Numa
loja real, entram as fotos das peças de verdade. O volume 3D não é um
modelo escaneado: é a modelagem paramétrica girada em torno do eixo,
vestida com um retalho de tecido recortado da própria fotografia.

O repositório entrega a camada de apresentação. Persistência,
autenticação e as funções de estoque estão especificadas nos documentos
e modeladas no banco, mas ainda não executam — a coluna "situação" de
[docs/01-requisitos.md](docs/01-requisitos.md) diz exatamente o que está
pronto e o que está projetado.

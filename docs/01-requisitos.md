# Requisitos — Sistema MALVA

Sistema de vitrine e controle de estoque de um ateliê de moda feminina.
O acervo é vendido em **série curta**: cada modelagem existe em poucas
unidades, em mais de um banho de cor e em vários tamanhos — e é essa
combinação (peça × cor × tamanho) que o estoque precisa controlar.

- **Disciplina:** Análise e Projeto de Sistemas
- **Professor:** Samarlon
- **Entrega:** 30/09/2026

> **Coluna "situação"** — o repositório entrega a camada de apresentação
> (as sete telas, navegáveis e validadas no navegador). Os requisitos que
> dependem de servidor e banco estão especificados e modelados, mas ainda
> não executam. A coluna diz exatamente em que pé está cada um, para não
> haver dúvida sobre o que foi construído e o que foi projetado.

---

## 1. Escopo

O sistema atende três públicos:

| Ator | O que faz |
|---|---|
| **Visitante** | Percorre o acervo e o lookbook sem se identificar |
| **Cliente** | Abre ficha, compra, acompanha pedidos e agenda o provador |
| **Atendente** | Conduz a prova e registra o atendimento no ateliê |
| **Gerente de estoque** | Cadastra peças, repõe grade e acompanha o giro |

---

## 2. Requisitos Funcionais (RF)

Prioridade: **E** essencial · **I** importante · **D** desejável.
Situação: **✔** implementado · **◐** parcial · **○** previsto.

### 2.1 Catálogo e vitrine

| ID | Requisito | Pri. | Sit. |
|---|---|:--:|:--:|
| RF01 | O sistema deve exibir o acervo de peças com nome, subtítulo, tecido, preço e cartela de cores. | E | ✔ |
| RF02 | O sistema deve permitir filtrar o acervo por categoria (vestidos, alfaiataria, blusas, sob medida). | E | ✔ |
| RF03 | O sistema deve permitir ordenar o acervo por curadoria, preço crescente, preço decrescente e tamanho da série. | I | ✔ |
| RF04 | O sistema deve exibir a ficha da peça com descrição, tecido, origem do fio, notas do ateliê e tamanho da série. | E | ✔ |
| RF05 | O sistema deve exibir a peça em três modos: fotografia, desenho técnico e volume 3D girável. | D | ✔ |
| RF06 | O sistema deve trocar a fotografia exibida quando a cliente seleciona outro banho de cor. | I | ✔ |
| RF07 | O sistema deve apresentar peças relacionadas na ficha de cada peça. | D | ✔ |
| RF08 | O sistema deve exibir o lookbook editorial com a peça de cada look e o link para a sua ficha. | D | ✔ |

### 2.2 Sacola e pedido

| ID | Requisito | Pri. | Sit. |
|---|---|:--:|:--:|
| RF09 | O sistema deve permitir adicionar uma peça à sacola informando cor e tamanho. | E | ✔ |
| RF10 | O sistema deve impedir a adição à sacola sem que um tamanho tenha sido escolhido. | E | ✔ |
| RF11 | O sistema deve permitir alterar a quantidade e remover itens da sacola. | E | ✔ |
| RF12 | O sistema deve calcular e exibir o subtotal da sacola. | E | ✔ |
| RF13 | O sistema deve limitar a cinco unidades por item, respeitando a natureza de série curta. | I | ✔ |
| RF14 | O sistema deve verificar a disponibilidade em estoque da variação antes de confirmar o pedido. | E | ○ |
| RF15 | O sistema deve registrar o pedido e dar baixa no estoque da variação vendida. | E | ○ |
| RF16 | O sistema deve permitir à cliente consultar o histórico dos seus pedidos. | I | ○ |

### 2.3 Cadastro e conta

| ID | Requisito | Pri. | Sit. |
|---|---|:--:|:--:|
| RF17 | O sistema deve permitir o cadastro de cliente com dados pessoais, endereço de entrega, preferências e credenciais de acesso. | E | ✔ |
| RF18 | O sistema deve validar o CPF pelos dois dígitos verificadores e recusar sequências de algarismo repetido. | E | ✔ |
| RF19 | O sistema deve recusar cadastro de menor de 16 anos. | E | ✔ |
| RF20 | O sistema deve exigir senha de no mínimo 8 caracteres, misturando letras e números, com confirmação idêntica. | E | ✔ |
| RF21 | O sistema deve exigir o aceite dos termos de uso antes de concluir o cadastro. | E | ✔ |
| RF22 | O sistema deve indicar quais campos impedem a conclusão e conduzir a cliente até o primeiro deles. | I | ✔ |
| RF23 | O sistema deve impedir o cadastro de CPF ou e-mail já existentes. | E | ○ |
| RF24 | O sistema deve autenticar a cliente por e-mail e senha. | E | ○ |
| RF25 | O sistema deve permitir a recuperação de senha por e-mail. | I | ○ |

### 2.4 Provador privado

| ID | Requisito | Pri. | Sit. |
|---|---|:--:|:--:|
| RF26 | O sistema deve permitir agendar uma prova informando dia, horário e número de acompanhantes. | E | ✔ |
| RF27 | O sistema deve permitir marcar quais peças do acervo serão separadas na arara. | E | ✔ |
| RF28 | O sistema deve recusar datas anteriores ao dia seguinte, domingos e segundas-feiras. | E | ✔ |
| RF29 | O sistema deve limitar a sala a quatro pessoas. | I | ✔ |
| RF30 | O sistema deve emitir um protocolo de agendamento ao final. | I | ✔ |
| RF31 | O sistema deve impedir a marcação de um horário já ocupado. | E | ○ |

### 2.5 Estoque e administração

| ID | Requisito | Pri. | Sit. |
|---|---|:--:|:--:|
| RF32 | O sistema deve manter o estoque por **variação** — a combinação de peça, cor e tamanho. | E | ○ |
| RF33 | O sistema deve registrar toda movimentação de estoque (entrada, venda, devolução, ajuste, perda) com data, motivo e responsável. | E | ○ |
| RF34 | O sistema deve permitir ao gerente cadastrar, editar e desativar peças, cores e tamanhos. | E | ○ |
| RF35 | O sistema deve avisar quando a grade de uma variação atingir o estoque mínimo. | I | ○ |
| RF36 | O sistema deve emitir relatório de posição de estoque e de peças mais vendidas. | D | ○ |
| RF37 | O sistema deve encerrar a série quando a última unidade sair, marcando a modelagem como arquivada. | I | ○ |

---

## 3. Requisitos Não Funcionais (RNF)

| ID | Categoria | Requisito | Sit. |
|---|---|---|:--:|
| RNF01 | Desempenho | A rolagem deve se manter fluida em todas as telas. Medido no build de produção: 39–60 quadros por segundo, com no máximo duas tarefas longas por página. | ✔ |
| RNF02 | Desempenho | A página deve transferir menos de 400 KB. Medido: 123–295 KB por rota. | ✔ |
| RNF03 | Desempenho | A biblioteca 3D só deve ser carregada quando a cena entra na tela, nunca no primeiro carregamento. | ✔ |
| RNF04 | Usabilidade | O layout deve funcionar de 390 px a 1440 px de largura, sem rolagem horizontal. | ✔ |
| RNF05 | Usabilidade | Mensagens de erro devem dizer o que fazer, em português, junto do campo que as originou. | ✔ |
| RNF06 | Acessibilidade | Todo controle deve ser operável por teclado e ter nome acessível. | ✔ |
| RNF07 | Acessibilidade | O sistema deve respeitar `prefers-reduced-motion`, reduzindo ou suprimindo as animações. | ✔ |
| RNF08 | Acessibilidade | Campos inválidos devem ser marcados com `aria-invalid` e descritos por `aria-describedby`. | ✔ |
| RNF09 | Manutenibilidade | O código deve ser tipado em TypeScript em modo estrito, compilando sem erros nem avisos. | ✔ |
| RNF10 | Manutenibilidade | A interface deve ser dividida em componentes reutilizáveis, com estilos isolados por CSS Modules. | ✔ |
| RNF11 | Portabilidade | O sistema deve funcionar nas versões correntes de Chrome, Firefox, Edge e Safari. | ◐ |
| RNF12 | Localização | Valores, datas e máscaras devem seguir o padrão brasileiro (BRL, dd/mm/aaaa, CPF, CEP, DDD). | ✔ |
| RNF13 | Segurança | Senhas devem ser guardadas apenas como hash, com algoritmo de custo ajustável (bcrypt ou argon2). Nunca em texto puro. | ○ |
| RNF14 | Segurança | Toda comunicação deve trafegar sobre HTTPS. | ○ |
| RNF15 | Segurança | O acesso às funções de estoque deve exigir autenticação e perfil de gerente. | ○ |
| RNF16 | Privacidade | O sistema deve registrar o aceite dos termos com data e hora, e permitir à cliente pedir a exclusão dos seus dados (LGPD, art. 18). | ◐ |
| RNF17 | Confiabilidade | Toda validação feita no navegador deve ser repetida no servidor, que é a autoridade final. | ○ |
| RNF18 | Integridade | O banco deve garantir por restrição que não exista estoque negativo nem variação duplicada. | ○ |

---

## 4. Regras de negócio (RN)

| ID | Regra |
|---|---|
| RN01 | Nenhuma modelagem passa de 60 unidades. Encerrada a série, ela é arquivada e não retorna. |
| RN02 | A unidade de estoque é a variação: peça + cor + tamanho. Duas cores da mesma peça são estoques distintos. |
| RN03 | O ateliê atende de terça a sábado, das 10h às 19h, somente com hora marcada. |
| RN04 | A sala do provador comporta no máximo quatro pessoas, a cliente incluída. |
| RN05 | A prova é agendada com pelo menos um dia de antecedência, para a arara ser separada. |
| RN06 | Cadastro a partir de 16 anos. |
| RN07 | Peças da linha sob medida não têm grade: são produzidas por encomenda, após duas provas. |
| RN08 | O conserto é vitalício e gratuito para peças saídas do ateliê. |

---

## 5. Rastreabilidade — requisito × tela

| Tela | Rota | Requisitos atendidos |
|---|---|---|
| Início | `/` | RF01, RF05, RF08 |
| Acervo | `/colecao` | RF01, RF02, RF03 |
| Ficha da peça | `/produto/:slug` | RF04, RF05, RF06, RF07, RF09, RF10 |
| Lookbook | `/lookbook` | RF08 |
| O ateliê | `/atelie` | — (institucional) |
| **Cadastro** | `/cadastro` | RF17 a RF22 |
| Provador | `/provador` | RF26 a RF30 |
| Sacola (gaveta) | — | RF11, RF12, RF13 |

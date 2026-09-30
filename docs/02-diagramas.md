# Diagramas UML — Sistema MALVA

Os seis diagramas pedidos. Todos em Mermaid, que o GitHub desenha
sozinho ao abrir este arquivo — não é preciso instalar nada.

Quatro deles (objeto, interação, atividade e sequência) percorrem a
**mesma história**: Helena abre a ficha, escolhe o Vestido Alba em
malva no tamanho M e fecha o pedido. Isso deixa claro que descrevem o
mesmo sistema visto de ângulos diferentes.

---

## 1. Diagrama de Casos de Uso

Quem usa o sistema e para quê. `«include»` marca o que sempre acontece
junto; `«extend»`, o que só acontece em certas condições.

```mermaid
flowchart LR
  visitante[Visitante]
  cliente[Cliente]
  atendente[Atendente]
  gerente[Gerente de estoque]

  subgraph sistema [Sistema MALVA]
    direction TB
    uc01(["Consultar acervo"])
    uc02(["Ver ficha da peca"])
    uc03(["Gerenciar sacola"])
    uc04(["Cadastrar-se"])
    uc05(["Autenticar-se"])
    uc06(["Finalizar pedido"])
    uc07(["Agendar provador"])
    uc08(["Validar CPF"])
    uc09(["Verificar estoque"])
    uc10(["Registrar atendimento"])
    uc11(["Repor grade"])
    uc12(["Emitir relatorio"])
    uc13(["Encerrar serie"])
  end

  visitante --> uc01
  visitante --> uc02
  visitante --> uc04

  cliente --> uc01
  cliente --> uc02
  cliente --> uc03
  cliente --> uc05
  cliente --> uc06
  cliente --> uc07

  atendente --> uc10
  gerente --> uc11
  gerente --> uc12
  gerente --> uc13

  uc04 -.->|include| uc08
  uc06 -.->|include| uc09
  uc06 -.->|include| uc05
  uc07 -.->|include| uc05
  uc13 -.->|extend| uc06
  uc10 -.->|extend| uc07
```

**Caso de uso expandido — UC06 Finalizar pedido**

| | |
|---|---|
| **Ator principal** | Cliente |
| **Pré-condição** | Sacola com ao menos um item; cliente autenticada |
| **Fluxo principal** | 1. A cliente abre a sacola. 2. Confere itens e subtotal. 3. Escolhe o endereço de entrega. 4. Confirma. 5. O sistema verifica o estoque de cada variação. 6. Registra o pedido, dá baixa na grade e emite o número. |
| **Fluxo alternativo A** | No passo 5, se a variação não tiver saldo, o sistema avisa qual peça saiu e mantém as demais na sacola. |
| **Fluxo alternativo B** | No passo 5, se a baixa zerar a grade e a série estiver completa, o sistema arquiva a modelagem (UC13). |
| **Pós-condição** | Pedido gravado, estoque reduzido e confirmação enviada por e-mail. |

---

## 2. Diagrama de Classes

O modelo do domínio. A classe central é **Variacao**: é ela, e não
Produto, que tem saldo — porque o mesmo vestido em duas cores são dois
estoques diferentes (RN02).

```mermaid
classDiagram
  class Cliente {
    -int id
    -String nome
    -String cpf
    -Date nascimento
    -String email
    -String telefone
    -String senhaHash
    -bool aceiteTermos
    +autenticar(senha) bool
    +idade() int
  }

  class Endereco {
    -int id
    -String cep
    -String logradouro
    -String numero
    -String complemento
    -String bairro
    -String cidade
    -String uf
    -bool principal
  }

  class Categoria {
    -int id
    -String nome
    -String slug
  }

  class Produto {
    -int id
    -String slug
    -String nome
    -String subtitulo
    -Decimal preco
    -String tecido
    -String origem
    -int edicao
    -bool arquivado
    +precoFormatado() String
    +totalEmEstoque() int
  }

  class Cor {
    -int id
    -String nome
    -String hex
  }

  class Tamanho {
    -int id
    -String sigla
    -int ordem
  }

  class Variacao {
    -int id
    -String sku
    -int quantidade
    -int estoqueMinimo
    +disponivel(qtd) bool
    +baixar(qtd)
    +repor(qtd)
  }

  class MovimentoEstoque {
    -int id
    -String tipo
    -int quantidade
    -String motivo
    -DateTime data
  }

  class Pedido {
    -int id
    -String numero
    -String status
    -Decimal subtotal
    -Decimal frete
    -DateTime criadoEm
    +total() Decimal
    +confirmar()
    +cancelar()
  }

  class ItemPedido {
    -int id
    -int quantidade
    -Decimal precoUnitario
    +subtotal() Decimal
  }

  class Agendamento {
    -int id
    -String protocolo
    -Date data
    -String horario
    -int acompanhantes
    -String status
    +confirmar()
  }

  class Estilo {
    -int id
    -String nome
  }

  class Funcionario {
    -int id
    -String nome
    -String papel
  }

  Cliente "1" --> "1..*" Endereco : entrega em
  Cliente "1" --> "0..*" Pedido : faz
  Cliente "1" --> "0..*" Agendamento : marca
  Cliente "*" --> "*" Estilo : se interessa por

  Categoria "1" --> "0..*" Produto : agrupa
  Produto "1" --> "1..*" Variacao : se desdobra em
  Cor "1" --> "0..*" Variacao
  Tamanho "1" --> "0..*" Variacao

  Variacao "1" --> "0..*" MovimentoEstoque : registra
  Funcionario "1" --> "0..*" MovimentoEstoque : responde por

  Pedido "1" *-- "1..*" ItemPedido : compoe
  ItemPedido "*" --> "1" Variacao : refere
  Pedido "*" --> "1" Endereco : entregue em

  Agendamento "*" --> "*" Produto : separa na arara
  Funcionario "1" --> "0..*" Agendamento : atende
```

---

## 3. Diagrama de Objetos

Um retrato do sistema num instante: o pedido da Helena, logo depois de
confirmado. Mostra os mesmos vínculos do diagrama de classes, agora com
valores.

```mermaid
classDiagram
  class helena {
    id = 1
    nome = "Helena Fontes Ribeiro"
    cpf = "111.444.777-35"
    email = "helena.fontes@exemplo.com.br"
  }
  class casa {
    id = 7
    cep = "01223-010"
    logradouro = "Rua Aurora"
    numero = "214"
    cidade = "Sao Paulo"
    uf = "SP"
  }
  class alba {
    id = 1
    slug = "vestido-alba"
    nome = "Vestido Alba"
    preco = 1890.00
    edicao = 40
  }
  class malva {
    id = 2
    nome = "Malva"
    hex = "#CF92B3"
  }
  class tamM {
    id = 3
    sigla = "M"
  }
  class varAlbaMalvaM {
    id = 14
    sku = "ALB-MLV-M"
    quantidade = 3
  }
  class pedido1042 {
    id = 1042
    numero = "MV-2026-1042"
    status = "confirmado"
    subtotal = 1890.00
  }
  class item1 {
    id = 3301
    quantidade = 1
    precoUnitario = 1890.00
  }
  class saida88 {
    id = 88
    tipo = "venda"
    quantidade = -1
    motivo = "Pedido MV-2026-1042"
  }

  helena --> casa
  helena --> pedido1042
  pedido1042 --> casa
  pedido1042 *-- item1
  item1 --> varAlbaMalvaM
  alba --> varAlbaMalvaM
  malva --> varAlbaMalvaM
  tamM --> varAlbaMalvaM
  varAlbaMalvaM --> saida88
```

> Leitura: `varAlbaMalvaM` tinha 4 unidades; a venda de uma gerou o
> movimento `saida88` e o saldo caiu para 3.

---

## 4. Diagrama de Interação (comunicação)

O mesmo pedido, agora pelo ângulo de **quem fala com quem**. A numeração
dá a ordem das mensagens — é a diferença entre o diagrama de comunicação
e o de sequência, que ordena pelo tempo, de cima para baixo.

```mermaid
flowchart TD
  cliente[":Cliente"]
  ui[":TelaSacola"]
  ctrl[":ControlePedido"]
  serv[":ServicoEstoque"]
  varia[":Variacao"]
  ped[":Pedido"]
  repo[":RepositorioPedido"]
  mail[":ServicoEmail"]

  cliente -->|"1: confirmarPedido()"| ui
  ui -->|"2: finalizar(sacola, endereco)"| ctrl
  ctrl -->|"3: verificarDisponibilidade(itens)"| serv
  serv -->|"3.1: disponivel(qtd)"| varia
  varia -->|"3.2: retorna true"| serv
  ctrl -->|"4: criar(cliente, itens)"| ped
  ctrl -->|"5: baixar(qtd)"| varia
  varia -->|"5.1: registrarMovimento(venda)"| serv
  ctrl -->|"6: salvar(pedido)"| repo
  ctrl -->|"7: enviarConfirmacao(pedido)"| mail
  ctrl -->|"8: retorna numero do pedido"| ui
  ui -->|"9: exibe confirmacao"| cliente
```

---

## 5. Diagrama de Atividades

O fluxo do **cadastro de cliente** — a tela `/cadastro`, com os 22
campos. O losango de validação é o laço que o formulário faz de verdade:
ele não avança enquanto houver pendência, e volta marcando os campos.

```mermaid
flowchart TD
  ini(( )) --> abre[Abrir formulario de cadastro]
  abre --> pessoais[Preencher dados pessoais]
  pessoais --> endereco[Preencher endereco de entrega]
  endereco --> prefs[Escolher preferencias do atelie]
  prefs --> acesso[Criar senha de acesso]
  acesso --> aceite{Aceitou os termos?}

  aceite -->|Nao| marcaAceite[Marcar o aceite como pendente]
  marcaAceite --> corrige
  aceite -->|Sim| envia[Concluir cadastro]

  envia --> valida{Validacao passou?}
  valida -->|Nao| aponta[Marcar campos invalidos e rolar ate o primeiro]
  aponta --> corrige[Corrigir os campos apontados]
  corrige --> envia

  valida -->|Sim| dupl{CPF ou e-mail ja cadastrado?}
  dupl -->|Sim| avisa[Avisar que a ficha ja existe e oferecer entrar]
  avisa --> corrige
  dupl -->|Nao| grava[Gravar cliente e endereco]

  grava --> hash[Guardar a senha como hash]
  hash --> protocolo[Gerar protocolo da ficha]
  protocolo --> email[Enviar confirmacao por e-mail]
  email --> resumo[Exibir resumo da ficha]
  resumo --> fim((( )))
```

---

## 6. Diagrama de Sequência

O mesmo caso de uso do diagrama de comunicação, ordenado no tempo. O
bloco `alt` mostra o fluxo alternativo A do UC06: a peça que saiu de
estoque entre a escolha e a confirmação.

```mermaid
sequenceDiagram
  autonumber
  actor C as Cliente
  participant UI as TelaSacola
  participant CP as ControlePedido
  participant SE as ServicoEstoque
  participant V as Variacao
  participant RP as RepositorioPedido
  participant EM as ServicoEmail

  C->>UI: confirmarPedido()
  UI->>CP: finalizar(sacola, endereco)
  CP->>SE: verificarDisponibilidade(itens)

  loop para cada item da sacola
    SE->>V: disponivel(quantidade)
    V-->>SE: saldo suficiente?
  end

  alt todas as variacoes disponiveis
    SE-->>CP: ok
    CP->>V: baixar(quantidade)
    V->>SE: registrarMovimento("venda")
    CP->>RP: salvar(pedido)
    RP-->>CP: numero do pedido
    CP->>EM: enviarConfirmacao(pedido)
    CP-->>UI: pedido confirmado
    UI-->>C: exibe numero e prazo de entrega
  else alguma variacao sem saldo
    SE-->>CP: indisponivel(item)
    CP-->>UI: erro de disponibilidade
    UI-->>C: avisa qual peca saiu e mantem as demais
  end
```

---

## Resumo

| # | Diagrama | Responde |
|---|---|---|
| 1 | Casos de uso | Quem usa o sistema e para quê |
| 2 | Classes | Que conceitos existem e como se ligam |
| 3 | Objetos | Como esses conceitos ficam preenchidos num instante |
| 4 | Interação (comunicação) | Quem conversa com quem para fechar um pedido |
| 5 | Atividades | Que caminho o cadastro percorre, com desvios e laços |
| 6 | Sequência | A mesma conversa do nº 4, ordenada no tempo |

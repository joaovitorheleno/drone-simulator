# Simulador de Encomendas em Drone — API (NestJS)

API que simula uma operação de entregas por drone em uma cidade representada por uma malha de coordenadas 2D,
alocando pedidos nos drones da frota com o **menor número de viagens possível**,
respeitando capacidade de carga (kg) e autonomia (km), e simulando cada drone
através de uma máquina de estados:

```
Idle → Carregando → Em voo → Entregando → Retornando → Idle
```

> Armazenamento em memória (sem banco de dados)

## Como executar

Pré-requisitos: Node.js 18+.

```bash
npm install
npm run start:dev
```

A API sobe em `http://localhost:3001/api`.
Documentação interativa (Swagger): `http://localhost:3001/api/docs`.

Rodar os testes unitários:

```bash
npm test
```

## Endpoints principais

| Método | Rota                          | Descrição                                                        |
| ------ | ------------------------------ | ------------------------------------------------------------------ |
| POST   | `/api/pedidos`                 | Cria um pedido `{ cliente: {x,y}, pesoKg, prioridade }` e dispara a alocação |
| GET    | `/api/pedidos`                 | Lista todos os pedidos                                             |
| GET    | `/api/entregas/rota`           | Lista as viagens (planejadas/em andamento/concluídas)              |
| GET    | `/api/entregas/:pedidoId/status` | Feedback ao cliente: quantos km faltam para a entrega            |
| GET    | `/api/drones/status`           | Status atual de todos os drones da frota                           |
| POST   | `/api/drones`                  | Cadastra um novo drone `{ nome, capacidadeKg, autonomiaKm }`       |
| GET    | `/api/obstaculos`               | Lista zonas de exclusão aérea                                      |
| POST   | `/api/obstaculos`               | Cadastra uma zona de exclusão aérea `{ nome, centro: {x,y}, raioKm }` |
| GET    | `/api/dashboard`               | Relatório: entregas realizadas, tempo médio, drone mais eficiente, mapa |

## Arquitetura

```
src/
  drones/       # Frota: cadastro e status dos drones
  orders/       # Pedidos (cliente, peso, prioridade)
  deliveries/   # Cada peça com uma única responsabilidade (ver abaixo)
  simulation/   # Algoritmo de otimização + geometria/obstáculos + bateria
  dashboard/    # Relatório consolidado
  common/       # Enums e filtro global de exceções
```

### Por que o módulo `deliveries` foi dividido

Antes, um único `DeliveriesService` decidia quando alocar pedidos, montava a
viagem, executava a máquina de estados do drone, calculava bateria e ainda
respondia ao "cadê minha entrega" — um serviço com várias razões para mudar.
Hoje cada peça tem **uma única responsabilidade**:

| Serviço                      | Responsabilidade única                                                      |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `ViagensService`               | Armazenar e consultar viagens (o "banco" em memória)                          |
| `FilaProcessamentoService`     | Decidir **quando/o que** alocar: pega pendentes + drones livres, chama o `AllocationService`, registra a viagem e dispara o voo |
| `DroneFlightService`           | Executar a máquina de estados de **uma** viagem já planejada (Carregando → Em voo → Entregando → Retornando → Idle) |
| `BatteryService` (em `simulation/`) | Calcular e aplicar o consumo de bateria por trecho                       |
| `DeliveryTrackingService`      | Responder "quantos km faltam" para um pedido (somente leitura)                |

`FilaProcessamentoService` chama `DroneFlightService.executar(viagem)` e,
quando a viagem termina, volta a chamar a si mesmo para pegar a próxima leva
de pedidos — sem que o executor de voo precise saber nada sobre fila ou
alocação. O `DeliveriesController` apenas delega para o serviço certo em
cada rota; nenhuma lógica de negócio mora nele.

### Algoritmo de alocação (`simulation/allocation.service.ts`)

1. Ordena os pedidos pendentes por **prioridade** (alta → média → baixa) e,
   dentro da mesma prioridade, pelos **mais próximos da base**.
2. Para cada drone disponível (do maior para o menor porte), monta **uma
   viagem** por vez usando inserção de menor custo (*cheapest insertion*):
   a cada pedido candidato, testa em qual posição da rota ele encaixa
   gerando o menor acréscimo de distância, e só o aceita se o peso
   acumulado e a distância total da rota continuarem dentro dos limites do
   drone (capacidade/autonomia).
3. Pedidos que não couberem em nenhum drone da frota (peso ou distância
   incompatíveis com toda a frota) voltam pendentes com o motivo registrado.

Isso maximiza o aproveitamento de cada viagem (menos viagens totais),
respeitando as regras do desafio.

### Obstáculos (zonas de exclusão aérea)

Cada zona é um círculo (`centro`, `raioKm`). Se o trecho retilíneo entre dois
pontos cruza uma zona, a distância desse trecho recebe uma penalidade
(simulando o desvio pela borda da zona) — usada tanto no algoritmo de
alocação quanto no cálculo de tempo de voo.

### Máquina de estados / simulação em tempo (acelerado)

Cada viagem alocada pelo `FilaProcessamentoService` dispara
`DroneFlightService.executar(viagem)`, que avança o drone pelos estados
`Carregando → Em voo → Entregando → Retornando → Idle`, atualizando a
posição do drone e o status de cada pedido conforme o tempo simulado passa
(1km = `SIM_MS_POR_KM` ms, configurável por variável de ambiente). O consumo
de bateria em cada trecho é delegado ao `BatteryService`. Ao pousar, a
bateria é considerada recarregada automaticamente e, se pousou abaixo do
limiar (`SIM_LIMIAR_BATERIA_BAIXA`), o drone passa pelo estado
`bateria_baixa` antes de voltar a ficar `Idle`.

### Implementações

- Otimização inteligente (peso + prioridade + distância, cheapest insertion)
- Simulação orientada a eventos com estados (não é um CRUD simples)
- Simulação de bateria (consumo proporcional à distância, recarga na base)
- Obstáculos / zonas de exclusão aérea com penalidade de desvio
- Fila de entregas por prioridade + proximidade
- Feedback ao cliente (`GET /entregas/:id/status` → "faltam X km")
- APIs RESTful (`POST /pedidos`, `GET /entregas/rota`, `GET /drones/status`)
- Tratamento de erros e validações (class-validator + filtro global)
- Dashboard/relatório consolidado
- Testes automatizados (algoritmo de alocação, geometria/obstáculos,
  bateria isolada e o ciclo completo da fila + máquina de estados)

### Variáveis de ambiente (opcionais)

| Variável                  | Padrão | Descrição                                   |
| -------------------------- | ------ | -------------------------------------------- |
| `PORT`                     | 3001   | Porta da API                                  |
| `SIM_MS_CARREGAMENTO`      | 2000   | Tempo (ms) parado carregando na base           |
| `SIM_MS_POR_KM`            | 400    | Tempo (ms) de voo simulado por km             |
| `SIM_MS_ENTREGA`           | 1200   | Tempo (ms) parado entregando em cada parada   |
| `SIM_LIMIAR_BATERIA_BAIXA` | 15     | % de bateria abaixo do qual sinaliza "baixa"  |
| `SIM_MS_INTERVALO_FILA`    | 3000   | Intervalo (ms) do reprocessamento automático  |

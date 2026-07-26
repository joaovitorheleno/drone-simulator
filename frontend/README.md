# Simulador de Encomendas em Drone — Painel (React + TypeScript + styled-components)

Painel de controle ("torre de controle") para acompanhar em tempo real a
alocação de pedidos, o status da frota de drones e as rotas de entrega,
consumindo a API NestJS do mesmo desafio.

## Como executar

Pré-requisitos: Node.js 18+, e a API backend rodando em `http://localhost:3001`
(veja o README do backend).

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. As chamadas para `/api/*` são redirecionadas
para o backend via proxy do Vite (`vite.config.ts`).

## Stack

- **React 18 + TypeScript**
- **styled-components** para toda a estilização (tema centralizado em `src/styles/theme.ts`)
- **Vite** como bundler/dev server
- Sem dependências de UI de terceiros — todos os componentes (Badge, Button,
  Panel, mapa SVG) são construídos do zero

## Estrutura

```
src/
  api/client.ts            # cliente HTTP para a API
  hooks/usePolling.ts       # hook de polling (atualização em tempo quase-real)
  styles/                   # tema e estilos globais
  types/                    # tipos espelhando o domínio do backend
  components/
    Layout/                 # header + grid responsivo
    OrderForm/               # formulário de novo pedido
    OrdersQueue/             # fila de pedidos com status
    DronesGrid/              # cards da frota (bateria, capacidade, estado)
    RoutesMap/                # mapa SVG da malha da cidade (base, drones, zonas de exclusão)
    Dashboard/                # relatório consolidado
```

## Decisões de design

O painel usa uma linguagem visual minimalista: fundo claro e neutro, uma
única cor de destaque (azul) para ação/telemetria, vermelho/âmbar apenas
para sinalizar prioridade/alerta, tipografia `Inter` para texto e
`IBM Plex Mono` só para dados numéricos (coordenadas, pesos, badges). Sem
gradientes, sem glow, sombras bem discretas — o foco fica nos dados.

O mapa em `RoutesMap` continua sendo o elemento central: desenha a base, os
drones em campo, os pedidos (coloridos por prioridade) e as zonas de
exclusão aérea cadastradas, recalculando a área visível dinamicamente
conforme novos pontos entram no sistema.

Um novo drone pode ser cadastrado a qualquer momento pelo botão **"+ Novo
drone"** no cabeçalho, que abre um modal (`components/UI/Modal.tsx` +
`components/DronesGrid/DroneForm.tsx`) com o formulário de capacidade e
autonomia — sem precisar sair da tela ou usar o Swagger/curl.

Todo o estado vem da API via *polling* leve (1.5s), o que é suficiente para
acompanhar a simulação (que já roda em escala de tempo acelerada no backend)
sem a complexidade de um servidor de WebSocket.

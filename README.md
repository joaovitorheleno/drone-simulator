# Simulador de Encomendas em Drone

Desafio técnico dti digital (Enterprise Hakuna) — simulação de uma operação
de entregas por drone em áreas urbanas, com backend em **NestJS** e painel em
**React + TypeScript + styled-components**.

## Estrutura do repositório

```
drone-simulator/
  backend/
  frontend/
```

Cada pasta tem seu próprio `README.md` com instruções detalhadas.

## Rodando o projeto completo

Em dois terminais:

```bash
# terminal 1
cd backend
npm install
npm run start:dev

# terminal 2
cd frontend
npm install
npm run dev 
```

Abra `http://localhost:5173`, crie um pedido pelo formulário e acompanhe a
alocação, o estado do drone e a rota em tempo real no mapa e nos painéis.

## Resumo do que foi implementado

- Regras básicas do desafio (capacidade, autonomia, malha 2D, pedidos com
  localização/peso/prioridade) e o objetivo principal (menor número de
  viagens possível).
- Funcionalidades avançadas: bateria simulada, obstáculos/zonas de exclusão
  aérea, tempo total de entrega, fila por prioridade + proximidade.
- Diferenciais: otimização inteligente (cheapest insertion), simulação
  orientada a eventos com estados (`Idle → Carregando → Em voo → Entregando →
  Retornando → Idle`), APIs RESTful (`POST /pedidos`, `GET /entregas/rota`,
  `GET /drones/status`), tratamento de erros/validação,
  dashboard/relatório, e um painel interativo em tempo quase-real.

Veja `backend/README.md` para detalhes do algoritmo e da máquina de estados,
e `frontend/README.md` para detalhes do painel.

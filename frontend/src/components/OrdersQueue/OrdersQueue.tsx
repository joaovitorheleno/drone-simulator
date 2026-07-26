import styled from 'styled-components';
import { Panel, PanelTitle, Badge, tonePorPrioridade, tonePorStatusPedido } from '../UI/primitives';
import type { Pedido } from '../../types';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.bgDeep};
`;

const Coord = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

const Weight = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Empty = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.color.textMuted};
  padding: 12px 0;
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RightCol = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

function rotuloStatus(status: Pedido['status']) {
  switch (status) {
    case 'pendente':
      return 'pendente';
    case 'alocado':
      return 'alocado';
    case 'em_rota':
      return 'em rota';
    case 'entregue':
      return 'entregue';
  }
}

interface OrdersQueueProps {
  pedidos: Pedido[];
}

export function OrdersQueue({ pedidos }: OrdersQueueProps) {
  return (
    <Panel>
      <PanelTitle>
        Fila de pedidos
        <Badge $tone="neutral">{pedidos.length}</Badge>
      </PanelTitle>

      {pedidos.length === 0 ? (
        <Empty>Nenhum pedido cadastrado ainda. Use o formulário acima para começar.</Empty>
      ) : (
        <List>
          {pedidos.map((pedido) => (
            <Row key={pedido.id}>
              <LeftCol>
                <Coord>
                  ({pedido.cliente.x}, {pedido.cliente.y})
                </Coord>
                <Weight>{pedido.pesoKg}kg</Weight>
              </LeftCol>
              <RightCol>
                <Badge $tone={tonePorPrioridade(pedido.prioridade)}>
                  {pedido.prioridade}
                </Badge>
                <Badge $tone={tonePorStatusPedido(pedido.status)}>
                  {rotuloStatus(pedido.status)}
                </Badge>
              </RightCol>
            </Row>
          ))}
        </List>
      )}
    </Panel>
  );
}

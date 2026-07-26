import styled from 'styled-components';
import { Panel, PanelTitle, Badge } from '../UI/primitives';
import type { DashboardResumo } from '../../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Stat = styled.div`
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  background: ${({ theme }) => theme.color.bgDeep};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textPrimary};
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const EfficientDrone = styled.div`
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.color.cyanDim};
`;

const Empty = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textMuted};
`;

interface DashboardPanelProps {
  resumo?: DashboardResumo;
}

export function DashboardPanel({ resumo }: DashboardPanelProps) {
  if (!resumo) {
    return (
      <Panel>
        <PanelTitle>Relatório</PanelTitle>
        <Empty>Carregando estatísticas…</Empty>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelTitle>Relatório</PanelTitle>
      <Grid>
        <Stat>
          <StatValue>{resumo.quantidadeEntregasRealizadas}</StatValue>
          <StatLabel>Entregas realizadas</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{resumo.quantidadePedidosPendentes}</StatValue>
          <StatLabel>Pendentes</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{resumo.quantidadePedidosEmRota}</StatValue>
          <StatLabel>Em rota</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{resumo.tempoMedioPorEntregaSegundos}s</StatValue>
          <StatLabel>Tempo médio/entrega</StatLabel>
        </Stat>
      </Grid>

      {resumo.droneMaisEficiente ? (
        <EfficientDrone>
          <div>
            <StatLabel>Drone mais eficiente</StatLabel>
            <div>{resumo.droneMaisEficiente.nome}</div>
          </div>
          <Badge $tone="cyan">
            {resumo.droneMaisEficiente.totalEntregasRealizadas} entregas ·{' '}
            {resumo.droneMaisEficiente.totalDistanciaPercorridaKm}km
          </Badge>
        </EfficientDrone>
      ) : (
        <Empty>Ainda não há entregas concluídas para calcular eficiência.</Empty>
      )}
    </Panel>
  );
}

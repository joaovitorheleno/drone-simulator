import styled from 'styled-components';
import { Panel, PanelTitle, Badge, tonePorStatusDrone } from '../UI/primitives';
import type { Drone, DroneStatus } from '../../types';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 14px;
  background: ${({ theme }) => theme.color.bgDeep};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DroneName = styled.span`
  font-weight: 600;
  font-size: 13.5px;
`;

const SpecsRow = styled.div`
  display: flex;
  gap: 14px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
`;

const BatteryTrack = styled.div`
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.bgDeep};
  overflow: hidden;
`;

const BatteryFill = styled.div<{ $pct: number; $baixa: boolean }>`
  height: 100%;
  width: ${({ $pct }) => Math.max(2, $pct)}%;
  background: ${({ theme, $baixa }) => ($baixa ? theme.color.coral : theme.color.cyan)};
  transition: width 400ms ease;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

function rotuloStatus(status: DroneStatus) {
  const rotulos: Record<DroneStatus, string> = {
    idle: 'em espera',
    carregando: 'carregando',
    em_voo: 'em voo',
    entregando: 'entregando',
    retornando: 'retornando',
    bateria_baixa: 'bateria baixa',
  };
  return rotulos[status];
}

interface DronesGridProps {
  drones: Drone[];
}

export function DronesGrid({ drones }: DronesGridProps) {
  return (
    <Panel>
      <PanelTitle>
        Frota
        <Badge $tone="neutral">{drones.length}</Badge>
      </PanelTitle>
      <List>
        {drones.map((drone) => (
          <Card key={drone.id}>
            <CardTop>
              <DroneName>{drone.nome}</DroneName>
              <Badge $tone={tonePorStatusDrone(drone.status)}>
                {rotuloStatus(drone.status)}
              </Badge>
            </CardTop>

            <SpecsRow>
              <span>cap. {drone.capacidadeKg}kg</span>
              <span>alcance {drone.autonomiaKm}km</span>
            </SpecsRow>

            <BatteryTrack>
              <BatteryFill
                $pct={drone.baseriaPercentual}
                $baixa={drone.baseriaPercentual <= 20}
              />
            </BatteryTrack>

            <StatsRow>
              <span>bateria {drone.baseriaPercentual}%</span>
              <span>{drone.totalEntregasRealizadas} entregas</span>
            </StatsRow>
          </Card>
        ))}
      </List>
    </Panel>
  );
}

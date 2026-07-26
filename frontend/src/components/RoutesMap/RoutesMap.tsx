import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { Panel, PanelTitle, Badge } from '../UI/primitives';
import type { Drone, Obstaculo, Pedido } from '../../types';

const MapFrame = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  background: ${({ theme }) => theme.color.bgDeep};
  aspect-ratio: 4 / 3;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  color: ${({ theme }) => theme.color.textMuted};
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: inline-block;
`;

interface RoutesMapProps {
  pedidos: Pedido[];
  drones: Drone[];
  obstaculos: Obstaculo[];
}

const PADDING = 3;
const MIN_SPAN = 16;

export function RoutesMap({ pedidos, drones, obstaculos }: RoutesMapProps) {
  const theme = useTheme();

  const bounds = useMemo(() => {
    const xs = [0, ...pedidos.map((p) => p.cliente.x), ...drones.map((d) => d.posicaoAtual.x)];
    const ys = [0, ...pedidos.map((p) => p.cliente.y), ...drones.map((d) => d.posicaoAtual.y)];
    obstaculos.forEach((o) => {
      xs.push(o.centro.x - o.raioKm, o.centro.x + o.raioKm);
      ys.push(o.centro.y - o.raioKm, o.centro.y + o.raioKm);
    });

    let minX = Math.min(...xs) - PADDING;
    let maxX = Math.max(...xs) + PADDING;
    let minY = Math.min(...ys) - PADDING;
    let maxY = Math.max(...ys) + PADDING;

    if (maxX - minX < MIN_SPAN) {
      const mid = (maxX + minX) / 2;
      minX = mid - MIN_SPAN / 2;
      maxX = mid + MIN_SPAN / 2;
    }
    if (maxY - minY < MIN_SPAN) {
      const mid = (maxY + minY) / 2;
      minY = mid - MIN_SPAN / 2;
      maxY = mid + MIN_SPAN / 2;
    }

    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }, [pedidos, drones, obstaculos]);

  const gridStep = useMemo(() => {
    const span = Math.max(bounds.width, bounds.height);
    if (span <= 20) return 2;
    if (span <= 50) return 5;
    return 10;
  }, [bounds]);

  const gridLines = useMemo(() => {
    const verticals: number[] = [];
    const horizontals: number[] = [];
    const startX = Math.ceil(bounds.minX / gridStep) * gridStep;
    const startY = Math.ceil(bounds.minY / gridStep) * gridStep;
    for (let x = startX; x <= bounds.maxX; x += gridStep) verticals.push(x);
    for (let y = startY; y <= bounds.maxY; y += gridStep) horizontals.push(y);
    return { verticals, horizontals };
  }, [bounds, gridStep]);

  const corPrioridade = (p: Pedido['prioridade']) =>
    p === 'alta' ? theme.color.coral : p === 'media' ? theme.color.amber : theme.color.textMuted;

  const raioPonto = (status: Pedido['status']) => (status === 'entregue' ? 2.4 : 3.2);

  return (
    <Panel>
      <PanelTitle>
        Malha da cidade
        <Badge $tone="cyan">{drones.length} drones em campo</Badge>
      </PanelTitle>

      <MapFrame>
        <Svg
          viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* grade */}
          {gridLines.verticals.map((x) => (
            <line
              key={`v-${x}`}
              x1={x}
              y1={bounds.minY}
              x2={x}
              y2={bounds.maxY}
              stroke={theme.color.borderSubtle}
              strokeWidth={bounds.width / 500}
              opacity={0.5}
            />
          ))}
          {gridLines.horizontals.map((y) => (
            <line
              key={`h-${y}`}
              x1={bounds.minX}
              y1={y}
              x2={bounds.maxX}
              y2={y}
              stroke={theme.color.borderSubtle}
              strokeWidth={bounds.width / 500}
              opacity={0.5}
            />
          ))}

          {/* eixos centrais */}
          <line
            x1={bounds.minX}
            y1={0}
            x2={bounds.maxX}
            y2={0}
            stroke={theme.color.borderStrong}
            strokeWidth={bounds.width / 350}
          />
          <line
            x1={0}
            y1={bounds.minY}
            x2={0}
            y2={bounds.maxY}
            stroke={theme.color.borderStrong}
            strokeWidth={bounds.width / 350}
          />

          {/* obstáculos: zonas de exclusão aérea */}
          {obstaculos.map((o) => (
            <circle
              key={o.id}
              cx={o.centro.x}
              cy={o.centro.y}
              r={o.raioKm}
              fill="rgba(220,38,38,0.06)"
              stroke={theme.color.coral}
              strokeDasharray={`${bounds.width / 150} ${bounds.width / 90}`}
              strokeWidth={bounds.width / 400}
            />
          ))}

          {/* linhas de rota planejada de cada drone (base -> paradas -> base) */}
          {drones
            .filter((d) => d.legAtual)
            .map((d) => (
              <line
                key={`leg-${d.id}`}
                x1={d.legAtual!.de.x}
                y1={d.legAtual!.de.y}
                x2={d.legAtual!.para.x}
                y2={d.legAtual!.para.y}
                stroke={theme.color.cyan}
                strokeWidth={bounds.width / 400}
                strokeDasharray={`${bounds.width / 200} ${bounds.width / 200}`}
                opacity={0.6}
              />
            ))}

          {/* base */}
          <circle cx={0} cy={0} r={bounds.width / 90} fill="none" stroke={theme.color.cyan} strokeWidth={bounds.width / 400} />
          <circle cx={0} cy={0} r={bounds.width / 220} fill={theme.color.cyan} />

          {/* pedidos */}
          {pedidos.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.cliente.x}
                cy={p.cliente.y}
                r={raioPonto(p.status) * (bounds.width / 300)}
                fill={corPrioridade(p.prioridade)}
                opacity={p.status === 'entregue' ? 0.4 : 0.95}
              />
              {p.status !== 'entregue' && p.status !== 'pendente' && (
                <circle
                  cx={p.cliente.x}
                  cy={p.cliente.y}
                  r={raioPonto(p.status) * (bounds.width / 300) * 2}
                  fill="none"
                  stroke={corPrioridade(p.prioridade)}
                  strokeWidth={bounds.width / 600}
                  opacity={0.35}
                />
              )}
            </g>
          ))}

          {/* drones */}
          {drones.map((d) => (
            <g key={d.id}>
              <circle
                cx={d.posicaoAtual.x}
                cy={d.posicaoAtual.y}
                r={bounds.width / 130}
                fill={theme.color.bgDeep}
                stroke={theme.color.cyan}
                strokeWidth={bounds.width / 300}
              />
              <circle cx={d.posicaoAtual.x} cy={d.posicaoAtual.y} r={bounds.width / 400} fill={theme.color.cyan} />
            </g>
          ))}
        </Svg>
      </MapFrame>

      <Legend>
        <LegendItem>
          <Dot $color={theme.color.cyan} /> base / drone
        </LegendItem>
        <LegendItem>
          <Dot $color={theme.color.coral} /> prioridade alta
        </LegendItem>
        <LegendItem>
          <Dot $color={theme.color.amber} /> prioridade média
        </LegendItem>
        <LegendItem>
          <Dot $color={theme.color.textMuted} /> prioridade baixa
        </LegendItem>
        <LegendItem>zona tracejada = exclusão aérea</LegendItem>
      </Legend>
    </Panel>
  );
}

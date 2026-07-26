import { useCallback, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import {
  Shell,
  Header,
  Brand,
  BrandMark,
  BrandText,
  BrandTitle,
  BrandSubtitle,
  HeaderMeta,
  LiveDot,
  Main,
  Column,
} from './components/Layout/Layout';
import { OrderForm } from './components/OrderForm/OrderForm';
import { OrdersQueue } from './components/OrdersQueue/OrdersQueue';
import { DronesGrid } from './components/DronesGrid/DronesGrid';
import { DroneForm } from './components/DronesGrid/DroneForm';
import { RoutesMap } from './components/RoutesMap/RoutesMap';
import { ObstacleForm } from './components/RoutesMap/ObstacleForm';
import { DashboardPanel } from './components/Dashboard/DashboardPanel';
import { Modal } from './components/UI/Modal';
import { Button } from './components/UI/primitives';
import { usePolling } from './hooks/usePolling';
import { api } from './api/client';

const POLL_MS = 1500;

export default function App() {
  const [modalDroneAberto, setModalDroneAberto] = useState(false);

  const pedidosFetcher = useCallback(() => api.listarPedidos(), []);
  const dronesFetcher = useCallback(() => api.listarDrones(), []);
  const obstaculosFetcher = useCallback(() => api.listarObstaculos(), []);
  const dashboardFetcher = useCallback(() => api.obterDashboard(), []);

  const pedidos = usePolling(pedidosFetcher, POLL_MS);
  const drones = usePolling(dronesFetcher, POLL_MS);
  const obstaculos = usePolling(obstaculosFetcher, POLL_MS * 2);
  const dashboard = usePolling(dashboardFetcher, POLL_MS);

  const online = !pedidos.erro && !drones.erro;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Shell>
        <Header>
          <Brand>
            <BrandMark>DR</BrandMark>
            <BrandText>
              <BrandTitle>Torre de Controle</BrandTitle>
              <BrandSubtitle>SIMULADOR DE ENCOMENDAS EM DRONE</BrandSubtitle>
            </BrandText>
          </Brand>
          <HeaderMeta>
            <Button $variant="ghost" onClick={() => setModalDroneAberto(true)}>
              + Novo drone
            </Button>
          </HeaderMeta>
        </Header>

        <Main>
          <Column>
            <OrderForm onPedidoCriado={pedidos.recarregar} />
            <OrdersQueue pedidos={pedidos.data ?? []} />
          </Column>

          <Column>
            <RoutesMap
              pedidos={pedidos.data ?? []}
              drones={drones.data ?? []}
              obstaculos={obstaculos.data ?? []}
            />
            <ObstacleForm onObstaculoCriado={obstaculos.recarregar} />
          </Column>

          <Column>
            <DashboardPanel resumo={dashboard.data} />
            <DronesGrid drones={drones.data ?? []} />
          </Column>
        </Main>
      </Shell>

      <Modal open={modalDroneAberto} onClose={() => setModalDroneAberto(false)}>
        <DroneForm
          onCancelar={() => setModalDroneAberto(false)}
          onDroneCriado={() => {
            setModalDroneAberto(false);
            drones.recarregar();
          }}
        />
      </Modal>
    </ThemeProvider>
  );
}

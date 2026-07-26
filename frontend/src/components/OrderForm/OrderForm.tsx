import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { Panel, PanelTitle, Button, FieldLabel, Input, Select } from '../UI/primitives';
import { api, ApiError } from '../../api/client';
import type { Prioridade } from '../../types';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`;

const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.coral};
`;

const SuccessText = styled.p`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.green};
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textMuted};
  line-height: 1.5;
`;

interface OrderFormProps {
  onPedidoCriado: () => void;
}

const estadoInicial = { x: '', y: '', pesoKg: '', prioridade: 'media' as Prioridade };

export function OrderForm({ onPedidoCriado }: OrderFormProps) {
  const [form, setForm] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setSucesso(null);

    const x = Number(form.x);
    const y = Number(form.y);
    const pesoKg = Number(form.pesoKg);

    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(pesoKg)) {
      setErro('Preencha coordenadas e peso com números válidos.');
      return;
    }

    setEnviando(true);
    try {
      await api.criarPedido({ cliente: { x, y }, pesoKg, prioridade: form.prioridade });
      setSucesso('Pedido criado e enviado para alocação.');
      setForm(estadoInicial);
      onPedidoCriado();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Falha ao criar pedido.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Panel as="form" onSubmit={handleSubmit}>
      <PanelTitle>Novo pedido</PanelTitle>
      <Hint>Informe a localização do cliente na malha, o peso do pacote e a prioridade de entrega.</Hint>

      <Grid>
        <FieldLabel>
          Coordenada X (km)
          <Input
            type="number"
            step="any"
            placeholder="ex: 12"
            value={form.x}
            onChange={(e) => setForm((f) => ({ ...f, x: e.target.value }))}
            required
          />
        </FieldLabel>
        <FieldLabel>
          Coordenada Y (km)
          <Input
            type="number"
            step="any"
            placeholder="ex: 7"
            value={form.y}
            onChange={(e) => setForm((f) => ({ ...f, y: e.target.value }))}
            required
          />
        </FieldLabel>
      </Grid>

      <FieldLabel>
        Peso do pacote (kg)
        <Input
          type="number"
          step="0.1"
          min="0.1"
          placeholder="ex: 2.5"
          value={form.pesoKg}
          onChange={(e) => setForm((f) => ({ ...f, pesoKg: e.target.value }))}
          required
        />
      </FieldLabel>

      <FieldLabel>
        Prioridade da entrega
        <Select
          value={form.prioridade}
          onChange={(e) =>
            setForm((f) => ({ ...f, prioridade: e.target.value as Prioridade }))
          }
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </Select>
      </FieldLabel>

      {erro && <ErrorText>{erro}</ErrorText>}
      {sucesso && <SuccessText>{sucesso}</SuccessText>}

      <Button type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Despachar pedido'}
      </Button>
    </Panel>
  );
}

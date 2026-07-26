import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { Panel, PanelTitle, Button, FieldLabel, Input } from '../UI/primitives';
import { api, ApiError } from '../../api/client';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.coral};
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textMuted};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const estadoInicial = { nome: '', capacidadeKg: '', autonomiaKm: '' };

interface DroneFormProps {
  onDroneCriado: () => void;
  onCancelar: () => void;
}

export function DroneForm({ onDroneCriado, onCancelar }: DroneFormProps) {
  const [form, setForm] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    const capacidadeKg = Number(form.capacidadeKg);
    const autonomiaKm = Number(form.autonomiaKm);

    if (Number.isNaN(capacidadeKg) || capacidadeKg <= 0) {
      setErro('Informe uma capacidade de carga válida (kg).');
      return;
    }
    if (Number.isNaN(autonomiaKm) || autonomiaKm <= 0) {
      setErro('Informe uma autonomia válida (km).');
      return;
    }

    setEnviando(true);
    try {
      await api.criarDrone({
        nome: form.nome.trim() || undefined,
        capacidadeKg,
        autonomiaKm,
      });
      setForm(estadoInicial);
      onDroneCriado();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Falha ao criar drone.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Panel as="form" onSubmit={handleSubmit}>
      <PanelTitle>Novo drone</PanelTitle>
      <Hint>Cadastre um drone na frota informando capacidade de carga e autonomia por carga.</Hint>

      <FieldLabel>
        Nome (opcional)
        <Input
          placeholder="ex: Drone-04"
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
        />
      </FieldLabel>

      <Grid>
        <FieldLabel>
          Capacidade (kg)
          <Input
            type="number"
            step="0.1"
            min="0.1"
            placeholder="ex: 10"
            value={form.capacidadeKg}
            onChange={(e) => setForm((f) => ({ ...f, capacidadeKg: e.target.value }))}
            required
          />
        </FieldLabel>
        <FieldLabel>
          Autonomia (km)
          <Input
            type="number"
            step="0.1"
            min="0.1"
            placeholder="ex: 25"
            value={form.autonomiaKm}
            onChange={(e) => setForm((f) => ({ ...f, autonomiaKm: e.target.value }))}
            required
          />
        </FieldLabel>
      </Grid>

      {erro && <ErrorText>{erro}</ErrorText>}

      <Actions>
        <Button type="button" $variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Criando…' : 'Criar drone'}
        </Button>
      </Actions>
    </Panel>
  );
}

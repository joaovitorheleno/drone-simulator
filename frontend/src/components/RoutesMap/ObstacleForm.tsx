import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { Panel, PanelTitle, Button, FieldLabel, Input } from '../UI/primitives';
import { api, ApiError } from '../../api/client';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`;

const ErrorText = styled.p`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.coral};
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textMuted};
`;

const estadoInicial = { nome: '', x: '', y: '', raioKm: '' };

interface ObstacleFormProps {
  onObstaculoCriado: () => void;
}

export function ObstacleForm({ onObstaculoCriado }: ObstacleFormProps) {
  const [form, setForm] = useState(estadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    const x = Number(form.x);
    const y = Number(form.y);
    const raioKm = Number(form.raioKm);

    if (!form.nome.trim() || Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(raioKm)) {
      setErro('Preencha nome, coordenadas e raio corretamente.');
      return;
    }

    setEnviando(true);
    try {
      await api.criarObstaculo({ nome: form.nome, centro: { x, y }, raioKm });
      setForm(estadoInicial);
      onObstaculoCriado();
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Falha ao criar zona de exclusão.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Panel as="form" onSubmit={handleSubmit}>
      <PanelTitle>Zona de exclusão aérea</PanelTitle>
      <Hint>Cadastre uma área circular que os drones devem contornar.</Hint>

      <FieldLabel>
        Nome
        <Input
          placeholder="ex: Aeroporto"
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
        />
      </FieldLabel>

      <Grid>
        <FieldLabel>
          X
          <Input
            type="number"
            step="any"
            value={form.x}
            onChange={(e) => setForm((f) => ({ ...f, x: e.target.value }))}
          />
        </FieldLabel>
        <FieldLabel>
          Y
          <Input
            type="number"
            step="any"
            value={form.y}
            onChange={(e) => setForm((f) => ({ ...f, y: e.target.value }))}
          />
        </FieldLabel>
        <FieldLabel>
          Raio (km)
          <Input
            type="number"
            step="any"
            min="0.1"
            value={form.raioKm}
            onChange={(e) => setForm((f) => ({ ...f, raioKm: e.target.value }))}
          />
        </FieldLabel>
      </Grid>

      {erro && <ErrorText>{erro}</ErrorText>}

      <Button type="submit" $variant="ghost" disabled={enviando}>
        {enviando ? 'Adicionando…' : 'Adicionar zona'}
      </Button>
    </Panel>
  );
}

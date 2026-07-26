export const theme = {
  color: {
    // Paleta minimalista: fundo claro e neutro, poucas cores, sem
    // gradientes ou brilhos — o foco fica nos dados, não na "pele".
    bgDeep: '#f7f7f8',
    bgPanel: '#ffffff',
    bgPanelRaised: '#ffffff',
    borderSubtle: '#e6e6e9',
    borderStrong: '#d4d4d8',

    textPrimary: '#18181b',
    textSecondary: '#52525b',
    textMuted: '#a1a1aa',

    // Azul: telemetria, drones, rota, ação primária.
    cyan: '#2563eb',
    cyanDim: '#dbe6fd',
    // Âmbar: prioridade média.
    amber: '#b45309',
    amberDim: '#fdf1e0',
    // Vermelho: prioridade alta / alerta.
    coral: '#dc2626',
    coralDim: '#fbe3e3',
    // Verde: sucesso / entregue.
    green: '#16a34a',
    greenDim: '#e2f5e9',
  },
  font: {
    display: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', monospace",
  },
  radius: {
    sm: '5px',
    md: '8px',
    lg: '10px',
  },
  shadow: {
    panel: '0 1px 2px rgba(24,24,27,0.04)',
    glowCyan: '0 0 0 3px rgba(37,99,235,0.12)',
  },
} as const;

export type AppTheme = typeof theme;

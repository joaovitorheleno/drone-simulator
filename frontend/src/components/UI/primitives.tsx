import React from 'react';
import styled, { css } from 'styled-components';

export const Panel = styled.section`
  background: ${({ theme }) => theme.color.bgPanel};
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.panel};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const PanelTitle = styled.h2`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: ${({ theme }) => theme.color.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

type BadgeTone = 'neutral' | 'cyan' | 'amber' | 'coral' | 'green';

const dotColor: Record<BadgeTone, ReturnType<typeof css>> = {
  neutral: css`
    background: ${({ theme }) => theme.color.textMuted};
  `,
  cyan: css`
    background: ${({ theme }) => theme.color.cyan};
  `,
  amber: css`
    background: ${({ theme }) => theme.color.amber};
  `,
  coral: css`
    background: ${({ theme }) => theme.color.coral};
  `,
  green: css`
    background: ${({ theme }) => theme.color.green};
  `,
};

const DotSpan = styled.span<{ $tone: BadgeTone }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
  ${({ $tone }) => dotColor[$tone]}
`;

const BadgeBase = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  background: ${({ theme }) => theme.color.bgDeep};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.textSecondary};
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

/** Selo minimalista: fundo neutro + ponto colorido, sem pilulas coloridas. */
export function Badge({
  $tone = 'neutral',
  children,
}: {
  $tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <BadgeBase>
      <DotSpan $tone={$tone} />
      {children}
    </BadgeBase>
  );
}

export const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  appearance: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, opacity 120ms ease;

  ${({ theme, $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.color.textPrimary};
          color: ${theme.color.bgPanel};
          border: 1px solid ${theme.color.textPrimary};
          &:hover {
            opacity: 0.85;
          }
        `
      : css`
          background: transparent;
          color: ${theme.color.textSecondary};
          border: 1px solid ${theme.color.borderSubtle};
          &:hover {
            color: ${theme.color.textPrimary};
            border-color: ${theme.color.borderStrong};
          }
        `}

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const inputStyles = css`
  background: ${({ theme }) => theme.color.bgPanel};
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.textPrimary};
  padding: 9px 10px;
  font-size: 13px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-visible {
    border-color: ${({ theme }) => theme.color.cyan};
    box-shadow: ${({ theme }) => theme.shadow.glowCyan};
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const Select = styled.select`
  ${inputStyles}
`;

export function tonePorPrioridade(prioridade: string): BadgeTone {
  if (prioridade === 'alta') return 'coral';
  if (prioridade === 'media') return 'amber';
  return 'neutral';
}

export function tonePorStatusPedido(status: string): BadgeTone {
  if (status === 'entregue') return 'green';
  if (status === 'pendente') return 'neutral';
  return 'cyan';
}

export function tonePorStatusDrone(status: string): BadgeTone {
  if (status === 'idle') return 'green';
  if (status === 'bateria_baixa') return 'coral';
  return 'cyan';
}

import styled from 'styled-components';

export const Shell = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 28px;
  border-bottom: 1px solid ${({ theme }) => theme.color.borderSubtle};
  background: ${({ theme }) => theme.color.bgPanel};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BrandMark = styled.div`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.color.textPrimary};
  color: ${({ theme }) => theme.color.bgPanel};
  font-family: ${({ theme }) => theme.font.mono};
  font-weight: 600;
  font-size: 13px;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

export const BrandTitle = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 600;
  font-size: 15px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.textPrimary};
`;

export const BrandSubtitle = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 10.5px;
  color: ${({ theme }) => theme.color.textMuted};
  letter-spacing: 0.04em;
`;

export const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.color.textSecondary};
`;

export const LiveDot = styled.span<{ $ok?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $ok = true }) =>
    $ok ? theme.color.green : theme.color.coral};
  display: inline-block;
  margin-right: 6px;
`;

export const Main = styled.main`
  flex: 1;
  padding: 24px 28px 40px;
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) 340px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

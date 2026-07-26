import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${theme.color.bgDeep};
    color: ${theme.color.textPrimary};
    font-family: ${theme.font.display};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: ${theme.font.display};
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
  }

  button {
    font-family: inherit;
  }

  input, select {
    font-family: ${theme.font.mono};
  }

  ::selection {
    background: ${theme.color.cyanDim};
    color: ${theme.color.textPrimary};
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.color.borderStrong};
    border-radius: 8px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

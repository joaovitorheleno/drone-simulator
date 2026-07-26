import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePollingResult<T> {
  data: T | undefined;
  erro: string | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
}

/** Busca dados imediatamente e depois repete a cada `intervaloMs`, sem travar a UI. */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervaloMs: number,
): UsePollingResult<T> {
  const [data, setData] = useState<T>();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const executar = useCallback(async () => {
    try {
      const resultado = await fetcherRef.current();
      setData(resultado);
      setErro(null);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    executar();
    const id = setInterval(executar, intervaloMs);
    return () => clearInterval(id);
  }, [executar, intervaloMs]);

  return { data, erro, carregando, recarregar: executar };
}

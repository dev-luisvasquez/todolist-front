// Este archivo ya no es necesario ahora que usamos Axios directamente
// Mantenemos la estructura por compatibilidad, pero sin React Query

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

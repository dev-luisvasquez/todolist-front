# User Store - Manejo Global del Estado del Usuario

## Descripción

El `userStore` es un store global creado con Zustand que maneja el estado del usuario en toda la aplicación. Proporciona una forma centralizada y reactiva de manejar la información del usuario autenticado.

## Características

- ✅ **Estado Global**: Todos los componentes pueden acceder al mismo estado del usuario
- ✅ **Reactivo**: Los componentes se actualizan automáticamente cuando cambia el estado
- ✅ **Persistente**: Se sincroniza con localStorage automáticamente
- ✅ **TypeScript**: Completamente tipado
- ✅ **Hooks personalizados**: Interfaces simples para diferentes casos de uso

## Hooks Disponibles

### `useGlobalUser()`
Hook principal que incluye toda la funcionalidad del store.

```typescript
const {
  user,              // Datos del usuario actual
  isLoading,         // Estado de carga
  isAuthenticated,   // Si el usuario está autenticado
  error,             // Mensajes de error
  setUser,           // Establecer usuario completo
  updateUser,        // Actualizar campos específicos del usuario
  clearUser,         // Limpiar datos del usuario (logout)
  setLoading,        // Controlar estado de carga
  setError,          // Establecer errores
  refreshUserData,   // Refrescar datos desde localStorage
} = useGlobalUser();
```

### `useUserState()`
Hook optimizado para componentes que solo necesitan leer el estado.

```typescript
const { user, isLoading, isAuthenticated, error } = useUserState();
```

### `useUserActions()`
Hook para componentes que solo necesitan las acciones.

```typescript
const { setUser, updateUser, clearUser, setLoading, setError, refreshUserData } = useUserActions();
```

## Ejemplos de Uso

### 1. En el Header (solo lectura)
```typescript
import { useUserState } from '@/hooks/useGlobalUser';

export default function Header() {
  const { user, isLoading, isAuthenticated } = useUserState();

  if (isLoading || !isAuthenticated) return null;

  return (
    <div>
      <span>{user?.name} {user?.last_name}</span>
      <img src={user?.avatar} alt="Avatar" />
    </div>
  );
}
```

### 2. En el Perfil (lectura y escritura)
```typescript
import { useGlobalUser } from '@/hooks/useGlobalUser';

export default function Profile() {
  const { user, updateUser, isLoading } = useGlobalUser();

  const handleUpdateProfile = async (newData) => {
    // Actualizar en el servidor
    const updatedUser = await apiUpdateUser(newData);
    
    // Actualizar en el store global (se reflejará en toda la app)
    updateUser(updatedUser);
  };

  return (
    <form onSubmit={handleUpdateProfile}>
      {/* Formulario */}
    </form>
  );
}
```

### 3. En cualquier componente que necesite datos del usuario
```typescript
import { useUserState } from '@/hooks/useGlobalUser';

export default function UserInfo() {
  const { user, isAuthenticated } = useUserState();

  if (!isAuthenticated) return <div>No autenticado</div>;

  return (
    <div>
      <h3>Información del Usuario</h3>
      <p>Nombre: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

## Configuración

El store ya está configurado en el `layout.tsx` principal mediante el `UserStoreProvider`:

```typescript
<QueryProvider>
  <UserStoreProvider>  {/* ← Inicializa el store */}
    <RouteGuard>
      <ConditionalHeader />
      <main>{children}</main>
    </RouteGuard>
  </UserStoreProvider>
</QueryProvider>
```

## Beneficios vs. Hooks anteriores

### Antes (con `useLocalStorageUser`)
- ❌ Solo funcionaba entre pestañas diferentes
- ❌ No se actualizaba automáticamente en la misma pestaña
- ❌ Cada componente tenía su propio estado
- ❌ Había que emitir eventos manualmente

### Ahora (con `userStore`)
- ✅ Funciona instantáneamente en toda la aplicación
- ✅ Actualización automática en todos los componentes
- ✅ Estado centralizado y consistente
- ✅ No necesitas recordar emitir eventos

## Estado del Store

El store mantiene el siguiente estado:

```typescript
interface UserState {
  user: UserInfoDto | null;           // Datos del usuario
  isLoading: boolean;                 // Estado de carga
  isAuthenticated: boolean;           // Si está autenticado
  error: string | null;               // Mensajes de error
}
```

## Sincronización con localStorage

El store se sincroniza automáticamente con localStorage usando la configuración de persistencia de Zustand. Esto significa que:

- Al cargar la página, el store se inicializa con datos de localStorage
- Cuando el store cambia, localStorage se actualiza automáticamente
- Los datos persisten entre sesiones del navegador

## Migración desde hooks anteriores

Si tienes componentes usando `useLocalStorageUser`, simplemente reemplaza:

```typescript
// Antes
import { useLocalStorageUser } from '@/hooks/useUser';
const { user, isLoading, isAuthenticated } = useLocalStorageUser();

// Después
import { useUserState } from '@/hooks/useGlobalUser';
const { user, isLoading, isAuthenticated } = useUserState();
```

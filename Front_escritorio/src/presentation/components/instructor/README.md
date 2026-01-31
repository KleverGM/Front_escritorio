# Componentes del Instructor

Esta carpeta contiene los componentes reutilizables específicos para las funcionalidades del instructor.

## Estructura

```
instructor/
├── EstudiantesStats.tsx      # Tarjetas de estadísticas de estudiantes
├── EstudiantesFilters.tsx    # Filtros para la lista de estudiantes
├── EstudiantesTable.tsx      # Tabla de estudiantes
└── index.ts                  # Exportaciones
```

## Componentes

### EstudiantesStats

Muestra las estadísticas principales de los estudiantes en formato de tarjetas.

**Props:**

- `totalEstudiantes: number` - Total de estudiantes únicos
- `activos: number` - Estudiantes con progreso activo
- `completados: number` - Estudiantes que completaron
- `inactivos: number` - Estudiantes sin iniciar
- `progresoPromedio: number` - Progreso promedio (0-100)
- `nuevosEstudiantes: number` - Nuevos estudiantes del mes
- `totalInscripciones: number` - Total de inscripciones

**Uso:**

```tsx
<EstudiantesStats
  totalEstudiantes={50}
  activos={30}
  completados={15}
  inactivos={5}
  progresoPromedio={65.5}
  nuevosEstudiantes={10}
  totalInscripciones={75}
/>
```

### EstudiantesFilters

Sistema de filtros para búsqueda y filtrado de estudiantes con chips de filtros activos.

**Props:**

- `searchQuery: string` - Query de búsqueda actual
- `filterCurso: string` - Curso seleccionado
- `filterEstado: string` - Estado seleccionado (todos/active/completed/inactive)
- `cursosUnicos: string[]` - Lista de cursos únicos
- `inscripcionesCount: number` - Total de inscripciones
- `activosCount: number` - Contador de activos
- `completadosCount: number` - Contador de completados
- `inactivosCount: number` - Contador de inactivos
- `onSearchChange: (value: string) => void` - Callback para cambio de búsqueda
- `onCursoChange: (value: string) => void` - Callback para cambio de curso
- `onEstadoChange: (value: string) => void` - Callback para cambio de estado
- `onClearFilters: () => void` - Callback para limpiar filtros
- `getCursoCount: (curso: string) => number` - Función para obtener conteo por curso

**Uso:**

```tsx
<EstudiantesFilters
  searchQuery={searchQuery}
  filterCurso={filterCurso}
  filterEstado={filterEstado}
  cursosUnicos={cursosUnicos}
  inscripcionesCount={100}
  activosCount={60}
  completadosCount={30}
  inactivosCount={10}
  onSearchChange={setSearchQuery}
  onCursoChange={setFilterCurso}
  onEstadoChange={setFilterEstado}
  onClearFilters={() => {...}}
  getCursoCount={(curso) => {...}}
/>
```

### EstudiantesTable

Tabla responsiva con información detallada de estudiantes incluyendo avatares, progreso y estado.

**Props:**

- `inscripciones: Inscripcion[]` - Array de inscripciones a mostrar

**Tipo Inscripcion:**

```typescript
interface Inscripcion {
  id: number;
  usuario: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  curso: {
    id: number;
    titulo: string;
  } | null;
  fecha_inscripcion: string;
  progreso: number;
  completado: boolean;
}
```

**Uso:**

```tsx
<EstudiantesTable inscripciones={sortedInscripciones} />
```

## Características

- ✅ **Diseño modular** - Componentes reutilizables y mantenibles
- ✅ **TypeScript** - Tipado completo para mayor seguridad
- ✅ **Tailwind CSS** - Estilos consistentes con el diseño del sistema
- ✅ **Responsivo** - Adaptable a diferentes tamaños de pantalla
- ✅ **Accesible** - Componentes semánticos con ARIA labels
- ✅ **Optimizado** - Renderizado eficiente con React

## Integración

Los componentes se integran en la página principal:

```tsx
import {
  EstudiantesStats,
  EstudiantesFilters,
  EstudiantesTable,
} from "../../../components/instructor";

// En el componente
<EstudiantesStats {...statsProps} />
<EstudiantesFilters {...filtersProps} />
<EstudiantesTable inscripciones={data} />
```

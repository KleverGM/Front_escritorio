# GUÍA DE INICIO - Sistema de Cursos Online

## ✅ Correcciones Aplicadas

### Backend

1. **Tipos de Avisos actualizados**: Ahora usa `aviso`, `mensaje_sistema`, `recordatorio`, `urgente`
2. **Serializer mejorado**: Campo `mensaje` mapea a `descripcion` para compatibilidad
3. **Migración creada**: `0002_alter_aviso_tipo.py`
4. **Script de actualización**: `update_aviso_tipos.py` para datos existentes

### Frontend

1. **UserSearchDropdown**: Componente reutilizable con soporte para label personalizado
2. **CrearAviso**: Usa UserSearchDropdown, sin errores de compilación
3. **CrearNotificacion**: Usa UserSearchDropdown, sin errores de compilación
4. **TipoBadge**: Muestra correctamente todos los tipos de avisos

---

## 🚀 Cómo Iniciar el Proyecto

### Requisitos

- Python 3.10+
- Node.js 18+
- PostgreSQL (para backend)
- MongoDB (para notificaciones)

### 1. Iniciar Backend

```bash
cd backend_cursos_online

# Activar entorno virtual
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
# o
source .venv/bin/activate      # Linux/Mac

# Instalar dependencias (si es necesario)
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Actualizar tipos de avisos existentes (opcional, solo si hay datos antiguos)
python manage.py shell < update_aviso_tipos.py

# Iniciar servidor
python manage.py runserver
# o usar el script:
.\run_server.bat
```

El backend estará disponible en: `http://localhost:8000`

### 2. Iniciar Frontend

```bash
# Desde la raíz del proyecto
npm install  # Si es la primera vez

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🔧 Configuración

### Backend (.env)

```env
DEBUG=True
SECRET_KEY=tu-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/cursos_online
MONGO_URI=mongodb://localhost:27017
MONGO_DB=mongo_cursos_online
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)

```env
VITE_API_URL=https://cursos-online-api.desarrollo-software.xyz
```

**Nota:** En desarrollo, el frontend usa el proxy de Vite configurado en `vite.config.ts` que redirige `/api` al backend.

---

## 🧪 Probar la Aplicación

### 1. Crear un Aviso

1. Iniciar sesión como administrador o instructor
2. Ir a `/app/avisos`
3. Click en "Crear Aviso"
4. Buscar usuario (el autocompletado funciona)
5. Seleccionar tipo: aviso, mensaje_sistema, recordatorio o urgente
6. Completar título y mensaje
7. Enviar

### 2. Crear una Notificación

1. Iniciar sesión como administrador
2. Ir a `/app/notificaciones`
3. Click en "Crear Notificación"
4. Elegir entre global o usuario específico
5. Si es específico, buscar usuario
6. Seleccionar tipo y completar formulario
7. Enviar

---

## 📋 Endpoints Principales

### Autenticación

- `POST /api/users/login/` - Login
- `POST /api/users/register/` - Registro
- `POST /api/auth/token/` - Obtener token JWT
- `POST /api/auth/refresh/` - Refrescar token

### Usuarios

- `GET /api/users/?search=texto` - Buscar usuarios
- `GET /api/users/perfil/` - Perfil del usuario autenticado
- `PUT /api/users/{id}/` - Actualizar usuario

### Avisos

- `GET /api/avisos/` - Listar avisos
- `POST /api/avisos/` - Crear aviso
- `PUT /api/avisos/{id}/` - Actualizar aviso
- `DELETE /api/avisos/{id}/` - Eliminar aviso

### Notificaciones

- `GET /api/notificaciones/` - Listar notificaciones
- `POST /api/notificaciones/` - Crear notificación (solo admin)
- `GET /api/notificaciones/contador/` - Contador de no leídas
- `POST /api/notificaciones/marcar_todas_leidas/` - Marcar todas como leídas

---

## 🐛 Solución de Problemas

### Error de PostgreSQL al ejecutar migraciones

**Problema:** `ImportError: no pq wrapper available`

**Solución:**

```bash
pip uninstall psycopg psycopg2 psycopg-binary
pip install psycopg2-binary
```

### Error de CORS en el frontend

**Problema:** Frontend no puede comunicarse con backend

**Solución:**

1. Verificar que el backend esté corriendo en `http://localhost:8000`
2. Verificar proxy en `vite.config.ts`
3. Verificar CORS_ALLOWED_ORIGINS en `settings.py` del backend

### UserSearchDropdown no funciona

**Problema:** No aparecen resultados al buscar

**Solución:**

1. Verificar que el endpoint `/api/users/?search=` funcione en el backend
2. Verificar que el token JWT sea válido
3. Abrir DevTools > Network para ver los requests

### TipoBadge muestra "tipo no reconocido"

**Problema:** El badge muestra el tipo en gris

**Solución:**

1. Verificar que los avisos en DB tengan tipos: `aviso`, `mensaje_sistema`, `recordatorio`, `urgente`
2. Ejecutar script de actualización: `python manage.py shell < update_aviso_tipos.py`

---

## 📦 Estructura del Proyecto

```
front_escritorio/
├── backend_cursos_online/          # Django REST API
│   ├── avisos/                     # App de avisos
│   ├── notificaciones/             # App de notificaciones (MongoDB)
│   ├── users/                      # App de usuarios
│   ├── cursos/                     # App de cursos
│   └── curso_online_project/       # Configuración principal
├── src/
│   ├── presentation/
│   │   ├── components/
│   │   │   └── common/            # Componentes reutilizables
│   │   │       ├── UserSearchDropdown.tsx
│   │   │       ├── TipoBadge.tsx
│   │   │       ├── FilterButtons.tsx
│   │   │       └── ...
│   │   └── pages/
│   │       ├── private/           # Páginas protegidas
│   │       │   ├── Avisos.tsx
│   │       │   ├── CrearAviso.tsx
│   │       │   ├── Notificaciones.tsx
│   │       │   └── CrearNotificacion.tsx
│   │       └── public/            # Páginas públicas
│   ├── infrastructure/
│   │   └── http/
│   │       └── httpClients.ts     # Axios configurado
│   └── utils/
│       ├── dateFormatter.ts       # Utilidades de fecha
│       └── notifications.ts       # Toasts y confirmaciones
└── vite.config.ts                 # Configuración de Vite
```

---

## 🎯 Próximos Pasos

1. ✅ Backend y Frontend sincronizados
2. ✅ Componentes reutilizables creados
3. ✅ Sin errores de compilación
4. 🔄 Aplicar migraciones en producción
5. 🔄 Actualizar datos existentes con script
6. 🔄 Probar flujo completo de avisos y notificaciones

---

## 📞 Soporte

Si encuentras algún problema:

1. Verifica los logs del backend: `python manage.py runserver`
2. Verifica la consola del navegador (F12)
3. Revisa el archivo `CORRECCIONES_BACKEND.md` para detalles técnicos

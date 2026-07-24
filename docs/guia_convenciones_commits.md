# Convenciones para los commits

Este documento define las reglas que se utilizarán para escribir los mensajes de commit del repositorio del sitio web de la iglesia **Espíritu y Verdad**.

El objetivo es mantener un historial de cambios claro, consistente y fácil de entender para todas las personas que colaboren en el proyecto.

## Formato general

Los commits seguirán la convención **Conventional Commits**:

```text
tipo(alcance): descripción breve
```

Ejemplo:

```text
feat(home): agregar sección de próximos eventos
```

El `alcance` es opcional. Cuando se utilice, debe indicar la parte del proyecto afectada.

```text
tipo: descripción breve
```

Ejemplo:

```text
docs: actualizar instrucciones de instalación
```

## Tipos de commit

### `feat`

Se utiliza cuando se agrega una nueva funcionalidad.

```text
feat(events): agregar calendario de actividades
feat(sermons): permitir filtrar predicaciones por tema
```

### `fix`

Se utiliza para corregir errores.

```text
fix(contact): corregir envío duplicado del formulario
fix(header): corregir menú en dispositivos móviles
```

### `docs`

Se utiliza para crear o modificar documentación.

```text
docs: agregar convenciones para commits
docs(setup): documentar configuración del entorno local
```

### `style`

Se utiliza para cambios visuales o de formato que no modifican la lógica del sistema.

```text
style(home): ajustar espaciado de la sección principal
style(footer): alinear enlaces de redes sociales
```

No debe utilizarse para cambios generales de interfaz que agreguen comportamiento nuevo. En esos casos debe utilizarse `feat`.

### `refactor`

Se utiliza cuando se reorganiza o mejora el código sin agregar funcionalidades ni corregir errores visibles.

```text
refactor(sermons): extraer componente de tarjeta de predicación
refactor(api): simplificar cliente HTTP
```

### `test`

Se utiliza para agregar, modificar o corregir pruebas.

```text
test(contact): agregar pruebas para validación del formulario
test(events): cubrir carga de eventos vacíos
```

### `chore`

Se utiliza para tareas de mantenimiento que no afectan directamente la funcionalidad del sitio.

```text
chore: actualizar dependencias
chore(config): agregar variables de entorno de desarrollo
```

### `build`

Se utiliza para cambios relacionados con el sistema de construcción, empaquetado o dependencias.

```text
build: configurar generación de archivos estáticos
build(deps): actualizar versión de Next.js
```

### `ci`

Se utiliza para cambios en integración continua o automatizaciones.

```text
ci: agregar validación de formato en pull requests
ci(deploy): configurar despliegue automático
```

### `perf`

Se utiliza para mejoras de rendimiento.

```text
perf(images): optimizar carga de imágenes
perf(sermons): reducir solicitudes al cargar predicaciones
```

### `revert`

Se utiliza para revertir un commit anterior.

```text
revert: revertir cambio en navegación principal
```

## Cuerpo del commit

El cuerpo es opcional y debe utilizarse cuando la descripción breve no es suficiente.

Debe separarse del encabezado por una línea en blanco.

```text
feat(sermons): agregar filtros de predicaciones

Permitir filtrar las predicaciones por predicador, tema y fecha.
Mantener los filtros seleccionados en la URL.
```

El cuerpo debe explicar:

- Qué cambió.
- Por qué fue necesario.
- Cualquier decisión importante de implementación.

No debe explicar detalles evidentes que ya pueden entenderse leyendo el código.

## Referencias a tareas o incidencias

Cuando el commit esté relacionado con una tarea o incidencia, debe incluirse su referencia al final.

```text
feat(events): agregar registro para actividades

Refs: #24
```

Cuando el commit cierre completamente una incidencia:

```text
fix(contact): corregir error al enviar el formulario

Closes: #31
```

## Cambios incompatibles

Cuando un cambio rompa compatibilidad con una versión anterior, debe indicarse con `!` después del tipo o alcance.

```text
feat(api)!: cambiar estructura de respuesta de predicaciones
```

También debe explicarse en el pie del commit:

```text
feat(api)!: cambiar estructura de respuesta de predicaciones

BREAKING CHANGE: el campo `speaker` fue reemplazado por `preacher`.
```

## Commits atómicos

Cada commit debe representar un solo cambio lógico.

Evitar commits que mezclen tareas no relacionadas:

```text
feat(home): agregar testimonios y corregir formulario y actualizar dependencias
```

Es preferible dividirlo:

```text
feat(home): agregar sección de testimonios
fix(contact): corregir validación del correo
chore(deps): actualizar dependencias
```

## Frecuencia de los commits

Se recomienda hacer commits:

- Al completar una unidad lógica de trabajo.
- Antes de iniciar una modificación grande.
- Después de corregir un error específico.
- Después de agregar o actualizar pruebas.
- Antes de cambiar de rama o tarea.

No se recomienda hacer commits con código incompleto o que no pueda ejecutarse, excepto cuando el equipo haya acordado utilizar commits temporales en una rama personal.

## Commits temporales

Los mensajes como los siguientes no deben llegar a las ramas principales:

```text
wip
cambios
prueba
fix
último cambio
ahora sí
```

Si se utilizan durante el desarrollo, deben combinarse o corregirse antes de crear el pull request.

## Ejemplos recomendados

```text
feat(home): agregar sección de bienvenida
feat(sermons): mostrar predicaciones recientes
feat(events): agregar página de actividades
fix(navigation): corregir enlace a la página de ministerios
fix(contact): mostrar mensaje cuando falla el envío
docs: agregar guía para crear commits
style(footer): mejorar distribución en pantallas pequeñas
refactor(api): centralizar manejo de errores
test(events): agregar pruebas para eventos sin fecha
chore(deps): actualizar dependencias del proyecto
ci: ejecutar pruebas en cada pull request
perf(images): habilitar carga diferida
```

## Ejemplos que deben evitarse

```text
cambios
actualización
fix: arreglar cosas
feat: nueva funcionalidad
commit final
trabajando en la página
se modificaron varios archivos
```

Estos mensajes no explican con precisión qué cambió ni qué parte del sistema fue afectada.

## Plantilla recomendada

```text
tipo(alcance): descripción breve

Descripción opcional del cambio y su propósito.

Refs: #número
```

## Lista de verificación

Antes de crear un commit, verificar que:

- El commit contiene un solo cambio lógico.
- El tipo representa correctamente el cambio.
- El alcance identifica la sección afectada.
- La descripción es clara y específica.
- El mensaje comienza con un verbo en infinitivo.
- El mensaje no termina con punto.
- Las pruebas relacionadas fueron ejecutadas.
- No se incluyeron archivos sensibles, credenciales ni variables de entorno privadas.
- El commit no contiene mensajes temporales como `wip` o `cambios`.

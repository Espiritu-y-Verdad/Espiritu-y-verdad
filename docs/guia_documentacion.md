# Guía de documentación

Esta guía responde tres preguntas: **qué documentar, cuándo hacerlo y cómo escribirlo**. Aplica a HTML, CSS, JavaScript, TypeScript, Python, Angular y Node.js.

## Regla principal

Documentá aquello que una persona nueva **no pueda entender rápido solo leyendo el código**. Si el código ya es evidente, no agregues un comentario que lo repita.

```js
// No hace falta: suma uno a total.
total += 1;
```

```js
// Importante: el límite evita que una persona envíe el formulario dos veces.
if (isSubmitting) return;
```

## Cuándo debo documentar

| Situación | Qué documentar | Dónde |
| --- | --- | --- |
| Creás una función, componente, clase o endpoint para que otros lo usen | Para qué sirve, qué recibe y qué devuelve | Junto al código |
| Una regla de negocio no es obvia | La regla y el motivo | Junto al código |
| Agregás una carpeta o módulo | Su responsabilidad y cómo usarlo | `README.md` en la carpeta |
| Cambiás instalación, ejecución o configuración | Los pasos exactos | README principal o `docs/` |
| Tomás una decisión que afecta varias partes del sitio | Problema, decisión y consecuencia | Documento en `docs/` |

**No esperes al final.** Escribí o actualizá la documentación en el mismo Pull Request que cambia el código.

## Cómo documentar código

Usá estas cuatro partes. No siempre necesitás las cuatro, pero empezá por ellas:

1. **Propósito:** qué hace y por qué existe.
2. **Contrato:** qué recibe, qué devuelve y qué condiciones o límites tiene.
3. **Uso:** un ejemplo mínimo cuando otra parte del proyecto debe utilizarlo.
4. **Verificación:** cómo comprobar que funciona.

### Plantilla para copiar

```text
Propósito: [qué problema resuelve]
Contrato: recibe [entrada]; devuelve o muestra [resultado].
Uso: [ejemplo mínimo, si otra parte debe usarlo]
Verificación: [prueba o resultado esperado]
```

### Ejemplo realista

```text
Propósito: Mostrar las actividades publicadas para informar los próximos encuentros.
Contrato: recibe actividades visibles; muestra fecha, título y ubicación. Ignora actividades sin fecha.
Uso: <activity-list [activities]="activities"></activity-list>
Verificación: Con una actividad válida y otra sin fecha, solo se muestra la válida.
```

En HTML, CSS y JavaScript podés usar comentarios. En TypeScript, usá TSDoc/JSDoc; en Python, docstrings; para módulos o procesos, Markdown. **El formato cambia; las cuatro preguntas no.**

## Ejemplos por tecnología

| Tecnología | Documentá especialmente |
| --- | --- |
| HTML / Angular | Qué datos espera un componente, estados vacíos y accesibilidad no evidente. |
| CSS | Por qué existe una regla compleja, una variable o un ajuste para compatibilidad. |
| JavaScript / TypeScript | Entradas, salida, errores y efectos secundarios de funciones públicas. |
| Python | Parámetros, retorno y excepciones de funciones o clases reutilizables. |
| Node.js | Variables de entorno, endpoints, permisos y cómo ejecutar procesos. |

## Antes de abrir el Pull Request

- [ ] Agregué documentación si creé algo reutilizable, una regla no obvia o un proceso nuevo.
- [ ] Actualicé los pasos si cambió cómo instalar, ejecutar o configurar el proyecto.
- [ ] Mi ejemplo usa nombres y datos reales del proyecto.
- [ ] Quité comentarios que solo repiten el código.
- [ ] Otra persona junior puede saber qué hace, cómo usarlo y cómo verificarlo.
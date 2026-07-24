# Cómo colaborar

Gracias por aportar a **Espíritu y Verdad**. Trabajamos con **Git Flow** para que los cambios lleguen a producción de forma ordenada y segura.

## Flujo rápido

1. Actualizá tu rama base.
2. Creá una rama según el tipo de cambio.
3. Hacé cambios pequeños, probalos y confirmalos con commits claros.
4. Abrí un Pull Request hacia la rama indicada.
5. Integrá el cambio solo después de la revisión.

## Ramas del proyecto

| Rama | Propósito | Recibe cambios desde |
| --- | --- | --- |
| `main` | Código publicado en producción. | `release/*` y `hotfix/*` |
| `develop` | Integración del próximo lanzamiento. | `feature/*` |
| `feature/*` | Una funcionalidad o mejora. | `develop` |
| `release/*` | Preparación y correcciones del próximo lanzamiento. | `develop` |
| `hotfix/*` | Corrección urgente en producción. | `main` |

No se debe hacer *push* directo a `main` ni a `develop`.

## Crear una rama

Partí siempre de la rama que corresponda y mantené el nombre en minúsculas, con guiones.

```bash
# Nueva funcionalidad
git switch develop
git pull
git switch -c feature/calendario-actividades

# Corrección urgente de producción
git switch main
git pull
git switch -c hotfix/formulario-contacto
```

Usá `feature/` para funcionalidades, `release/` para preparar versiones y `hotfix/` solo para incidentes en producción.

## Commits y Pull Requests

- Hacé commits pequeños y con un solo propósito.
- Seguí las reglas de [convenciones de commits](guia_convenciones_commits.md).
- Explicá en el Pull Request qué cambió y cómo lo verificaste.
- Antes de pedir revisión, actualizá tu rama con su base y resolvé conflictos localmente.

## Finalizar una rama

- `feature/*` se revisa y se integra en `develop`.
- `release/*` se integra en `main` y también vuelve a `develop`.
- `hotfix/*` se integra en `main` y también vuelve a `develop`.

Después de integrar el Pull Request, eliminá la rama remota y local si ya no se necesita.

## Lista antes de abrir un Pull Request

- [ ] La rama sale de la base correcta.
- [ ] El cambio funciona y fue probado.
- [ ] Los commits siguen las convenciones del repositorio.
- [ ] El Pull Request apunta a la rama correcta.

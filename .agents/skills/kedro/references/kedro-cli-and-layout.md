# Kedro CLI and Layout Reference

## Standard layout cues

Expect this layout in a conventional Kedro project:

```text
project/
├── conf/
│   ├── base/
│   └── local/
├── data/
├── notebooks/
├── src/
│   └── <package_name>/
│       ├── pipelines/
│       ├── pipeline_registry.py
│       └── settings.py
├── tests/
└── pyproject.toml
```

A minimal Kedro project can be much smaller, but standard layout should be the default recommendation for collaborative or growing projects.

## High-value commands

### Create a project

```bash
uvx kedro new
```

Use for new projects. Recommend selecting testing and linting early unless there is a clear reason to keep the scaffold minimal.

### Create a modular pipeline

```bash
kedro pipeline create <pipeline_name>
```

Use when a new workflow stage deserves its own folder, parameters, and tests.

### List registered pipelines

```bash
kedro registry list
```

Use to verify whether the registry sees the expected pipelines.

### Describe a pipeline

```bash
kedro registry describe <pipeline_name>
```

Use when debugging wiring and dependencies.

### Run the project

```bash
kedro run
```

Use to validate the basic project lifecycle.

### Run with runtime parameters

```bash
kedro run --params="training.learning_rate:0.1"
```

Use for controlled run-time overrides instead of editing committed config for one-off experiments.

### Package the project

```bash
kedro package
```

Use when preparing a deployable artifact. Remember that source and configuration are packaged separately, and local config is excluded from the packaged configuration artifact.

## File responsibilities

### `pyproject.toml`
- Define Python project metadata.
- Contain `[tool.kedro]` metadata.
- Keep tool configuration such as pytest or Ruff when used.

### `settings.py`
- Register hooks.
- Override settings such as config source when intentionally needed.
- Keep project-wide framework settings, not business logic.

### `pipeline_registry.py`
- Register named pipelines.
- Define the `__default__` composition.
- Keep composition simple enough to inspect quickly.

### `nodes.py`
- Store transformation logic.
- Keep functions importable and testable.

### `pipeline.py`
- Wire functions into nodes and nodes into a pipeline.
- Express dependencies explicitly through dataset and parameter names.

### `catalog*.yml`
- Declare datasets and storage details.
- Use this to move I/O concerns out of Python code.

### `parameters*.yml`
- Store tuneable business or modeling parameters.
- Prefer grouped names that communicate intent.

### `credentials*.yml`
- Store secrets only in non-versioned local configuration unless a dedicated secret manager hook is used.

## Choosing standard vs minimal structure

### Recommend standard structure when:
- the project has more than one workflow stage
- more than one person will touch the code
- configuration differs by environment
- the user wants maintainability, packaging, or deployment readiness

### Consider minimal structure when:
- the goal is educational
- the repository is tiny and intentionally constrained
- Kedro is being embedded into an existing project with a custom source layout

Even in minimal setups, preserve Kedro essentials: a valid `pyproject.toml`, `settings.py`, and `pipeline_registry.py`.

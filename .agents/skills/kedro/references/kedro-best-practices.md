# Kedro Best Practices Reference

## Core principle

Exploit Kedro by making structure do the coordination work.

The more the project expresses orchestration through pipelines, I/O through the catalog, and behavior through configuration, the less logic leaks into ad hoc scripts and fragile glue code.

## Architecture checklist

### Nodes
- Keep node functions small, explicit, and importable.
- Prefer pure transformations over functions that both fetch and transform data.
- Make inputs and outputs obvious from the function signature.
- Return domain objects or data structures that are easy to test.

### Pipelines
- Build workflows from nodes with explicit dataset names.
- Group nodes by a coherent workflow responsibility.
- Split pipelines before they become “main pipeline plus everything else”.
- Use tags only when they improve operability; do not rely on tags as architecture.

### Registry
- Keep `register_pipelines()` readable.
- Compose `__default__` intentionally.
- Avoid hidden cross-pipeline dependencies that only exist through conventions nobody can see.

### Catalog
- Put storage concerns in the catalog.
- Use semantic dataset names.
- Use anchors or dataset factories when many entries share patterns.
- Use transcoding only when the same underlying data truly needs multiple representations.

### Parameters
- Use named parameter groups.
- Keep shareable defaults in base config.
- Use local or runtime overrides for environment-specific behavior.
- Avoid turning every implementation detail into a parameter.

### Hooks
- Use hooks for observability, validation, credentials, metadata, and debugging.
- Keep hooks thin and infrastructure-oriented.
- Avoid writing business workflows inside hooks.

### Testing
- Test node functions as normal Python.
- Add pipeline tests where wiring errors are costly.
- Keep heavy end-to-end tests selective.

### Notebooks
- Use notebooks to explore, inspect catalog data, or validate hypotheses.
- Promote stable code into `src/` quickly.
- Do not let notebooks become the only source of truth.

## Suggested decomposition patterns

### Typical analytics / data science project
- `data_ingestion`
- `data_processing`
- `feature_engineering`
- `training`
- `evaluation`
- `reporting`

### Typical inference / batch scoring project
- `data_ingestion`
- `validation`
- `feature_extraction`
- `inference`
- `postprocessing`
- `publishing`

### Typical data engineering project
- `extract`
- `staging`
- `transform`
- `quality`
- `publish`

## Migration playbook for messy repositories

### From notebooks
1. Identify stable transformations.
2. Move them into plain Python functions.
3. Wrap them as nodes.
4. Replace notebook file access with catalog datasets.
5. Move constants into parameters.
6. Keep the notebook only as a thin exploration layer.

### From scripts
1. Separate orchestration from business logic.
2. Move load/save behavior into the catalog.
3. Break long scripts into node-sized functions.
4. Create one or more pipelines.
5. Register the pipelines and add tests.

### From homegrown framework glue
1. Keep only abstractions that add domain value.
2. Remove wrappers that duplicate Kedro concepts.
3. Prefer native Kedro CLI, config, and catalog behavior.

## Anti-patterns and fixes

### Anti-pattern: nodes open files directly
**Fix:** Declare datasets in the catalog and pass dataset names through pipeline wiring.

### Anti-pattern: one `pipeline.py` for the entire repository
**Fix:** Create modular pipelines by responsibility and compose them in the registry.

### Anti-pattern: secrets in committed config
**Fix:** Move secrets to `conf/local` or an external secret source loaded through hooks.

### Anti-pattern: node functions full of runtime toggles
**Fix:** Move user-controlled behavior into parameters and keep function internals simpler.

### Anti-pattern: logic only exists in notebooks
**Fix:** Promote the logic into importable modules and call it from the notebook or Kedro run.

## Review checklist for pull requests
- Does each new node have a clear single responsibility?
- Did any new file path or credential get hardcoded into Python?
- Did new datasets get added to the catalog with clear names?
- Are new parameters grouped coherently?
- Is the pipeline boundary still understandable?
- Were tests added for important new behavior?
- Does the change use Kedro features instead of bypassing them?

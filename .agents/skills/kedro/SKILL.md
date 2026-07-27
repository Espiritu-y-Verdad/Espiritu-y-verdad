---
name: kedro-project-builder
description: Guide for implementing, refactoring, validating, and operationalising Kedro projects. This skill should be used when users need to materialise an approved pipeline design in Kedro, create or extend modular pipelines, wire the catalog and parameters, register hooks, add tests, package the project, or inspect and repair an existing Kedro repository.
---

# Kedro Project Builder

## Overview

Implement pipeline architectures in Kedro without letting framework convenience distort the intended design.

Use this skill to help another Claude instance turn an approved pipeline blueprint into a Kedro project or Kedro change set. Treat Kedro as the implementation muscle for a design that should already be conceptually stable.

Optimise for Kedro-native execution:

- express orchestration through pipelines
- express I/O through the Data Catalog
- express tuneable behaviour through configuration
- keep logic importable, testable, and modular
- use the Kedro CLI as the default operational interface for standard tasks

## What This Skill Provides

1. CLI-first workflows for standard Kedro operations
2. Translation of architecture blueprints into Kedro structure
3. Guidance for modular pipelines, catalog design, parameters, hooks, and tests
4. Validation of whether a Kedro implementation preserves the original design intent
5. Repair guidance for Kedro projects that drifted into scripts, hidden I/O, or weak boundaries
6. Packaging guidance for deployable Kedro artifacts

## Relationship to Other Skills

Use an architecture-planning skill first when the work still depends on unresolved design choices such as stage boundaries, restart strategy, checkpoint placement, observability model, or test strategy.

Use this skill after the architecture is stable enough to implement.

Treat the architecture skill as the decision-making layer.
Treat this Kedro skill as the implementation layer.

Do not silently redesign the architecture just because Kedro offers a convenient shortcut. If the blueprint is weak, contradictory, or difficult to express cleanly in Kedro, say so explicitly, explain the tension, and propose the smallest safe adjustment.

## When to Use This Skill

Use this skill when the request mentions or clearly implies one or more of the following:

- `kedro`
- `kedro new`
- `kedro pipeline create`
- `kedro run`
- `kedro package`
- `kedro registry list`
- `kedro registry describe`
- `pipeline_registry.py`
- `settings.py`
- `catalog.yml`
- `parameters.yml`
- `credentials.yml`
- modular pipelines
- Data Catalog
- Kedro hooks
- Kedro packaging
- migrating a script, notebook, analytics workflow, ML workflow, or batch pipeline into Kedro
- implementing a previously approved pipeline blueprint in Kedro

Also use this skill when a repository visibly follows Kedro conventions even if the word “Kedro” is not explicitly used.

## Core Operating Principle

Prioritise Kedro-native implementation without compromising the architecture contract.

When there is an approved blueprint, preserve these elements unless there is a strong reason not to:

- stage boundaries
- restart boundaries
- checkpoint intent
- observability requirements
- contract boundaries between stages
- testability assumptions

If Kedro implementation choices would weaken one of those properties, surface the problem instead of hiding it.

## Implementation Contract Mode

When the user provides an explicit architecture or blueprint, switch into implementation contract mode.

In this mode:

1. Treat the blueprint as the primary source of truth.
2. Translate each stage into Kedro-facing structures.
3. Flag any ambiguity that would materially affect implementation.
4. Refuse silent flattening of multiple stages into one vague pipeline just because it is faster to scaffold.
5. Preserve restart and checkpoint semantics deliberately.
6. Preserve observability and testing requirements as first-class design inputs.
7. Mark any deviation from the blueprint as one of:
   - required for Kedro compatibility
   - recommended for maintainability
   - optional convenience

Do not present optional convenience as architectural necessity.

## Default Output Contract

When implementing or planning Kedro work from a blueprint, produce these sections:

1. implementation summary
2. mapping from architectural stages to Kedro modular pipelines
3. catalog implications
4. parameter groups
5. hook responsibilities
6. code and file layout impact
7. testing plan
8. validation commands
9. deviations or tensions

## Bundled Resources

Use bundled resources deliberately instead of duplicating their contents in this file.

### Scripts

#### `scripts/scan_kedro_project.py`

Use this script when a repository audit is needed before refactoring or debugging.

Run:

```bash
python scripts/scan_kedro_project.py <project_root>
```

Use the output to detect:

- missing `pyproject.toml`
- missing `[tool.kedro]` metadata
- missing `settings.py`
- missing `pipeline_registry.py`
- missing `conf/base` or `conf/local`
- missing modular pipeline folders
- missing tests
- missing catalog or parameter configuration

Do not run this script for simple CLI questions such as how to create a project or create a pipeline. Reserve it for inspection, debugging, or refactoring work.

### References

#### `references/kedro-cli-and-layout.md`

Consult this reference for:

- standard Kedro project layout
- official high-value CLI commands
- file responsibilities
- when to recommend standard versus minimal structure

Load this reference whenever the task involves project creation, pipeline creation, layout decisions, pipeline inspection, runtime commands, or packaging.

#### `references/kedro-best-practices.md`

Consult this reference for:

- architecture decisions
- decomposition patterns
- anti-patterns and fixes
- migration guidance
- review criteria for maintainability

Load this reference whenever the task involves refactoring, project improvement, modularisation, catalog usage, hooks, testing, or pipeline boundaries.

#### `references/blueprint-to-kedro-handoff.md`

Consult this reference when translating an approved architecture blueprint into Kedro structures without degrading the design.

Load this reference whenever the user already has stage boundaries, restart points, checkpoint intent, observability requirements, or testing requirements and wants them expressed cleanly in Kedro.

## Workflow

Follow this workflow in order unless there is a clear reason not to.

### 1. Classify the Task

Classify the request into one of these groups:

- standard Kedro CLI operation
- new implementation from approved blueprint
- existing project inspection
- debugging or repair
- refactoring into Kedro
- architectural drift correction
- packaging or deployment readiness

If the task is a standard Kedro CLI operation, use the CLI-first workflow below and do not begin with a repository audit.

### 2. Handle Standard Kedro CLI Operations First

For the following operations, lead with the exact command.

#### Create a new project

```bash
uvx kedro new
```

Use this as the default command when the user wants to start a new Kedro project.

#### Create a modular pipeline

```bash
kedro pipeline create <pipeline_name>
```

Use this as the default command when a new workflow stage deserves its own folder, parameters, and tests.

#### List registered pipelines

```bash
kedro registry list
```

Use this to verify what the project registry currently exposes.

#### Describe a pipeline

```bash
kedro registry describe <pipeline_name>
```

Use this to inspect dependencies and wiring for a named pipeline.

#### Run the project

```bash
kedro run
```

Use this to validate the project lifecycle or execute the default pipeline composition.

#### Run with runtime parameters

```bash
kedro run --params="group.key:value"
```

Use this for one-off runtime overrides instead of editing committed configuration.

#### Package the project

```bash
kedro package
```

Use this when preparing a deployable or distributable Kedro artifact.

### 3. Enforce CLI-First Response Order

For standard CLI tasks, structure the response in this order:

1. exact Kedro CLI command
2. short explanation of when to use it
3. short validation or follow-up command if useful
4. optional deeper architecture guidance

Do not start with a long conceptual explanation when the user asked how to perform a basic Kedro operation.

### 4. Implement from Blueprint When Available

When the user already has a pipeline design, do not answer as if the work starts from scratch.

Extract and preserve:

- named stages
- intended boundaries
- execution order
- checkpoint points
- restart boundaries
- quality gates
- observability requirements
- testing expectations
- deployment or packaging expectations

Then map them into Kedro terms:

- modular pipelines
- node boundaries
- dataset names
- catalog entries
- parameter groups
- hooks
- tests
- registry composition

If the blueprint contains unresolved contradictions, identify them before proposing file changes.

### 5. Inspect Existing Projects When Needed

Inspect the current repository only when the task involves debugging, refactoring, drift detection, or validating an existing project.

Check these first:

- `pyproject.toml`
- `src/<package_name>/settings.py`
- `src/<package_name>/pipeline_registry.py`
- `src/<package_name>/pipelines/`
- `conf/base/`
- `conf/local/`
- `tests/`

Run `scripts/scan_kedro_project.py` when a structural audit will help identify missing Kedro primitives or layout problems.

Explicitly verify:

- presence of `[tool.kedro]`
- consistency of `package_name`, `project_name`, and `source_dir`
- existence of `settings.py`
- existence of `pipeline_registry.py`
- existence of `conf/base` and `conf/local` when default config layout is expected
- existence of modular pipeline folders
- existence of catalog and parameter config files
- existence of tests

### 6. Apply Kedro’s Separation of Concerns

Restructure work so each concern lives in the right place.

#### Nodes

- keep node functions small, explicit, and importable
- prefer pure transformations
- make inputs and outputs obvious from the function signature
- avoid loading files or embedding machine-specific paths inside nodes unless there is a strong reason
- do not hide restart or checkpoint semantics inside opaque helper code

#### Pipelines

- build workflows declaratively in `pipeline.py`
- use explicit dataset names and parameter names
- keep one coherent responsibility per modular pipeline
- avoid hiding orchestration logic inside nodes
- do not collapse distinct architecture stages into one pipeline unless the trade-off is stated clearly

#### Registry

- register pipelines centrally in `pipeline_registry.py`
- keep named pipeline composition easy to inspect
- compose `__default__` intentionally
- preserve the intended stage ordering visibly

#### Catalog

- declare datasets in catalog configuration
- keep storage concerns out of Python nodes
- use semantic dataset names
- use YAML anchors or factories when repeated structure would otherwise create duplication
- represent checkpoint datasets explicitly when restartability matters

#### Parameters

- move tuneable behaviour into `parameters*.yml`
- keep shareable defaults in `conf/base`
- keep machine-specific overrides or secrets in `conf/local`
- avoid hardcoding important constants across Python modules
- group parameters by architectural concern, not by incidental implementation detail

#### Hooks

- use hooks for observability, validation, credentials, metadata, and debugging
- keep hooks infrastructure-oriented
- avoid placing domain workflows or business transformations inside hooks
- use hooks to support run metadata, tracing, or validation only when the blueprint calls for them

### 7. Preserve Restartability and Operability

Treat these as explicit implementation concerns, not afterthoughts.

When the architecture requires restartability:

- model restart boundaries through stage outputs or checkpoint datasets
- prefer idempotent node behaviour where possible
- keep partial progress detectable
- avoid side effects that cannot be retried safely
- separate irreversible publishing from recomputable processing

When the architecture requires observability:

- identify which metrics belong at run level versus stage level
- wire hooks or logging points that expose meaningful progress and failure context
- preserve traceability between inputs, outputs, and produced artifacts

If the proposed Kedro implementation weakens rerun safety or observability, call it out.

### 8. Prefer Kedro-Native Refactoring Moves

When refactoring notebooks, scripts, or homegrown workflow code into Kedro, follow this pattern.

#### From notebooks

1. identify stable logic
2. move logic into plain Python functions
3. wrap functions as nodes
4. replace ad hoc file access with catalog datasets
5. move constants into parameters
6. keep notebooks as thin exploration layers

#### From scripts

1. separate orchestration from business logic
2. move load and save behaviour into the catalog
3. break long scripts into node-sized functions
4. build one or more pipelines
5. register pipelines and add tests

#### From custom framework glue

1. keep only abstractions that add real domain value
2. remove wrappers that duplicate Kedro concepts
3. prefer native Kedro configuration, catalog, registry, and CLI behaviour

### 9. Challenge Weak Kedro Mappings

Do not agree with a mapping just because it is possible.

Challenge the implementation when you see one of these problems:

- one modular pipeline hiding several unrelated stages
- node functions that fetch, transform, and publish in one step
- checkpoint intent lost because everything is recomputed in one opaque run
- side effects mixed with recomputable transformations
- catalog entries too vague to express contracts clearly
- hooks being used as a dumping ground for workflow logic
- tests only at end-to-end level with no node-level coverage
- runtime parameters replacing missing design decisions

When challenging a weak mapping:

1. state the concern directly
2. explain the operational risk
3. propose a safer Kedro-native alternative
4. state the trade-off

### 10. Validate the Result

Before finishing, verify that the Kedro design is coherent.

Check:

- pipeline names align with registry entries
- dataset names in code align with catalog entries
- parameter names in code align with configuration keys
- `conf/base` contains shareable defaults
- `conf/local` is reserved for secrets or user-specific overrides
- hooks are registered correctly in `settings.py`
- tests cover node logic and critical pipeline wiring
- restart or checkpoint assumptions remain visible in the final structure
- observability commitments are not silently dropped

Recommend relevant validation commands such as:

```bash
kedro registry list
kedro registry describe <pipeline_name>
kedro run
kedro package
```

## Response Strategy

When helping another Claude instance implement Kedro work, follow this strategy:

1. determine whether the task is operational, implementation, or repair-oriented
2. for operational tasks, lead with the exact Kedro CLI command
3. for implementation tasks, map the blueprint to Kedro structures explicitly
4. propose the smallest structural change that preserves the design intent
5. generate code that fits Kedro’s file layout and naming conventions
6. identify the exact files to touch and why they need to change
7. state any tensions between architecture and implementation clearly
8. end with validation steps using Kedro commands or tests

## Best Practices

### Project Structure

Prefer the standard Kedro layout unless the repository is intentionally minimal or embedded into an existing structure.

Treat these as first-class project artifacts:

- `pyproject.toml`
- `settings.py`
- `pipeline_registry.py`
- `conf/base`
- `conf/local`
- `src/<package_name>/pipelines`
- `tests`

### Modular Pipelines

Create modular pipelines early instead of waiting for a monolithic pipeline to become hard to reason about.

Use boundaries such as:

- `data_ingestion`
- `data_processing`
- `feature_engineering`
- `training`
- `evaluation`
- `inference`
- `reporting`
- `validation`
- `postprocessing`
- `publishing`

Only merge adjacent stages when the trade-off is explicit and the architecture does not rely on a stronger boundary.

### Catalog Usage

Keep I/O declarative through the Data Catalog.

Prefer:

- semantic dataset names
- catalog-defined storage behaviour
- reuse patterns through anchors or factories
- transcoding only when the same underlying data truly needs multiple representations
- explicit checkpoint datasets when restartability matters

Avoid:

- hardcoded file paths in nodes
- hidden reads and writes in utility modules
- duplicated catalog configuration with only tiny differences
- generic dataset names that weaken stage contracts

### Parameters and Configuration

Keep configuration layered and predictable.

Prefer:

- shareable defaults in `conf/base`
- secrets and local overrides in `conf/local`
- runtime overrides through `kedro run --params=...`
- strongly named parameter groups such as `training`, `features`, `split`, `inference`, or `quality`

Avoid:

- secrets in committed config
- scattering configuration values across Python files
- turning every trivial local constant into a parameter
- using parameters to mask unresolved architecture decisions

### Hooks

Use hooks for cross-cutting concerns, not for core workflow logic.

Good uses:

- observability
- validation
- metadata inspection
- credential loading
- diagnostics

Bad uses:

- main business transformations
- large branching workflow logic
- compensation for poor pipeline design

### Testing

Test node functions as plain Python wherever possible.

Prefer:

- fast unit tests for nodes
- focused pipeline wiring tests where miswiring would be costly
- selective integration tests for important end-to-end behaviour
- explicit tests around checkpoint, rerun, or publishing boundaries when they matter

### Notebooks

Use notebooks for exploration, inspection, and validation of hypotheses.

Promote stable code into `src/` quickly. Do not allow notebooks to become the only source of truth for workflow logic.

### Packaging and Deployment

Prefer Kedro’s packaging workflow when the task involves shipping or operationalising a project.

Remember:

- packaged Python source and configuration are separate artifacts
- local configuration is excluded from packaged config
- environment-specific configuration should be deliberate and documented

## Common Anti-Patterns

Correct these aggressively when found:

- one giant pipeline containing every stage
- nodes that both transform data and fetch data from disk or external systems
- direct file reads and writes scattered through Python code instead of using the catalog
- workflow logic hidden in notebooks or shell scripts
- hardcoded paths, hyperparameters, or credentials in Python
- hooks used as a dumping ground for domain logic
- vague dataset names such as `data`, `output`, or `result2`
- Kedro-like structure that is missing `settings.py`, `pipeline_registry.py`, or proper config layering
- blueprint-approved restart boundaries lost during implementation
- architecture-approved observability requirements omitted because they are inconvenient to wire

## Do Not Do This

For standard Kedro operations, do not:

- start with architecture explanation instead of the command
- recommend manual `mkdir` or `touch` scaffolding as the default
- replace Kedro CLI with generic Python project setup
- bury the correct command in the middle or end of the answer
- audit the repository before answering a simple CLI usage question

For blueprint implementation tasks, do not:

- flatten the design without saying so
- silently merge stages with different failure or restart characteristics
- move business workflow decisions into hooks
- replace explicit checkpoint design with wishful thinking about reruns
- claim maintainability while hiding responsibilities in large nodes

## Quick Examples

### Create a new Kedro project

Lead with:

```bash
uvx kedro new
```

Then explain that this is the standard way to scaffold a new Kedro project and suggest `kedro run` as a next validation step.

### Create a new modular pipeline

Lead with:

```bash
kedro pipeline create training
```

Then explain that this scaffolds a modular pipeline and suggest `kedro registry list` as a follow-up validation step.

### Implement a blueprint with `validation`, `feature_extraction`, `inference`, and `publishing`

Start by mapping each stage into Kedro modular pipelines, then define:

- the expected `pipeline_registry.py` composition
- the catalog datasets or checkpoint datasets needed between stages
- the parameter groups that belong in `parameters*.yml`
- the hooks needed for observability or validation
- the tests needed to preserve the architecture contract

Do not jump directly to `kedro pipeline create inference` and ignore the rest of the design.

### Inspect pipelines

Lead with:

```bash
kedro registry list
```

### Inspect one pipeline

Lead with:

```bash
kedro registry describe training
```

### Package a project

Lead with:

```bash
kedro package
```

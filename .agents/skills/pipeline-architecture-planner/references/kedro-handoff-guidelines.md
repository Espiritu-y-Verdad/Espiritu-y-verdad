# Kedro Handoff Guidelines

Use this reference when translating a pipeline architecture blueprint into implementation guidance for a Kedro-focused skill.

## Principle

Translate architecture into Kedro responsibilities without collapsing the design back into framework-first thinking.

The architecture should already be stable before the handoff begins. The handoff should explain how Kedro ought to materialise the design, not re-decide the architecture from scratch.

## Senior Review Lens

Challenge the handoff with these questions:

- Which architectural boundaries must Kedro preserve?
- Which restart assumptions require explicit persisted datasets?
- Which observability requirements imply hooks or run metadata handling?
- Which contracts must appear clearly in pipeline wiring, catalog design, or parameters?
- Which implementation shortcuts would quietly weaken the design?

Do not let Kedro convenience flatten important architectural boundaries.

## Handoff Goal

Produce enough implementation guidance that a Kedro implementation skill can:

- create modular pipelines with the right boundaries
- define catalog responsibilities correctly
- group parameters coherently
- place hooks in the right infrastructure-oriented roles
- plan tests around the architectural promises
- preserve the restartability and observability semantics agreed during design

## What the Handoff Should Include

### 1. Suggested modular pipeline names

Translate architectural stages into modular Kedro pipeline boundaries.

Examples:

- `data_ingestion`
- `validation`
- `feature_preparation`
- `training`
- `evaluation`
- `inference`
- `postprocessing`
- `publishing`

Do not force one Kedro pipeline per tiny stage if several stages belong to the same coherent workflow boundary.

### 2. Catalog concerns

State what kinds of datasets or persisted artifacts Kedro should manage.

Typical concerns:

- raw inputs
- validated intermediates
- feature datasets
- checkpoint outputs
- model artifacts
- reports or metrics
- publication-ready outputs

Do not write exact catalog YAML unless requested. Describe the concerns and persistence expectations.

### 3. Parameter groups

Translate architectural knobs into coherent parameter namespaces.

Typical groups:

- `ingestion`
- `validation`
- `features`
- `training`
- `inference`
- `quality`
- `publishing`
- `checkpointing`

Avoid pushing every implementation detail into parameters. Keep parameters aligned with real architectural variability.

### 4. Hook responsibilities

Identify only cross-cutting concerns that belong naturally in Kedro hooks.

Good candidates:

- run metadata collection
- observability setup
- validation summaries
- credentials or environment integration
- checkpoint metadata registration
- debugging or diagnostics

Bad candidates:

- core business transformations
- main orchestration logic
- domain-specific branching that should live in the pipeline design

### 5. Testing scope

Map architectural guarantees into Kedro-oriented tests.

Examples:

- node tests for pure transformations
- pipeline tests for critical wiring
- selective integration tests for publication or recovery flows

### 6. Open questions

List unresolved decisions that block safe implementation.

Examples:

- checkpoint invalidation rules not finalised
- publication semantics unclear
- partition key not confirmed
- data contract with downstream consumer still ambiguous

## Preserve These Architectural Semantics Explicitly

When they exist in the blueprint, make sure the Kedro implementation preserves them clearly:

- restart boundaries
- checkpoint trust levels
- partition-level recovery assumptions
- validation gates before publication
- traceability identifiers for outputs and checkpoints
- contract boundaries between stages

If Kedro implementation would blur one of these, say so in the handoff as a risk.

## How to Translate Common Architectural Decisions

### Architectural decision: explicit restart boundary after validation

Likely Kedro implications:

- separate validation-related pipeline boundary
- persisted validated dataset or checkpoint artifact
- pipeline tests for skip or rerun assumptions
- possible hooks for validation summary logging

### Architectural decision: partition-level recovery

Likely Kedro implications:

- partition-aware dataset strategy
- clear separation between partition discovery and partition processing logic
- observability around partition status
- tests for partial rerun assumptions

### Architectural decision: late publication after quality gate

Likely Kedro implications:

- distinct publishing boundary
- quality-check outputs persisted before publish step
- tests that failed quality checks block publish behaviour

## Pushback Triggers During Handoff

Challenge the implementation translation when you see these.

### Weak handoff: "We can just keep it in one pipeline for simplicity"

Pushback:

- ask whether that collapses a meaningful restart or observability boundary
- preserve the architecture unless the simplification is genuinely safe

### Weak handoff: "We can handle that in a hook"

Pushback:

- if the concern is business flow or domain branching, it likely belongs in the pipeline design, not a hook

### Weak handoff: "The catalog details can be figured out later"

Pushback:

- if restartability depends on persisted artifacts, catalog concerns are part of the architecture and must be explicit enough now

## Handoff Format

Prefer a concise, structured ending such as:

### Implementation Handoff for Kedro
- Suggested modular pipelines:
- Suggested catalog concerns:
- Suggested parameter groups:
- Suggested hooks:
- Suggested tests:
- Open questions:

## Anti-Patterns

### Anti-pattern: restate the whole architecture in Kedro terms only

Problem:

- loses framework-neutral reasoning and invites premature implementation bias

Fix:

- keep the handoff as a translation layer, not a replacement for the architecture

### Anti-pattern: jump straight to CLI commands

Problem:

- starts implementation before the design constraints are fully expressed

Fix:

- describe what Kedro should implement first; commands come later

### Anti-pattern: use hooks to compensate for weak stage boundaries

Problem:

- hides orchestration and domain logic in infrastructure mechanisms

Fix:

- keep business workflow decisions in the architecture and in pipeline boundaries

# Blueprint to Kedro Handoff

Use this reference when the architecture is already designed and the work now depends on translating that design into Kedro without diluting the operational intent.

## Core principle

Implement the architecture contract, not a simplified approximation of it.

Kedro should express the chosen stage boundaries, restart boundaries, contracts, and operational requirements. It should not erase them because a flatter structure is faster to scaffold.

## What to extract from the blueprint first

Before proposing any Kedro file changes, identify these elements explicitly:

- stage names
- stage purpose
- execution order
- fan-out or fan-in points
- checkpoint or materialisation points
- restart boundaries
- quality gates
- publishing boundaries
- observability expectations
- testing expectations
- open architectural risks

If any of these are unclear, say so before mapping the design into Kedro.

## Translation matrix

### Architectural stages → Kedro modular pipelines

Map each coherent stage or tightly coupled pair of stages into a modular pipeline.

Prefer one modular pipeline per clear architectural responsibility.

Examples:

- `extract` → `extract`
- `validation` → `validation`
- `feature_extraction` → `feature_extraction`
- `training` → `training`
- `evaluation` → `evaluation`
- `publishing` → `publishing`

Only merge stages when:

- the architecture does not rely on a boundary between them
- the failure characteristics are similar
- the restart behaviour remains acceptable
- the resulting pipeline still has a coherent responsibility

### Stage contracts → catalog datasets

Represent stage handoffs through explicit dataset names.

Prefer semantic names that communicate the contract, for example:

- `raw_events`
- `validated_events`
- `features_for_scoring`
- `scored_records`
- `publish_ready_payload`
- `checkpoint_feature_matrix`

Avoid vague names such as:

- `data`
- `output`
- `result`
- `intermediate_2`

When restartability matters, represent checkpoint intent explicitly through dedicated datasets rather than implicit assumptions.

### Decision points → parameters

Map user-controlled behaviour, thresholds, validation rules, and processing modes into grouped parameter sets.

Prefer groups such as:

- `validation`
- `features`
- `training`
- `inference`
- `quality`
- `publishing`

Do not move architecture decisions into parameters just to avoid choosing a structure.

### Cross-cutting concerns → hooks

Map observability, run metadata, credentials, diagnostics, and framework-level validation into hooks only when they are truly cross-cutting.

Keep hooks thin.

Do not use hooks to compensate for a missing pipeline stage.

### Reliability commitments → tests

Translate reliability expectations into explicit tests.

Examples:

- checkpoint boundary exists and can be reused
- publishing is separated from recomputable processing
- parameter groups are wired to the correct nodes
- validation stage rejects malformed input as expected
- pipeline composition preserves the intended stage order

## Restartability mapping rules

### Use explicit checkpoint datasets when:

- recomputation is expensive
- partial reruns must be supported
- downstream stages consume stable intermediates
- the blueprint requires restart from specific stages

### Keep intermediates ephemeral when:

- recomputation is cheap
- the data is deterministic and fast to rebuild
- storage cost is not justified
- restartability does not depend on persistence

### Separate irreversible side effects from recomputable stages

Keep publishing, notifications, and external writes in their own boundary whenever recovery safety matters.

Do not bury irreversible side effects inside transformation nodes.

## Observability mapping rules

When the blueprint asks for observability, decide which concerns belong where.

### Pipeline structure should make these observable:

- where the run is currently failing
- which boundary completed successfully
- what artifact or dataset version was produced
- whether rerun is safe from a specific boundary

### Hooks should support these concerns:

- run metadata
- structured diagnostics
- tracing identifiers
- centralised validation or logging hooks

### Nodes should expose or return data that supports these concerns without becoming logging-heavy blobs

Do not solve weak observability only with log statements. Sometimes the real fix is a clearer pipeline boundary.

## Testability mapping rules

### Unit tests

Test node functions as normal Python.

Prefer pure inputs and outputs.

### Wiring tests

Test pipeline construction when miswiring would be costly.

Verify:

- expected datasets are connected
- stage order is preserved
- required parameters are referenced correctly

### Selective integration tests

Use these for:

- critical end-to-end paths
- recovery-sensitive paths
- publishing boundaries
- data contract validation across stages

Do not rely only on end-to-end tests to catch structural mistakes.

## Acceptable deviation categories

When implementation must differ from the blueprint, label the deviation clearly.

### Required for Kedro compatibility

Use when Kedro or the surrounding environment imposes a real constraint.

### Recommended for maintainability

Use when the architecture can be preserved but expressed more cleanly in Kedro.

### Optional convenience

Use when the change is mostly about speed or simplicity and does not materially improve the system.

Do not disguise optional convenience as a requirement.

## Review questions before implementation is accepted

- Does every important stage boundary still exist in some visible Kedro form?
- Did any checkpoint or restart requirement disappear during translation?
- Are side effects isolated enough to rerun safely?
- Are catalog names strong enough to communicate contracts?
- Did hooks remain cross-cutting rather than becoming workflow containers?
- Can the resulting structure be tested without expensive end-to-end dependence for every change?
- Is `pipeline_registry.py` understandable to a new maintainer?
- Is the default pipeline composition intentional?

## Bad translations to challenge

### Bad translation: four architecture stages become one `main` pipeline

Why this is weak:

- boundary intent disappears
- restartability becomes vague
- observability gets harder
- tests become coarse and expensive

Safer alternative:

Keep distinct modular pipelines and compose them explicitly in the registry.

### Bad translation: checkpoint intent becomes an in-memory variable inside a node chain

Why this is weak:

- reruns cannot safely reuse progress
- failure recovery is unclear
- checkpoint visibility disappears

Safer alternative:

Represent the checkpoint as an explicit dataset or materialised stage output.

### Bad translation: publishing stays inside a transform node for convenience

Why this is weak:

- side effects become hard to retry safely
- recomputation and publication get coupled
- tests become brittle

Safer alternative:

Create a dedicated publishing boundary or modular pipeline.

## Recommended output shape

When helping another Claude instance implement from a blueprint, structure the answer like this:

1. blueprint summary
2. proposed modular pipelines
3. catalog mapping
4. parameter mapping
5. hooks mapping
6. testing mapping
7. deviations and trade-offs
8. concrete Kedro files to touch
9. validation commands

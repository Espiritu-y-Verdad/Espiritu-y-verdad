# Pipeline Decomposition Patterns

Use this reference when choosing how to split a pipeline into stages, how much modularity is justified, and where boundaries should become explicit.

## Principle

Decompose by responsibility, failure surface, and change rate.

Do not decompose merely because multiple functions exist. Do not keep stages fused merely because splitting them is inconvenient.

A good boundary reduces confusion, limits blast radius, and creates a clearer restart, observability, and testing story.

## Senior Review Lens

When reviewing a proposed stage breakdown, challenge it with these questions:

- What responsibility is this stage isolating?
- What changes independently here?
- What can fail here without forcing a full rerun?
- What contract becomes clearer if this boundary is made explicit?
- What operational cost appears if this boundary is introduced?
- Is this stage real, or is it just a thin wrapper around poor upstream decomposition?

Reject boundaries that add complexity without improving recoverability, traceability, or team comprehension.

## Common Decomposition Drivers

Prefer explicit stages when they isolate one of these drivers:

- different data trust levels
- different validation semantics
- different compute cost profiles
- different retry safety assumptions
- different ownership or release cadence
- different observability requirements
- different publication semantics

## Recommended Baseline Shapes

### Pattern 1: Linear Staged Pipeline

Typical shape:

- ingestion
- validation
- transformation
- quality gate
- publishing

Use when:

- the pipeline is mostly sequential
- dependencies are straightforward
- the main need is clarity and maintainability

Benefits:

- easy to understand
- good default for many batch workflows
- natural stage-level checkpoints

Risks:

- weak fit when independent branches should run separately
- can become bloated if validation, enrichment, and publication all accumulate inside a few large stages

### Pattern 2: Fan-Out Then Fan-In

Typical shape:

- shared ingestion
- multiple independent enrichment or transformation branches
- aggregation or reconciliation
- publication

Use when:

- several branches can run independently
- branch-specific failure should not invalidate all work immediately
- separate enrichments or calculations have different ownership or cost

Benefits:

- parallelism potential
- cleaner ownership boundaries
- easier branch-level retries

Risks:

- aggregation stage becomes fragile if contracts are weak
- branch proliferation can create operational noise

### Pattern 3: Checkpointed Multi-Stage Batch

Typical shape:

- source acquisition
- structural validation
- canonicalisation
- expensive transformation or feature generation
- quality gate
- publish or handoff

Use when:

- recomputation is expensive
- upstream data may drift between reruns
- downstream publication must be controlled carefully

Benefits:

- strong restartability story
- better debugging and auditability
- natural handoff points for downstream consumers

Risks:

- storage overhead
- checkpoint sprawl if every stage materialises without justification

### Pattern 4: Partition-Oriented Pipeline

Typical shape:

- partition discovery
- partition processing
- partition-level validation
- aggregate reconciliation
- publication

Use when:

- partitions can fail independently
- backfills or partial reruns are common
- operational visibility per partition matters

Benefits:

- granular recovery
- reduced blast radius
- strong fit for large-scale batch processing

Risks:

- partition metadata complexity
- aggregate stages need careful completion semantics

### Pattern 5: Validation-Gated Publication

Typical shape:

- ingest and prepare
- validate and score readiness
- stage outputs in temporary location
- publish only if readiness passes

Use when:

- publication is externally visible
- bad outputs are costly
- rollback is difficult or impossible

Benefits:

- safer release semantics
- clearer business control point

Risks:

- requires explicit promotion logic
- late-stage failure handling must be designed intentionally

## Boundary Heuristics

### Split a stage when:

- the upstream and downstream parts have different retry safety assumptions
- the output should be inspectable on its own
- the stage mixes pure logic and side effects
- the compute cost is large enough to justify a restart point
- validation semantics differ materially before and after the transformation
- a separate owner or consumer cares about the intermediate result

### Keep stages together when:

- the split adds no useful contract
- recomputation is cheap and deterministic
- the handoff dataset would exist only to satisfy aesthetics
- operational clarity does not improve

## Pressure Tests for Weak Decomposition

Use these to challenge stage proposals.

### Smell: one giant "processing" stage

Likely problem:

- hidden coupling between validation, transformation, and publishing

Pushback:

- ask what can be rerun independently
- ask where the first reliable checkpoint should exist
- ask which part will be hardest to debug during failure

### Smell: too many tiny stages

Likely problem:

- orchestration noise and cognitive overhead without meaningful operational gain

Pushback:

- ask which boundaries actually change restartability, ownership, or traceability
- collapse adjacent stages that share the same trust level and retry semantics

### Smell: boundaries mirror files or folders rather than responsibilities

Likely problem:

- architecture is being reverse-engineered from code layout instead of system behaviour

Pushback:

- restate the pipeline in terms of business responsibilities and failure surfaces

## Decision Table Mindset

For each proposed stage boundary, answer:

1. What problem does this boundary solve?
2. What is the operational gain?
3. What complexity does it add?
4. Is that trade-off worth it here?

If those answers are vague, the boundary is probably weak.

## Practical Rule

Prefer the smallest number of stages that still makes failure handling, recovery, observability, and testing clear.

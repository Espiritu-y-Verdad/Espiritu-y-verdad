# Restartability and Checkpoints

Use this reference when deciding how the pipeline should recover from failure, what should be persisted, and where reruns should begin safely.

## Principle

A pipeline is not restartable because a scheduler can rerun it. A pipeline is restartable when completion, partial completion, invalidation, and safe re-execution are explicit.

Treat restartability as a design property, not an operational wish.

## Senior Review Lens

Challenge every restart claim with these questions:

- Restart from where, exactly?
- What proves a stage completed correctly?
- What makes a checkpoint trustworthy?
- What invalidates that checkpoint?
- What happens if the stage is executed twice?
- What cleanup is required before rerun, and why is that acceptable?

If the answer depends on undocumented manual intervention, the design is weak.

## Core Terms

### Restart boundary

A stage boundary from which execution can safely resume without corrupting downstream outputs.

### Checkpoint

A persisted output plus enough metadata to determine whether downstream work may rely on it.

### Idempotency

The property that repeated execution does not create duplicate or conflicting external outcomes.

### Completion semantics

The precise rule for deciding that a stage is done and its outputs may be trusted.

## What Makes a Good Checkpoint

A good checkpoint answers all of the following:

- what input slice was processed
- what stage produced it
- when it was produced
- under what code or configuration assumptions it was produced
- whether validation passed
- whether downstream stages may trust it
- whether the stage may be skipped safely

A file alone is not a checkpoint. A file plus completion semantics is.

## Checkpoint Placement Heuristics

Prefer checkpoints after stages that are:

- expensive to recompute
- reused by multiple downstream stages
- dependent on unstable upstream systems
- difficult to rerun quickly
- important for debugging or audits
- immediately before irreversible side effects

Avoid checkpoints after every small transformation. That usually signals poor confidence in stage design rather than good architecture.

## Safe Restart Questions Per Stage

For every stage, answer these questions:

1. Can the stage be recomputed safely from upstream data?
2. Does the stage write externally visible outputs?
3. Can a partial write occur?
4. Is duplicate execution harmful?
5. What exact metadata proves completion?
6. What would invalidate a prior checkpoint?
7. What rerun path avoids unnecessary recomputation?

## Recommended Patterns

### Pattern 1: Stage-Level Materialised Outputs

Persist expensive or semantically important stage outputs.

Use when:

- recomputation is expensive
- outputs are reused downstream
- quality checks happen before publication

Benefits:

- clear rerun boundary
- strong debugging story
- useful audit trail

Risks:

- storage cost
- checkpoint lifecycle management

### Pattern 2: Partition-Level Completion Tracking

Track completion independently per partition.

Use when:

- the pipeline processes many independent partitions
- failures are often partial
- backfills are common

Benefits:

- granular recovery
- lower blast radius
- good supportability

Risks:

- more metadata complexity
- reconciliation stage must be carefully designed

### Pattern 3: Commit-Late Publication

Publish only after all upstream checks have passed.

Use when:

- downstream exposure is sensitive
- rollback is hard
- duplicate publication is dangerous

Benefits:

- safer publication semantics
- easier recovery after upstream failure

Risks:

- requires temporary storage or staging area
- late failure can still be expensive if earlier stages are not checkpointed

### Pattern 4: Watermark or State-Driven Incremental Progress

Persist a watermark or state marker separate from transformed outputs.

Use when:

- the pipeline is incremental
- only new or changed data should be processed

Benefits:

- efficient ongoing execution
- natural replay window definition

Risks:

- incorrect state transitions can skip or duplicate data
- state commit order becomes critical

## Pushback Triggers

Challenge the design immediately when you see any of these:

### Weak claim: "We can just rerun the whole thing"

Pushback:

- ask whether that is still acceptable at realistic scale and failure frequency
- ask whether upstream sources are stable enough for whole-run recomputation
- ask whether repeated publication is safe

### Weak claim: "The output file existing means the stage succeeded"

Pushback:

- ask what distinguishes complete output from partial or corrupted output
- require explicit completion metadata or validation status

### Weak claim: "Retries are fine"

Pushback:

- ask whether writes are idempotent
- ask whether the target system will deduplicate safely
- ask what happens after a timeout with unknown commit status

### Weak claim: "We will clean it up manually if needed"

Pushback:

- treat this as an architectural smell
- require either deterministic overwrite semantics, safe rollback, or formal invalidation rules

## Partial Failure Scenarios to Design For

### Transformation succeeded, publication failed

Preferred response:

- preserve the transformed checkpoint
- rerun publication without recomputing transformation

### Some partitions succeeded, others failed

Preferred response:

- track partition status explicitly
- rerun only failed or invalid partitions
- avoid clobbering successful partitions unless invalidated

### State updated before outputs were safely committed

Preferred response:

- avoid this ordering whenever possible
- advance durable state only after outputs are safely committed or after the architecture explicitly justifies another order

### External system received duplicate writes

Preferred response:

- use deterministic keys or upsert semantics
- record publication receipts or audit metadata
- avoid assuming "exactly once" behaviour without proof

## Validation and Restartability

Treat validation as part of restart design.

State whether a checkpoint represents:

- raw completion only
- structurally valid completion
- business-valid completion
- publication-ready completion

A checkpoint is far more useful when its trust level is explicit.

## Anti-Patterns

### Anti-pattern: rerun from scratch every time because it is simpler

Problem:

- simplicity collapses under scale, unstable upstream inputs, or costly downstream side effects

Fix:

- add explicit stage boundaries and restart semantics where failure cost justifies them

### Anti-pattern: checkpoint everything

Problem:

- creates storage and lifecycle noise without improving recovery meaningfully

Fix:

- persist only where the checkpoint changes rerun economics or operational safety

### Anti-pattern: undefined invalidation rules

Problem:

- old checkpoints linger and get trusted accidentally

Fix:

- define what changes in code, parameters, schema, or upstream data invalidate the checkpoint

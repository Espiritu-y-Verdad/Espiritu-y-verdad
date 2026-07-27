# Observability for Pipelines

Use this reference when deciding what the pipeline must expose so operators can understand behaviour, diagnose failures, and rerun safely.

## Principle

Observability is not "having logs". Observability is the ability to answer operational questions quickly and correctly.

Design observability around real support questions, not around whatever metrics happen to be easy to emit.

## Senior Review Lens

Challenge every observability plan with these questions:

- How will an operator know what ran?
- How will they know what data was processed?
- How will they know what failed and where?
- How will they know whether a rerun is safe?
- How will they know whether bad data, code failure, or dependency failure caused the issue?

If those answers are not clear, the observability plan is weak.

## Minimum Operational Questions

A workable observability design should answer at least these questions:

- Which run processed which input slice?
- Which stages started, succeeded, failed, or were skipped?
- How long did each stage take?
- How many records or partitions were read, filtered, rejected, written, or published?
- Which checkpoint or output version was produced?
- Which parameters, model versions, or source snapshots mattered?
- Is the current failure recoverable by rerun, rollback, or data repair?

## Observability Layers

### 1. Run-Level Visibility

Capture:

- run id
- trigger source
- start and end time
- input scope
- overall status
- output version or publication target

Use to understand the lifecycle of a run quickly.

### 2. Stage-Level Visibility

Capture per stage:

- stage name
- status
- duration
- records or partitions in and out
- validation failures or rejection counts
- checkpoint written or reused
- retry or skip events

Use to locate failure and performance problems precisely.

### 3. Data-Quality Visibility

Capture:

- schema drift indicators
- null or missingness spikes
- duplicate rates
- rule-violation counts
- business-threshold breaches

Use to distinguish bad data from code regressions.

### 4. Publication Visibility

Capture:

- publish attempt status
- target identifiers
- deduplication or upsert outcome
- downstream acknowledgement if available

Use when external side effects matter.

## Recommended Signals

At minimum, plan for:

- counters for records and partitions processed
- stage timings
- validation pass/fail metrics
- structured logs with run id and stage name
- checkpoint creation and reuse metadata
- alert conditions for failure, abnormal volume, abnormal duration, and validation breaches

## Pushback Triggers

Challenge the design when you hear any of these.

### Weak claim: "We will log errors"

Pushback:

- ask what context the error log includes
- require run id, stage name, input scope, and checkpoint context

### Weak claim: "Monitoring is handled by the orchestrator"

Pushback:

- orchestration status is not enough
- require stage semantics, data-quality signals, and output traceability inside the pipeline design

### Weak claim: "We can inspect the output manually"

Pushback:

- manual inspection does not scale and usually fails during partial or time-sensitive incidents
- require explicit metrics and validation signals instead

## Alert Design Guidance

Prefer alerts that map to actual operator action.

Good alerts:

- pipeline failed at stage X for run Y
- rejection rate exceeded threshold for input window Z
- expected partitions missing
- publish step timed out after transformation succeeded

Weak alerts:

- generic error count increased
- dashboard looks odd

## Traceability Guidance

Prefer every major artifact, checkpoint, or publication to be traceable back to:

- run id
- input slice or partition key
- relevant configuration or model version
- stage that produced it

Without this, recovery and auditability degrade quickly.

## Anti-Patterns

### Anti-pattern: only infrastructure metrics

Problem:

- CPU and memory do not explain whether the pipeline produced the right outputs

Fix:

- add stage and data-quality semantics

### Anti-pattern: metrics without identifiers

Problem:

- incidents cannot be tied to a specific run, partition, or output

Fix:

- include stable identifiers in logs and emitted metadata

### Anti-pattern: success metrics only

Problem:

- failures are discovered too late and partial degradation goes unnoticed

Fix:

- add rejection counts, missing partition checks, and abnormal-volume signals

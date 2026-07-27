# Test Strategy for Pipelines

Use this reference when planning how the pipeline architecture should be validated before and after implementation.

## Principle

Design for testability at the architecture stage.

A pipeline becomes expensive to verify when boundaries are vague, side effects are mixed with core logic, or rerun promises are only documented and never testable.

## Senior Review Lens

Challenge every test plan with these questions:

- What is the smallest test that proves each stage is correct?
- What test proves the stage contract is enforced?
- What test proves rerun safety and idempotency claims?
- What critical interaction actually deserves integration coverage?
- What failure mode remains untested but matters operationally?

If the answer is always "end-to-end", the architecture is probably too coupled.

## Testing Goals

Design the architecture so tests can validate:

- correctness of transformations
- correctness of validation rules
- correctness of stage contracts
- safety of reruns
- safety of publication semantics
- behaviour under partial failure

## Recommended Testing Layers

### 1. Unit Tests

Target pure logic.

Good candidates:

- validation functions
- mapping logic
- feature calculations
- partition-selection logic
- normalization rules
- contract checks

Architecture implication:

Create stages whose core behaviour can be exercised without external systems.

### 2. Contract Tests

Target assumptions between stages.

Good candidates:

- required columns or fields
- allowed value ranges
- semantic assumptions about identifiers
- shape of enriched or transformed entities
- model input schema expectations

Architecture implication:

Make stage inputs and outputs explicit enough to be validated independently.

### 3. Pipeline Wiring Tests

Target how stages are connected.

Good candidates:

- correct flow of outputs to downstream stages
- parameter propagation
- optional branch selection
- checkpoint-aware skip logic
- failure-path routing

Architecture implication:

Keep the wiring inspectable and avoid hiding orchestration inside large functions.

### 4. Selective Integration Tests

Target important real interactions, not every interaction.

Good candidates:

- publish flow to a critical target
- state update semantics
- checkpoint restoration flow
- interaction with an external validation dependency

Architecture implication:

Minimise the number of surfaces that require full integration coverage.

### 5. Recovery and Idempotency Tests

Target the operational promises of the design.

Good candidates:

- rerunning after a publish failure
- rerunning after partial partition success
- skipping a stage when a valid checkpoint exists
- repeating a publish request safely

Architecture implication:

Treat restart behaviour as something to test directly, not merely describe.

## Pushback Triggers

### Weak claim: "We will cover it with end-to-end tests"

Pushback:

- end-to-end tests are too slow and coarse to carry architectural confidence alone
- require distribution across unit, contract, pipeline, and selective integration layers

### Weak claim: "The implementation team can add tests later"

Pushback:

- if test seams are not designed early, implementation often bakes in poor boundaries that are costly to reverse

### Weak claim: "This stage is too integrated to test separately"

Pushback:

- treat that as a design smell
- split pure logic from side effects or tighten stage responsibilities

## What to Specify in the Blueprint

The design output should identify:

- unit-test targets
- stage-contract test targets
- pipeline-level test targets
- integration-test targets
- recovery-test targets
- the most fragile assumptions that need explicit coverage

## Example Mapping

### Example: batch inference pipeline

Possible tests:

- unit: feature preparation and thresholding logic
- contract: scored dataset contains required identifiers and scores
- pipeline: validation output feeds scoring stage correctly
- integration: model artifact loads correctly and publish stage writes expected structure
- recovery: rerun after publish failure does not duplicate records

### Example: training pipeline

Possible tests:

- unit: split logic and evaluation calculations
- contract: prepared features satisfy training input requirements
- pipeline: feature stage outputs feed training and evaluation consistently
- integration: trained artifact and metrics publication work correctly
- recovery: failed evaluation reruns without retraining when training artifact checkpoint is valid

## Anti-Patterns

### Anti-pattern: say "we will test end to end" and stop there

Problem:

- creates slow, brittle coverage and leaves many failure modes untested

Fix:

- distribute validation across unit, contract, pipeline, and selective integration layers

### Anti-pattern: tests only for happy-path outputs

Problem:

- misses operational risk and rerun hazards

Fix:

- test failure paths, invalid inputs, and recovery semantics

### Anti-pattern: architecture ignores test seams

Problem:

- implementation becomes hard to verify without costly scaffolding

Fix:

- design stage boundaries that expose natural test seams

## Practical Rule

For every stage, answer these two questions:

1. What is the smallest test that proves this stage's logic is correct?
2. What higher-level test proves this stage interacts safely with the rest of the pipeline?

If neither answer is clear, the design probably needs better boundaries.

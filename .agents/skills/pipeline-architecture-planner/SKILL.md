---
name: pipeline-architecture-planner
description: Guide for designing and pressure-testing robust data, analytics, and ML pipelines before implementation. This skill should be used when users need a senior architectural sparring partner to challenge weak pipeline decisions, compare alternatives, make trade-offs explicit, and produce a precise implementation handoff, especially before materialising the design in Kedro.
---

# Pipeline Architecture Planner

## Overview

Design pipeline architectures before implementation work begins.

Use this skill to help an other instance operate as a senior pipeline architect, not as a passive note taker. Frame the problem, challenge weak proposals, compare viable alternatives, force trade-offs into the open, and produce an implementation-ready blueprint.

Treat this skill as the planning brain that decides how a pipeline should be structured. Defer framework-specific implementation work to a dedicated implementation skill such as `kedro-project-builder`.

## Required Architectural Stance

Act like a senior architect in a design review.

Do not validate proposals just because they sound reasonable.

Do all of the following by default:

- challenge decisions that weaken restartability, observability, testability, or maintainability
- name the specific failure mode introduced by a weak decision
- compare the proposed design against at least one credible alternative when the choice is non-trivial
- make trade-offs explicit instead of hiding them behind vague phrases such as "simpler" or "more flexible"
- recommend one option clearly when the evidence supports it
- reject architectures that are operationally fragile, even if they are easy to implement

Do not drift into contrarianism for its own sake. Push back where architectural quality is at risk, then propose a better path.

## Relationship to Other Skills

Use this skill to decide:

- what the pipeline should do
- how the pipeline should be decomposed
- where checkpoints and restart boundaries should live
- what execution model fits the constraints
- how observability and testability should work
- what implementation constraints Kedro must preserve

Use `kedro-project-builder` only after the architecture is stable and the design should be materialised in Kedro.

Treat this skill as the decision-making layer.
Treat the Kedro skill as the implementation layer.

## What This Skill Provides

1. Problem framing for data and ML pipelines
2. Architectural decomposition into coherent stages
3. Execution-strategy selection with explicit trade-offs
4. Restartability and recovery design
5. Observability and operability planning
6. Testability and validation planning
7. Kedro-oriented implementation handoff guidance
8. Senior-level challenge of weak or risky decisions

## When to Use This Skill

Use this skill when the request mentions or clearly implies one or more of the following:

- planning a new pipeline
- designing a data pipeline, ETL pipeline, ELT pipeline, ML pipeline, training pipeline, inference pipeline, feature pipeline, or event-processing workflow
- deciding how to split a workflow into stages
- deciding where checkpoints, retries, state, or restart boundaries should live
- deciding how to make a pipeline maintainable and observable
- comparing architectural alternatives for a pipeline
- reviewing or stress-testing a proposed architecture
- refactoring a fragile workflow into a maintainable pipeline design
- preparing a blueprint that will later be implemented in Kedro

Also use this skill when the user asks broad questions such as:

- "How should this pipeline be designed?"
- "Where should I put the checkpoints?"
- "How do I make this pipeline restartable?"
- "How should I split the stages?"
- "What architecture fits this batch workflow?"
- "Challenge this pipeline design before I implement it."
- "Design the blueprint first, then I will implement it with Kedro."

Do not use this skill as the primary guide for Kedro CLI commands, catalog declarations, project scaffolding, or direct framework wiring. Delegate those tasks to the Kedro implementation skill once the architecture is settled.

## Core Operating Principles

### Design for failure before convenience

Prefer boundaries and data flows that are easy to rerun, inspect, recover, and evolve.

### Force trade-offs into the open

When two design choices compete, state what is gained and what is lost. Do not hide trade-offs behind style preferences.

### Prefer explicit contracts over implicit conventions

Require clear stage inputs, outputs, side effects, and completion criteria.

### Separate framework concerns from architectural concerns

Describe the architecture independently from Kedro first. Translate into Kedro terms only in the handoff section.

### Push the conversation toward a concrete decision

When important information is missing, make grounded provisional assumptions and label them. Do not stall with open-ended questioning when a defensible recommendation can be made.

## Non-Negotiable Behaviours

Do all of the following in normal operation:

- identify the dominant architectural drivers before recommending structure
- challenge vague requirements that would otherwise create poor boundaries
- generate at least two serious options when the architecture is non-obvious
- explain why the recommended option wins for this context
- call out no-go decisions, not just preferences
- state what would change the recommendation
- preserve implementation independence until the Kedro handoff section

Do not do any of the following:

- agree with every proposal by default
- reduce architecture to file movement or task sequencing only
- accept retries without discussing idempotency
- accept checkpoints without defining their invalidation rules
- accept observability as "we will add logs"
- accept "end-to-end tests" as the full testing strategy
- treat Kedro constructs as substitutes for architectural reasoning

## Required Output Contract

Produce an explicit architecture blueprint with these sections:

1. architectural verdict
2. pipeline goal
3. business and operational constraints
4. competing options
5. recommended architecture
6. proposed stages
7. stage responsibilities and contracts
8. execution model
9. restart and checkpoint strategy
10. failure modes and recovery approach
11. observability plan
12. test strategy
13. risks and trade-offs
14. implementation handoff for Kedro

When reviewing an existing proposal, include a verdict such as:

- strong
- viable with conditions
- weak
- reject

Do not stop at generic advice. Produce a concrete structure that another skill can implement.

## Conversational Review Model

Treat the interaction as an architecture review, not a one-shot answer.

When the user proposes a design:

1. restate the design in sharper architectural terms
2. identify the strongest part of the proposal
3. identify the most dangerous weakness
4. explain the operational consequence of that weakness
5. propose one or more better alternatives
6. give a clear recommendation
7. state what must be true for the proposal to remain acceptable

When the user is undecided:

1. identify the dominant drivers
2. generate viable options
3. compare them directly
4. recommend one with clear reasoning

When the user is overconfident about a weak idea:

- push back directly
- name the risk plainly
- explain what will break first
- propose a safer design without hedging excessively

## Workflow

Follow this workflow in order unless the request is already narrowly scoped.

### 1. Frame the Pipeline

Identify and state explicitly:

- business outcome
- primary users or downstream consumers
- triggering mode
- expected frequency
- latency expectations
- failure tolerance
- data volume and partitioning pressure
- operational constraints
- external-system dependencies

Classify the pipeline type, for example:

- batch analytics
- training
- batch inference
- feature generation
- validation and enrichment
- extract-transform-publish
- event processing
- orchestration of dependent jobs

### 2. Identify Architectural Drivers

Determine which qualities matter most. At minimum consider:

- maintainability
- restartability
- observability
- correctness
- reproducibility
- throughput
- latency
- cost efficiency
- extensibility
- auditability

State the dominant drivers explicitly. Use them to justify every important design choice.

If the user's stated preference conflicts with the dominant drivers, say so clearly.

### 3. Generate and Compare Serious Options

For non-trivial designs, generate at least two credible architectural options.

For each option, state:

- shape of the pipeline
- operational strengths
- operational weaknesses
- likely failure modes
- where it simplifies implementation
- where it increases long-term cost

Do not compare a real option against a strawman.

### 4. Choose and Defend a Recommendation

Recommend one option clearly.

State:

- why it is the best fit for the stated drivers
- what trade-offs it accepts
- what risks remain
- what conditions would make another option preferable

### 5. Decompose the Pipeline

Split the workflow into stages with clear responsibilities.

Prefer stage boundaries that isolate one of the following concerns:

- ingestion
- validation
- canonicalisation
- enrichment
- transformation
- feature derivation
- model execution
- aggregation
- quality checks
- publishing
- notification
- state persistence
- checkpoint generation

For each stage, define:

- purpose
- inputs
- outputs
- side effects
- failure impact
- retry safety
- whether the stage is pure, idempotent, or stateful

Avoid one giant stage that mixes ingestion, business transformation, and publication.

Load `references/pipeline-decomposition-patterns.md` when stage boundaries, pipeline shape, ownership boundaries, or stage responsibilities are unclear.

### 6. Design Restartability and Recovery

For each stage, decide:

- whether the stage can be recomputed safely
- whether outputs should be checkpointed
- what the restart boundary should be
- what state must be persisted
- what inputs or outputs require versioning
- what conditions allow skipping a completed stage
- how partial failures are detected
- how partial results are reconciled

Prefer restart points at stage boundaries, not inside opaque business logic.

Prefer idempotent writes, deterministic transformations, and explicit checkpoint datasets over hidden implicit state.

Load `references/restartability-and-checkpoints.md` when deciding rerun boundaries, persisted state, idempotency, or recovery strategies.

### 7. Design Observability

Define the operational visibility required to support the pipeline.

Specify:

- run-level metrics
- stage-level metrics
- throughput and timing signals
- data-quality indicators
- structured logs
- lineage or traceability needs
- alert conditions
- debugging metadata
- success and failure signals

At minimum, identify:

- what was processed
- what succeeded
- what failed
- where it failed
- what checkpoint or output version was produced
- whether a rerun is safe

Load `references/observability-for-pipelines.md` when metrics, logs, alerts, lineage, or supportability need to be planned.

### 8. Design for Testability

Specify the test strategy at four levels.

#### Unit level

Test pure transformations, validation rules, mapping logic, contract enforcement, and partition logic.

#### Contract level

Test the assumptions between stages explicitly.

#### Pipeline level

Test stage wiring, parameter propagation, checkpoint behaviour, and rerun safety assumptions.

#### Selective integration level

Test critical end-to-end paths, especially around failure recovery, idempotency, external interactions, and publishing.

Prefer designs where core logic can be tested without external systems.

Load `references/test-strategy-for-pipelines.md` when defining test scope, test seams, or contract validation.

### 9. Evaluate Risks and Trade-offs

Explicitly identify trade-offs such as:

- fewer stages versus more restart points
- early materialisation versus lower storage cost
- richer observability versus operational overhead
- stricter validation versus pipeline fragility
- reusable abstractions versus premature complexity
- stronger isolation versus more handoff datasets

State the key risks and how the design mitigates them.

If the design leaves a serious risk unresolved, say so plainly instead of presenting the design as complete.

### 10. Produce the Kedro Handoff

End with a section titled `Implementation Handoff for Kedro`.

Translate the architecture into Kedro-facing guidance:

- suggested modular pipeline names
- likely catalog concerns
- likely parameter groups
- likely hook responsibilities
- suggested testing scope
- expected project-structure impact
- open questions that must be resolved before coding

Focus on what the Kedro implementation skill should build. Do not default to emitting Kedro CLI commands unless they are explicitly requested.

Load `references/kedro-handoff-guidelines.md` when translating architecture decisions into Kedro implementation guidance.

## Decision Rules

Apply these rules consistently.

### Prefer more modular stages when:

- failure isolation matters
- reruns are expensive
- ownership is split across workflows
- observability requirements are high
- the pipeline is expected to evolve
- different stages change at different rates

### Prefer fewer stages when:

- the workflow is tiny
- handoff costs dominate
- recomputation is cheap
- restartability can be achieved without extra fragmentation
- the operational surface area is intentionally minimal

### Prefer explicit checkpoints when:

- recomputation is expensive
- upstream inputs can change between reruns
- downstream consumers depend on intermediate outputs
- recovery time matters
- the pipeline spans multiple trust or ownership boundaries

### Prefer ephemeral intermediates when:

- recomputation is cheap
- storage cost dominates
- stages are deterministic and fast
- the operational risk is low
- intermediate data is not reused downstream

### Reject a design or mark it weak when:

- side effects occur before validation or quality gates without a strong justification
- retries are assumed safe but idempotency is undefined
- restartability depends on undocumented manual cleanup
- observability cannot tell which partition, stage, or output failed
- one stage mixes unrelated responsibilities only to reduce coding effort
- the design cannot be tested meaningfully without a full end-to-end environment

## Response Strategy

Structure the answer in this order:

1. architectural verdict
2. architectural summary
3. competing options
4. recommended architecture
5. proposed stages
6. restartability model
7. observability model
8. test strategy
9. risks and trade-offs
10. implementation handoff for Kedro

Do not jump directly to code or project structure unless the architecture is already stable.

Treat "make a pipeline" as a systems-design problem first and an implementation problem second.

## Common Anti-Patterns

Correct these aggressively when found:

- designing around files instead of responsibilities
- mixing ingestion, transformation, and publishing in one stage
- no explicit restart boundary
- observability treated as an afterthought
- retries without idempotency thinking
- framework constructs used as a substitute for architecture
- over-parameterising details before the stage boundaries are stable
- missing input-output contracts between stages
- designing only for the happy path
- using Kedro terms to justify weak architecture instead of clarifying it
- keeping a monolith because splitting the pipeline feels inconvenient
- adding checkpoints everywhere because there is no confidence in completion semantics

## Deliverable Template

Use this template when the user asks for a design.

### Architectural Verdict
[State: strong / viable with conditions / weak / reject, and explain why.]

### Pipeline Goal
[Describe the intended outcome and the consumer of the outputs.]

### Constraints
[Describe frequency, scale, latency, dependencies, failure tolerance, and operational constraints.]

### Competing Options
- Option A:
- Option B:
- Why Option A wins or loses:
- Why Option B wins or loses:

### Recommended Architecture
[State the recommendation and justify it.]

### Proposed Stages
- Stage 1:
- Stage 2:
- Stage 3:

### Stage Contracts
- Inputs:
- Outputs:
- Side effects:
- Idempotency notes:

### Restart and Recovery Strategy
[Describe checkpoints, rerun boundaries, persisted state, partial-failure handling, and recovery assumptions.]

### Observability Plan
[Describe metrics, logs, quality signals, alert points, and traceability.]

### Test Strategy
[Describe unit, contract, pipeline, and selective integration tests.]

### Risks and Trade-offs
[Describe the main compromises, unresolved risks, and why the recommendation still stands.]

### Implementation Handoff for Kedro
- Suggested modular pipelines:
- Suggested catalog concerns:
- Suggested parameter groups:
- Suggested hooks:
- Suggested tests:
- Open questions:

## Example Triggers

Use this skill for prompts like:

- "Help me design a restartable batch inference pipeline."
- "Challenge this pipeline architecture before I implement it in Kedro."
- "How should I split this training workflow into stages before implementing it in Kedro?"
- "Plan a maintainable ETL pipeline with checkpoints and observability."
- "What pipeline architecture should I use for validating, enriching, and publishing event data?"
- "I think one pipeline is enough for everything. Push back if that is a bad idea."

## Bundled Resources

Use bundled resources deliberately instead of duplicating their contents here.

### references/pipeline-decomposition-patterns.md

Load when choosing stage boundaries, ownership boundaries, pipeline shape, or stage contracts.

### references/restartability-and-checkpoints.md

Load when deciding rerun boundaries, checkpoint placement, idempotency, persisted state, or recovery design.

### references/observability-for-pipelines.md

Load when defining metrics, logs, alerts, run metadata, supportability requirements, or lineage needs.

### references/test-strategy-for-pipelines.md

Load when defining test seams, contract validation, pipeline-level tests, or critical integration coverage.

### references/kedro-handoff-guidelines.md

Load when converting the architecture blueprint into implementation guidance for the Kedro skill.

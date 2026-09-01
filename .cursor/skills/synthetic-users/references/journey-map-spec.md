# Behaviourally-encoded journey map spec (Stage 2 input)

This is the method's real edge. Most journey maps (stage / actions / thoughts / feelings / pains / opportunities) are designed for human workshops. They are not structured enough for a model to consistently select behavioural filters, simulate trade-offs, carry emotional residue, or trigger bias patterns.

You are converting a **journey map → behavioural dataset**, which feeds **behavioural dataset → psychological filter → synthetic response**. That chain is what stops responses feeling random and makes them internally consistent.

Encode the following **per stage**. Use `templates/journey-map.template.csv` (one row per field group, columns = stages).

### 1. Stage metadata (decision context)
- Stage name
- Primary goal at this stage
- Decision type: `Exploratory` / `Comparative` / `Commitment` / `Usage validation` / `Recovery`
- Perceived risk: Low / Medium / High
- Cognitive load: Low / Medium / High

Risk + cognitive load directly drive bias and emotional temperature, so they are not optional.

### 2. Active jobs matrix
For *this stage* (jobs activate differently across the journey):
- Active functional job
- Active emotional job
- Active social job

Example — Awareness: understand options / reduce uncertainty / appear competent. Decision: choose correctly / avoid regret / justify choice.

### 3. Pain intensity scaling
- Top 3 pains at this stage
- Intensity 1–5 each
- Pain type from the taxonomy: `Time pressure` · `Financial risk` · `Cognitive overload` · `Social risk` · `Trust uncertainty` · `Effort cost`

This feeds emotional temperature and bias selection. E.g. high financial risk → loss aversion; high cognitive overload → effort-minimisation.

### 4. Emotional arc (with residue)
Not "Emotion: frustrated." Track:
- Entry emotion
- Peak emotion
- Exit emotion
- **Residue carried forward** to the next stage

Residue is what gives psychological continuity — a persona who left the last stage guarded enters the next one guarded.

### 5. Identity tension
- "What identity is at risk here?" (e.g. smart decision-maker, competent professional, in-control parent, tech-savvy)

This gives the persona something to defend. Threatened identity → defensiveness up. Big lever for realism.

### 6. Behavioural bias trigger
- The likely bias at this stage (prevents random bias assignment). Typical arc: Awareness → social proof; Consideration → confirmation; Decision → loss aversion; Usage → sunk cost; Renewal → status quo.

### 7. Situational context tags
- Device (mobile / desktop)
- Environment (at work / commuting / home late night)
- Time pressure (low / med / high)
- Distraction / multi-tasking level

Feeds the micro-context grounding in responses.

### 8. Decision threshold (commitment stages)
- "What must be true for the customer to proceed?" (e.g. setup under 15 min, clear ROI, brand credibility, peer endorsement)

Gives the persona a realistic "yes boundary."

## The one warning: avoid over-precision

If the map becomes too deterministic, the persona becomes predictable and stops reading as human. Encode **tendencies and pressures**, not a fixed script. Leave room for bounded, slightly inconsistent, human reactions.

## File shape

One CSV per persona, named e.g. `CJ Map - <Persona Name>.csv`. Columns = journey stages; rows = the field groups above.

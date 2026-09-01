# Persona profile spec (Stage 1 input)

The profile is the first of two inputs per persona. Optimise it around **actionable Jobs, Pains and Gains** — the raw material the config draws on to construct responses. Keep it LLM-readable: clear headings, scannable lists, no prose padding.

## Required sections

**Overview** — 2–3 sentences. Who they are, where they are in their journey, what they're navigating. Enough to anchor identity, not a biography.

**Key goals** — 3–5 outcomes they're driving toward. The arc of their whole journey.

**Customer jobs** — split three ways, because they pull differently:
- *Functional jobs* — the practical tasks/outcomes (apply, complete, find, pay, navigate).
- *Emotional jobs* — how they want to feel / stop feeling (reduce anxiety, feel confident, feel valued, avoid regret).
- *Social jobs* — how they want to be perceived / who they want to connect with (appear competent, belong, contribute, network).

**Pains** — grouped by theme (e.g. Information & Clarity, Access & Availability, Process Complexity). Where data allows, mark relative intensity. Pains are the engine of emotional temperature, so capture a *spread* — a profile with one dominant pain will produce a persona that fixates on it.

**Gains** — the desired outcomes / future state. Distinguish current reality from wished-for state (a gain is what they *want*, not what they have).

**Behavioural motivations** — the dispositional traits that differentiate this persona behaviourally from the others (e.g. task-oriented and progression-focused; anxiety-sensitive to risk; effort-conserving under cognitive load; relationship-oriented; support-seeking but self-reliant). This is what makes two personas in the same role respond differently.

## Rules

- **Differentiate behaviourally, not demographically.** Two personas can share age and role and still be distinct if their motivations, risk posture, and dominant jobs differ. Demographic-only variation is a smell.
- **Fix demographics deliberately** to counter the model's default (e.g. its tendency to assume a "typical" user). State them so they're not silently stereotyped.
- **Capture a spread of pains.** Thin or single-pain data causes pain-point fixation downstream.
- **Keep it current.** A profile is a *living* artefact — version it and deepen it as research arrives (VoC, interviews). Note version + date in the file.
- **3–6 personas per panel.** Enough for productive conflict, not so many the focus group blurs.

## File shape

One markdown file per persona, named e.g. `Profile - <Persona Name>.md`. Use `templates/persona-profile.template.md`. Pair each with a journey map CSV (Stage 2).

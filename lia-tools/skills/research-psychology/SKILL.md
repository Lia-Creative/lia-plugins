---
name: research-psychology
slug: research-psychology
description: "The psychology domain of a research plan — what the person is actually after underneath the request: the motivation, the anxiety, the identity and the social context around the behaviour, taken from studies and from real accounts. Never from a generated persona. Use when dispatched at the psychology domain of a research plan."
version: 0.1.0
created: 2026-08-29
updated: 2026-08-29
status: active
triggers:
  - "/research-psychology"
  - "research the psychology"
  - "what is the user actually looking for"
companions:
  - researcher
  - research-lead
  - synthetic-users
  - jtbd
  - adventure-chat-ingest
  - execution-discipline
maintainer: cq
---

# Research — psychology

**Load `researcher` first.** The method, the citation shape and the filing rules live there. This
seat adds the domain.

## What this domain asks

- **What is the person actually after?** The stated want is the surface; the entry brings back what
  the evidence says sits under it.
- **What is the motivation, and is it intrinsic or imposed?** Something they want, or something they
  have to do for someone else — the two behave completely differently.
- **What is the anxiety?** What they are afraid of losing, breaking, being judged for, or being seen
  not to know.
- **What does using this say about them?** Identity and self-presentation, where the behaviour is
  visible to anyone.
- **Who else is in the room?** The social context — a colleague, a client, a partner, an audience —
  and what it changes.
- **What known effects apply, and how well do they replicate?** Loss aversion, the endowment effect,
  defaults, effort justification — named, sourced, and honest about replication.

## Method

1. **Start from the behaviour, not the theory.** Find accounts of people doing the thing — diary
   studies, ethnographies, interview write-ups, forum threads where they explain themselves — then
   reach for the named effect that fits.
2. **Prefer studies that replicate.** Behavioural science has a replication record; a famous effect
   that has failed replication is a `DEVELOPING` finding at best and the entry says so with the
   source.
3. **Our own real conversations are primary sources.** Adventure chats and recorded user sessions —
   cite them exactly like any other source, with their locator in the vault or Linear.
4. **Do not diagnose.** This domain describes motivation and context; it does not attribute clinical
   conditions to users, and a source that does is quoted as that source's claim.
5. **Watch the culture boundary.** A finding from one population is a finding about that population;
   the entry names who was studied.

## Quality bar

- **Counts as a source:** peer-reviewed behavioural research (with its replication status noted),
  published ethnographic or diary studies, dated first-hand accounts, our own recorded conversations
  with real people.
- **Fails:** pop-psychology restatement with no study behind it, a named effect invoked without its
  source, a claim about "users" with no population.
- **`synthetic-users` output is never evidence here, and this is the domain most tempted by it.**
  That seat produces psychologically coherent *hypotheses* to aim a real conversation — they may
  point this research at a question and can never answer one. A synthetic panel's view cited as a
  finding is the failure this bench exists to prevent.

## Output

`researcher`'s corpus entry, `domain: psychology`. Findings name the motivation, the anxiety, the
identity and social factors, each with its source and its population. Named effects carry their
replication status. Gaps is where this domain is most valuable: what nobody has actually studied
about this behaviour is a real answer.

## What this seat is not

- **Not `synthetic-users`.** That generates the panel to argue with; this brings back what real
  people, studied, are shown to do.
- **Not `jtbd`.** The job statement is a discovery artefact; this is the evidence underneath it.
- **Not a persuasion playbook.** How to use a bias on someone is not what this domain returns; what
  the person needs, and fears, is.

## Changelog

- **0.1.0 (2026-08-29, LIAB-1023)** — first version. The psychology domain: behaviour before theory,
  replication status carried on every named effect, our own recorded conversations treated as
  primary sources, populations named, no diagnosis — and the synthetic-users boundary stated at the
  point where it is most tempting to cross.

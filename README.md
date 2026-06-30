# lia-plugins

Lia Creative's Claude Code marketplace — the one place the team installs Lia tooling from.

## Setup (once per person)

```
/plugin marketplace add Lia-Creative/lia-plugins
```

Then install what you need:

```
/plugin install squeaks@lia-plugins
/plugin install design-and-refine@lia-plugins
```

That's it. New tools added here later show up with a `/plugin marketplace update lia-plugins`.

## What's in here

### The prototyping pair

| Tool | Fidelity | Use it when | Gives you |
|------|----------|-------------|-----------|
| **squeaks** | Lo-fi, deliberately rough | The idea or flow isn't shaped yet | `/squeaks:new <name>` — scaffolds a clickable wireframe prototype |
| **design-and-refine** | Hi-fi, on-brand | Refining a real component in an existing repo | `/design-and-refine:start` — generates & compares UI variations |

**The rule of thumb:** unshaped idea → Squeaks. Real component in a product repo → design-and-refine.

## Sources

- `squeaks` plugin lives in this repo (`./squeaks`); it scaffolds from the [Squeaks template](https://github.com/Lia-Creative/squeaks).
- `design-and-refine` is referenced from our fork [`Lia-Creative/design-plugin`](https://github.com/Lia-Creative/design-plugin) (upstream: [`0xdesign/design-plugin`](https://github.com/0xdesign/design-plugin)).

Both are MIT-licensed forks kept in the Lia org so we own the source of truth and can pull upstream updates.

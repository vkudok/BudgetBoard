---
name: readonly-mode
description: Treat the user's readOnly command as a strict no-edit workflow and the editMode command as returning to normal editing behavior.
---

# Read Only Mode

Use this skill whenever the user writes `readOnly`, `read-only`, `readonly`, or asks to prevent automatic edits.

## readOnly Behavior

When active, follow these rules:

- Do not edit, create, move, rename, format, or delete files.
- Do not install, update, or remove dependencies.
- Do not run commands whose main purpose is to write project files, change configuration, mutate databases, start destructive processes, or alter external state.
- You may read files, inspect project structure, search text, check git status, and run safe diagnostic commands.
- If a verification command may write generated files, caches, logs, build output, or lockfiles, explain that first and ask for confirmation.
- Provide findings, proposed file changes, and exact commands the user can approve.
- Before any mutation, ask for explicit confirmation and wait.

## editMode Behavior

When the user writes `editMode`, return to the normal Codex workflow for future requests:

- Read the project first.
- Make reasonable implementation choices.
- Edit files when the task calls for it.
- Verify the result when practical.

## Response Pattern

When `readOnly` is activated, briefly acknowledge it:

```text
readOnly is active: I will inspect and verify without changes. I will ask before any edits.
```

When a requested task needs edits while readOnly is active, stop after analysis and ask:

```text
Changes are needed in <files>. Confirm, and I will apply them.
```

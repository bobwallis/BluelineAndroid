# PR 1: Build baseline

## Baseline commands

Run these from the repository root:

```bash
gradle --no-daemon lintDebug testDebugUnitTest assembleDebug
```

## Current CI/environment notes

- In this execution environment, Gradle cannot fully resolve Android dependencies from `dl.google.com`, so the baseline command does not complete here.
- The expected baseline check for this PR is that the command above is the standard build/test/lint entrypoint for this repository.

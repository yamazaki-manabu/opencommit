```markdown
# opencommit Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `opencommit` TypeScript repository. You'll learn how to structure files, write imports/exports, follow commit message standards, and implement and test code in a consistent way. This guide is ideal for contributors looking to quickly align with the project's established practices.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names.
  - Example:  
    ```
    opencommit-core.ts
    commit-message-builder.ts
    ```

### Import Style
- Use **relative imports** for referencing other modules.
  - Example:
    ```typescript
    import { buildCommitMessage } from './commit-message-builder';
    ```

### Export Style
- Use **named exports** exclusively.
  - Example:
    ```typescript
    // In commit-message-builder.ts
    export function buildCommitMessage(...) { ... }
    ```

### Commit Message Patterns
- Follow the **Conventional Commits** specification.
- Use prefixes like `build` to indicate the type of change.
- Keep commit messages concise (average length: 76 characters).
  - Example:
    ```
    build: update dependencies to latest versions
    ```

## Workflows

### Commit Code Changes
**Trigger:** When you have made code changes and are ready to commit.
**Command:** `/commit-changes`

1. Stage your changes:
   ```
   git add .
   ```
2. Write a conventional commit message, using a prefix like `build`:
   ```
   git commit -m "build: describe your change in present tense"
   ```
3. Push your changes:
   ```
   git push
   ```

### Add a New Module
**Trigger:** When you need to add a new feature or utility.
**Command:** `/add-module`

1. Create a new file using kebab-case (e.g., `new-feature.ts`).
2. Use relative imports to include dependencies.
   ```typescript
   import { helperFunction } from '../utils/helper-function';
   ```
3. Export your functions or constants using named exports.
   ```typescript
   export function newFeature() { ... }
   ```
4. Write corresponding tests in a file named `new-feature.test.ts`.
5. Commit your changes with a conventional commit message.

## Testing Patterns

- Test files are named with the pattern `*.test.ts`.
  - Example: `commit-message-builder.test.ts`
- The testing framework is not explicitly specified, but tests should be written in TypeScript and placed alongside or near the modules they test.
- Example test file structure:
  ```typescript
  import { buildCommitMessage } from './commit-message-builder';

  describe('buildCommitMessage', () => {
    it('should return a valid commit message', () => {
      // test implementation
    });
  });
  ```

## Commands
| Command           | Purpose                                             |
|-------------------|-----------------------------------------------------|
| /commit-changes   | Guide for committing code using conventional commits |
| /add-module       | Steps to add a new module following conventions      |
```

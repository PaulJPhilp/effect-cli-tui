# GEMINI.md

## Project Overview

This project, `effect-cli-tui`, is a TypeScript library for building powerful and interactive command-line interfaces (CLIs). It is built on top of the Effect-TS library, which provides a powerful a functional, type-safe, and composable way to write asynchronous and concurrent code.

The library provides a comprehensive set of tools for building CLIs, including:

*   **Interactive Prompts:** For gathering user input.
*   **Display Utilities:** For printing formatted output to the console.
*   **CLI Wrapper:** For executing external commands.
*   **Tables, Boxes, and Spinners:** For creating rich terminal user interfaces.

## Building and Running

The project uses `bun` as its package manager. The following commands are used for building, running, and testing the project:

*   **Install Dependencies:**
    ```bash
    bun install
    ```
*   **Build:**
    ```bash
    bun run build
    ```
*   **Run Tests:**
    ```bash
    bun run test
    ```
*   **Lint:**
    ```bash
    bun run lint
    ```
*   **Type Check:**
    ```bash
    bun run type-check
    ```

## Development Conventions

*   **Code Style:** The project uses Biome for code linting and formatting. (Note: Biome configuration files, such as `biome.json` or `.biomeignore`, were not found in the initial analysis. If you intend to use Biome, please ensure its configuration is present.)
*   **Testing:** The project uses `vitest` for testing. Test files are located in the `__tests__` directory.
*   **Commits:** The project follows the Conventional Commits specification for commit messages.
*   **Branching:** Feature branches should be created from the `main` branch.
*   **Pull Requests:** Pull requests should be opened against the `main` branch.

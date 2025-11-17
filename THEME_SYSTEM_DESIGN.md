# Theme System Design Proposal

## Overview

A theming system that allows users to customize icons, colors, and styling for display types while maintaining backward compatibility with the current default theme.

## Design Goals

1. **Backward Compatible** - Default theme matches current behavior exactly
2. **Effect-Native** - Uses Effect.Service pattern for consistency
3. **Type-Safe** - Full TypeScript support with proper types
4. **Composable** - Themes can be merged and extended
5. **Runtime Configurable** - Switch themes at runtime via Effect context

## Proposed API

### Theme Interface

```typescript
interface Theme {
  icons: {
    success: string
    error: string
    warning: string
    info: string
  }
  colors: {
    success: ChalkColor
    error: ChalkColor
    warning: ChalkColor
    info: ChalkColor
    highlight: ChalkColor
  }
  styles: {
    success?: ChalkStyleOptions  // bold, dim, etc.
    error?: ChalkStyleOptions
    warning?: ChalkStyleOptions
    info?: ChalkStyleOptions
  }
}
```

### Theme Service

```typescript
class ThemeService extends Effect.Service<ThemeService>()("app/ThemeService", {
  effect: Effect.sync(() => ({
    getTheme: (): Theme => { /* return current theme */ },
    setTheme: (theme: Theme): Effect.Effect<void> => { /* update theme */ },
    withTheme: <A, E, R>(
      theme: Theme,
      effect: Effect.Effect<A, E, R>
    ): Effect.Effect<A, E, R> => { /* run effect with theme */ }
  }))
})
```

### Usage Examples

**Default Theme (Current Behavior):**
```typescript
// No changes needed - uses default theme automatically
yield* display('Hello!', { type: 'success' })
```

**Custom Theme:**
```typescript
import { ThemeService, createTheme } from 'effect-cli-tui'

const customTheme = createTheme({
  icons: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  },
  colors: {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',  // Changed from blue
    highlight: 'magenta'  // Changed from cyan
  }
})

const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  yield* theme.setTheme(customTheme)
  
  yield* display('Success!', { type: 'success' })  // Uses ✅ green
  yield* display('Info!', { type: 'info' })        // Uses ℹ️ cyan
})
```

**Preset Themes:**
```typescript
import { themes, ThemeService } from 'effect-cli-tui'

const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  
  // Use minimal theme (no icons, simple colors)
  yield* theme.setTheme(themes.minimal)
  
  // Or dark theme (adjusted colors for dark terminals)
  yield* theme.setTheme(themes.dark)
  
  // Or emoji theme (emoji icons)
  yield* theme.setTheme(themes.emoji)
})
```

**Scoped Theme (Temporary):**
```typescript
const program = Effect.gen(function* () {
  const theme = yield* ThemeService
  
  // Apply theme only for this scope
  yield* theme.withTheme(themes.minimal, Effect.gen(function* () {
    yield* display('This uses minimal theme')
    yield* display('This also uses minimal theme')
  }))
  
  // Back to default theme here
  yield* display('This uses default theme')
})
```

## Implementation Approach

### 1. Theme Service
- Store current theme in Effect.Ref or FiberRef
- Provide get/set/withTheme methods
- Default theme matches current constants exactly

### 2. Update Display Functions
- `getDisplayIcon()` checks ThemeService for icon
- `formatDisplayOutput()` checks ThemeService for color
- Fallback to current constants if no theme set

### 3. Preset Themes
```typescript
export const themes = {
  default: createTheme({ /* current behavior */ }),
  minimal: createTheme({
    icons: { success: '', error: '', warning: '', info: '' },
    colors: { /* simple colors */ }
  }),
  dark: createTheme({
    colors: {
      success: 'green',
      error: 'red',
      warning: 'yellow',
      info: 'cyan',  // Better visibility on dark backgrounds
      highlight: 'cyan'
    }
  }),
  emoji: createTheme({
    icons: {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }
  })
}
```

### 4. Backward Compatibility
- Default theme = current behavior
- All existing code works without changes
- Theme is optional - only used if explicitly set

## Benefits

1. **Customization** - Users can match their brand/terminal preferences
2. **Accessibility** - Users can adjust colors for better visibility
3. **Consistency** - All display functions use the same theme
4. **Composability** - Themes can be merged/extended
5. **Type Safety** - Full TypeScript support

## Considerations

1. **Performance** - Theme lookup should be fast (FiberRef is efficient)
2. **Thread Safety** - Each Effect fiber can have its own theme
3. **Testing** - Easy to test with custom themes
4. **Migration** - Zero breaking changes - fully backward compatible

## Alternative: Simpler Approach

If full theme service is too complex, we could start with:

1. **Theme Configuration Object** - Pass theme to Runtime
2. **Preset Themes Only** - No custom theme creation initially
3. **Global Theme** - Single theme per application (not per-fiber)

This would be simpler but less flexible. The Effect.Service approach is more powerful and consistent with the codebase patterns.


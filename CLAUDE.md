# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite + HMR)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite configured yet.

## Architecture

### Stack
- **Frontend**: React + Vite, MUI v7, SCSS per component
- **State**: Zustand stores (`src/stores/`)
- **Auth**: Supabase (client in `src/config/supabase.js`)
- **Backend API**: Separate REST API, configurable via `VITE_API_URL` (default `http://localhost:3000`)
- **i18n**: i18next with automatic language detection, namespaces per feature (`src/i18n/locales/{en,es}/`)
- **Routing**: React Router v7

### Stores (Zustand)
- **useAuthStore** — session, profile, login modal (`showLoginModal`, `openLoginModal(onSuccess?)`), redirect path
- **useRecipeStore** — recipe CRUD via REST API, automatically injects auth token in headers
- **useTagStore** — read-only tags, fetched by language (`getTagsByLanguage`)

### Auth flow
`useAuthStore.initialize()` is called on app mount. It sets up a Supabase listener that keeps the store in sync.

To open the login modal from anywhere: `openLoginModal(callbackOnSuccess?)`. The callback is only called on successful login (see `LoginDialog`). `closeLoginModal()` clears the callback.

Protected routes use the `ProtectedRoute` component. Navigation with auth protection uses `useSmartNavigate` (hook in `src/hooks/`), which opens the login modal if the user is not authenticated.

### Recipe filters (`RecipeList`)
- Filters are modeled as a state object in `RecipeList`
- `handleFilterChange(partial)` accepts a partial object — never a string key
- View values (`all`, `mine`, `favorites`) are defined in `recipeList.constants.js` as `RECIPE_VIEWS`
- Filtering is done client-side; tags come from the backend in `recipe.recipe_tags[].tags`

### i18n
Namespaces: `common`, `navigation`, `auth`, `create-recipe`, `recipeList`, `recipe-details`. Always add translations in both languages (`en` and `es`) when adding visible text.

## Guidelines

- For async loading states, always use the `Loading` component (`src/components/common/Loading.jsx`). It renders a fixed LinearProgress bar below the AppBar. Never use `CircularProgress` or custom spinners for page-level loading.
- All UI must be responsive. Use the breakpoint mixins in `src/utils/breakpoints.scss` (`bp.mobile` < 1024px, `bp.tablet-only` 768–1023px, `bp.until($bp.$mobile)` < 480px). Always cover phone, tablet, and desktop.
- All code, comments, variable names, and project files must be written in English.
- Once a problem is resolved, remove any defensive code added during investigation (multiple fallback patterns, chained `??` to handle unknown structures, "Pattern A / Pattern B" comments, etc.). The final code must reflect only the confirmed real structure.
- Keep code clean and readable. Do not leave temporary workarounds in production code.

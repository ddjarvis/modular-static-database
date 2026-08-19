# 1. Project Plan

## Phase 0 — Foundations

Goal: establish project shape, module boundaries, and development workflow.

### Deliverables

- Static file structure
- ES module entry point
- Basic app shell
- Simple event bus or plugin host
- Local development workflow

### Key decisions

- No build step or minimal build step?
- How modules are loaded
- Where app state lives
- How components are mounted

### Exit criteria

You can open `index.html`, load the app via ES modules, and render a minimal shell.

---

## Phase 1 — Core Storage Abstraction

Goal: isolate persistence behind a stable interface.

### Deliverables

- `StorageProvider` contract
- `LocalStorageProvider`
- Storage key naming strategy
- Serialization/deserialization boundary
- Error handling strategy

### Key decisions

- What storage keys look like
- Whether storage is synchronous or async
- How future IndexedDB provider will fit in
- How records are namespaced

### Exit criteria

The app can save and read generic data through a storage adapter without UI or domain logic knowing it is LocalStorage.

### Milestone discussion point

This is a good place to pause and decide:

> Should the storage layer be record-oriented, collection-oriented, or key-value oriented?

---

## Phase 2 — Schema Engine

Goal: define data structure, field types, and validation rules.

### Deliverables

- Schema model
- Field definitions
- Validation rules
- Schema registry
- Schema versioning strategy

### Key decisions

- How schemas are stored
- How fields are represented
- How validation errors are returned
- Whether schema changes migrate old records or only validate them

### Exit criteria

A schema can describe a record, validate it, and reject invalid data.

### Milestone discussion point

This is where we should decide:

> Do schemas evolve by versioning, by migration, or by validation-only compatibility?

---

## Phase 3 — Record Domain Model

Goal: create the core record lifecycle.

### Deliverables

- Record identity
- Record timestamps
- Record validation pipeline
- Create/read/update/delete operations
- Import/export-friendly record envelope

### Key decisions

- Record shape
- ID generation
- Optimistic vs strict validation
- Soft delete vs hard delete

### Exit criteria

The app can perform CRUD operations against a schema-validated record collection.

---

## Phase 4 — Vanilla Component Runtime

Goal: create a small but disciplined UI architecture.

### Deliverables

- Base component lifecycle
- Mount/render/unmount pattern
- State handling
- DOM ownership rules
- Component communication strategy

### Key decisions

- How components receive state
- How components emit events
- Whether components own DOM cleanup
- How routing/screen switching works

### Exit criteria

You can compose UI screens from components without leaking DOM state or event listeners.

### Milestone discussion point

We should pause here to decide:

> Should components be controlled by a central store, or should they communicate mostly through events?

---

## Phase 5 — MVP Features

Goal: implement the user-facing database features.

### MVP scope

- Dynamic record list view
- Record create form
- Record edit form
- Record delete
- Schema manager
- JSON export
- JSON import with validation

### Exit criteria

A user can define a schema, create records, edit records, export data, and import data safely.

---

## Phase 6 — Plugin / Hook System

Goal: make the app extensible without core modification.

### Deliverables

- Hook registry
- Event bus
- Lifecycle hooks such as:
  - `beforeSave`
  - `afterSave`
  - `beforeDelete`
  - `afterLoad`
  - `beforeImport`
  - `afterExport`
- Plugin registration format

### Key decisions

- Hook execution order
- Async hook support
- Error handling in plugins
- Whether plugins can block operations

### Exit criteria

A plugin can observe or modify app behavior through documented hooks.

---

## Phase 7 — PWA Readiness

Goal: prepare offline support and installability.

### Deliverables

- Web app manifest
- Service worker registration
- Cache naming strategy
- Asset caching strategy
- Offline fallback behavior

### Caching strategy

- Cache name based on SHA-256 asset hash
- Cache-first for fonts
- Stale-while-revalidate for icons
- Lazy caching for audio
- Network-first default for pages or dynamic requests

### Exit criteria

The app installs as a PWA and behaves predictably offline.

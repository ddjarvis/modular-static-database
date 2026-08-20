## 1. Project Plan

### Phase 0 — Foundations

Goal: establish project shape, module boundaries, and development workflow.

#### Deliverables

- Static file structure
- ES module entry point
- Basic app shell
- Simple event bus or plugin host
- Local development workflow

#### Key decisions

- No build step or minimal build step?
- How modules are loaded
- Where app state lives
- How components are mounted

#### Exit criteria

You can open `index.html`, load the app via ES modules, and render a minimal shell.

---

### Phase 1 — Core Storage Abstraction

Goal: isolate persistence behind a stable interface.

#### Deliverables

- `StorageProvider` contract
- `LocalStorageProvider`
- Storage key naming strategy
- Serialization/deserialization boundary
- Error handling strategy

#### Key decisions

- What storage keys look like
- Whether storage is synchronous or async
- How future IndexedDB provider will fit in
- How groups, libraries, and entries are namespaced

#### Exit criteria

The app can save and read generic data through a storage adapter without UI or domain logic knowing it is LocalStorage.

#### Decision

Use a collection-oriented storage API for groups, libraries, and entries, backed internally by namespaced keys. Keep the provider API async-friendly even though the MVP implementation uses LocalStorage.

---

### Phase 2 — Library Engine and Validation

Goal: define libraries, groups, pages, fields, and validation rules.

#### Deliverables

- Library model
- Group and page definitions
- Stable field IDs and field definitions
- Typed validation rules
- Library registry
- Library versioning strategy
- Entry designations and uniqueness configuration
- Safe computed age field definition

#### Key decisions

- How libraries and groups are stored
- How fields are represented
- How validation errors are returned
- Whether library changes migrate old entries or only validate them
- How computed fields reference source fields

#### Exit criteria

A library can describe entries, organize fields into pages, validate entry values, resolve designations, and reject invalid data.

#### Decision

Use library version metadata and validation-first behavior. Compatible edits may retain the version; breaking edits require an explicit version change. Store entry values by stable field ID so display names can change safely. Full migrations are deferred.

---

### Phase 3 — Entry Domain Model

Goal: create the core entry lifecycle within a library.

#### Deliverables

- Entry identity and library ownership
- Entry timestamps
- Entry validation pipeline
- Create/read/update/delete operations
- Import/export-friendly entry envelope
- Single-field and composite uniqueness enforcement
- Read-time computed age resolution

#### Key decisions

- Entry shape
- ID generation
- Optimistic vs strict validation
- Soft delete vs hard delete
- Whether computed values are persisted or derived

#### Exit criteria

The app can perform CRUD operations against a library-validated entry collection, including uniqueness checks and read-time age calculation.

---

### Phase 4 — Vanilla Component Runtime

Goal: create a small but disciplined UI architecture.

#### Deliverables

- Base component lifecycle
- Mount/render/unmount pattern
- State handling
- DOM ownership rules
- Component communication strategy

#### Key decisions

- How components receive state
- How components emit events
- Whether components own DOM cleanup
- How routing/screen switching works

#### Exit criteria

You can compose UI screens from components without leaking DOM state or event listeners.

#### Milestone discussion point

We should pause here to decide:

> Should components be controlled by a central store, or should they communicate mostly through events?

---

### Phase 5 — Library and Entry MVP Features

Goal: implement the user-facing database features.

#### MVP scope

- Library list view with groups
- Library manager
- Page and field organization
- Dynamic entry list and entry-card view
- Entry create form
- Entry edit form
- Entry delete
- Entry designations: name, description, and status
- Computed age display from date fields
- JSON export using format version 2
- JSON import with staged validation and atomic commit

#### Exit criteria

A user can define a library, organize its fields, create and manage entries, use computed age fields, export data, and import data safely.

---

### Phase 6 — Plugin / Hook System

Goal: make the app extensible without core modification.

#### Deliverables

- Hook registry
- Event bus
- Lifecycle hooks such as:
  - `beforeSave`
  - `afterSave`
  - `beforeDelete`
  - `afterDelete`
  - `afterLoad`
  - `beforeImport`
  - `afterImport`
  - `beforeExport`
  - `afterExport`
- Plugin registration format

#### Key decisions

- Hook execution order
- Async hook support
- Error handling in plugins
- Whether plugins can block operations

#### Exit criteria

A plugin can observe or modify app behavior through documented hooks.

---

### Phase 7 — Release Verification and Documentation

Goal: verify the MVP against the design document and document the supported data format.

#### Deliverables

- README setup and static-serving instructions
- Import/export format version 2 documentation
- Replace and merge import behavior
- Tests for malformed envelopes, invalid libraries, invalid entries, conflicts, uniqueness, computed age, and atomicity
- Browser verification of the full library and entry workflow
- Explicit verification that cross-library links are rejected or unsupported in the MVP format

#### Exit criteria

All MVP acceptance criteria in `DesignDoc.md` pass, including persistence, validation, atomic import, computed fields, lifecycle cleanup, and static serving.

---

### Phase 8 — PWA Readiness

Goal: prepare offline support and installability.

#### Deliverables

- Web app manifest
- Service worker registration
- Cache naming strategy
- Asset caching strategy
- Offline fallback behavior

#### Caching strategy

- Cache name based on SHA-256 asset hash
- Cache-first for fonts
- Stale-while-revalidate for icons
- Lazy caching for audio
- Network-first default for pages or dynamic requests

#### Exit criteria

The app installs as a PWA and behaves predictably offline.

---

## Deferred Future Work

The following work is documented for future planning and is intentionally excluded from the MVP:

- Cross-library link fields and all relationship cardinalities
- Lazy link resolution, referential integrity, and orphan-link checks
- Bidirectional and many-to-many relationship maintenance
- Cross-library querying and relational views
- Cross-library permissions and circular relationship handling
- Cascading deletes and updates with transaction/rollback behavior
- General calculation expressions, date arithmetic, dependency graphs, and cycle detection
- Script fields, sandboxing, execution limits, and script error handling
- Additional integer, real, currency, time, datetime, image, radio, multiselect, checklist, and hyperlink field types
- Advanced querying, filtering, saved views, and richer entry-card layouts
- Field migration tooling, soft deletion, and archival workflows
- IndexedDB, remote/API storage, backend synchronization, conflict resolution, and offline mutation queues
- Full PWA caching and install enhancements beyond the readiness phase
- Authentication, authorization, multi-user collaboration, realtime synchronization, and audit history

Each deferred capability requires its own design decision, validation rules, migration strategy, and focused tests before implementation.

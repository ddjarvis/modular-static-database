# Project Design Doc

## Project Name

Vanilla JS ESM Database App

## Status

Draft / MVP planning

---

## 1. Overview

A static, frontend-only database application built with vanilla JavaScript ES modules.

The app allows users to define libraries, manage entries dynamically, validate data, and import/export JSON. A library is a self-contained table-like collection of entries with typed fields, pages, groups, display designations, and configurable uniqueness. It is designed to be extensible through plugins and prepared for future offline/PWA support.

The implementation should avoid frameworks and rely on modular, composable vanilla JS patterns.

---

## 2. Goals

### Primary goals

- Build a lightweight client-side database experience
- Support dynamic library-driven entries
- Keep persistence swappable
- Maintain a clean component lifecycle
- Support validated JSON import/export
- Enable extensibility via ESM plugins

### Non-goals for MVP

- Multi-user collaboration
- Backend API integration
- Authentication
- Realtime sync
- Relationships and cross-library linking
- Complex query engine
- Full offline-first mutation sync

---

## 3. Core Principles

### 1. Storage is replaceable

No UI or domain code should directly call `localStorage`.

All persistence goes through a `StorageProvider`.

### 2. Library is authoritative

Entries must be validated against their library before being saved or imported. Computed fields are derived from stored values and are never persisted as entry data.

### 3. Components are lifecycle-driven

UI components must have predictable `mount`, `render`, and `unmount` behavior.

### 4. Plugins are explicit

Extension points should be exposed through named hooks and events, not monkey-patching.

### 5. ESM-first

The app should be composed of native ES modules suitable for static hosting.

---

## 4. High-Level Architecture

```text
index.html
    |
    v
App Shell
    |
    +----------------+------------------+
    |                |                  |
UI Components    App Services      Plugin System
    |                |                  |
    |        +-------+-------+          |
    |        |               |          |
    v        v               v          v
Screens   LibraryEngine  StorageProvider Hooks/Events
                             |
                             v
                    LocalStorageProvider
```

---

## 5. Module Responsibilities

## 5.1 App Shell

Responsible for:

- booting the app
- initializing providers
- mounting the root component
- registering plugins
- handling top-level routing or screen switching

Not responsible for:

- direct persistence
- detailed form logic
- library validation internals

---

## 5.2 Storage Abstraction

Responsible for:

- reading and writing persisted data
- namespacing keys
- serializing and deserializing values
- hiding storage implementation details

MVP implementation:

- LocalStorage

Future implementations:

- IndexedDB
- remote API
- file-based storage

### Conceptual contract

```js
class StorageProvider {
  async get(key) {}
  async set(key, value) {}
  async remove(key) {}
  async list(prefix) {}
}
```

### Design rule

The MVP may use LocalStorage, but the interface should be async-friendly so IndexedDB can be added later without breaking callers.

---

## 5.3 Library Engine

Responsible for:

- defining libraries, groups, pages, and fields
- validating entries against libraries
- exposing library and field metadata to UI
- resolving entry names, descriptions, statuses, and computed values

### Library responsibilities

- library names and group membership
- field IDs, names, types, hints, and ordering
- page and subheader organization
- field types
- required fields
- default values
- configurable unique fields, including composite uniqueness
- enum/options
- string/number/date constraints
- entry name, description, and status designations
- library version metadata

### Initial field types

- `text`
- `number`
- `boolean`
- `date`
- `select`
- `json`
- `computed`

The initial computed field operation is `age`. It derives a person's age in whole years from a date field and is recalculated when the entry is read or displayed.

### Example library shape

```js
{
  id: "lib_people",
  name: "People",
  groupId: "group_default",
  version: 1,
  fields: [
    { id: "birthday", name: "Birthday", type: "date", required: true, pageId: "page_main" },
    {
      id: "age",
      name: "Age",
      type: "computed",
      pageId: "page_main",
      advanced: { operation: "age", sourceField: "birthday", unit: "years" }
    }
  ],
  pages: [{ id: "page_main", name: "MAIN", order: 0, fields: ["birthday", "age"], subheaders: [] }],
  options: {
    entryNameFields: ["birthday"],
    entryDescriptionFields: [],
    entryStatusField: null,
    uniqueFields: [],
    defaultSort: { field: "birthday", direction: "asc" }
  }
}
```

Field values are stored by field ID rather than display name so that fields can be renamed without changing entry data.

## 5.4 Entry Store / Repository

Responsible for:

- CRUD operations
- applying library validation
- generating entry IDs
- managing timestamps
- delegating persistence to storage
- enforcing library uniqueness rules
- resolving computed fields on read

This is the bridge between:

- Library Engine
- Storage Provider
- UI

### Conceptual entry envelope

```js
{
  id: "entry_abc123",
  libraryId: "lib_people",
  values: {
    birthday: "1990-06-15"
  },
  createdAt: "2026-08-20T00:00:00.000Z",
  modifiedAt: "2026-08-20T00:00:00.000Z",
  libraryVersion: 1
}
```

Computed values such as `age` are not included in `values`; they are derived when needed.

---

## 5.5 UI Component Runtime

Responsible for:

- rendering views
- handling DOM lifecycle
- managing local UI state
- dispatching user intent events

### Base lifecycle

```js
class Component {
  mount(container) {}
  render(state) {}
  unmount() {}
}
```

### Rules

- Components should not directly own business rules
- Components should not directly access storage
- Components should clean up listeners on unmount
- Components should be testable in isolation where possible

---

## 5.6 Plugin / Hook System

Responsible for:

- registering plugins
- emitting lifecycle hooks
- allowing controlled extension of behavior

### Initial hooks

- `beforeSave`
- `afterSave`
- `beforeDelete`
- `afterDelete`
- `afterLoad`
- `beforeImport`
- `afterImport`
- `beforeExport`
- `afterExport`

### Conceptual hook flow

```js
await hooks.run("beforeSave", entry);
await repository.save(entry);
await hooks.run("afterSave", entry);
```

### Design rule

Plugins should be explicit and bounded. They should not silently replace core internals unless we intentionally introduce a service-override mechanism later.

---

## 5.7 Import / Export System

Responsible for:

- serializing app data to JSON
- validating imported JSON
- reporting import errors
- preserving group, library, page, field, and entry relationships

### Export envelope

```js
{
  app: "vanilla-db",
  formatVersion: 2,
  exportedAt: "2026-08-20T00:00:00.000Z",
  groups: [],
  libraries: [],
  entries: []
}
```

### Import rules

- Validate structure first
- Validate groups and libraries second
- Validate pages, fields, designations, and computed-field definitions third
- Validate entries against their owning library fourth
- Validate uniqueness before committing
- Reject or collect errors before committing
- Prefer atomic import if possible

Import format version and library version are separate. The format version describes the JSON envelope; the library version describes the evolution of one library's definition. Computed values such as age are not exported; they are recalculated after import.

---

## 6. MVP Scope

## Included

- App shell
- LocalStorage provider
- Library engine
- Entry repository
- Library groups and pages
- Typed fields and structured validation
- Entry name, description, and status designations
- Configurable single-field and composite uniqueness
- Computed age fields based on date fields
- Dynamic CRUD UI
- Library manager UI
- JSON export
- JSON import with validation
- Basic plugin hooks

## Excluded

- IndexedDB provider
- API sync
- Auth
- all cross-library links and relationships
- permissions and cascade behavior
- script fields and arbitrary JavaScript execution
- advanced querying
- collaborative editing
- full offline mutation sync

---

## 7. Proposed Directory Blueprint

This is a good starting structure for a static ESM app.

```text
/
├── index.html
├── manifest.webmanifest
├── public/
│   ├── icons/
│   ├── fonts/
│   └── audio/
├── src/
│   ├── main.js
│   ├── app/
│   │   ├── App.js
│   │   ├── router.js
│   │   └── services.js
│   ├── core/
│   │   ├── storage/
│   │   │   ├── StorageProvider.js
│   │   │   └── LocalStorageProvider.js
│   │   ├── library/
│   │   │   ├── Library.js
│   │   │   ├── LibraryRegistry.js
│   │   │   └── validators.js
│   │   ├── entries/
│   │   │   ├── EntryStore.js
│   │   │   └── createId.js
│   │   └── plugins/
│   │       ├── PluginRegistry.js
│   │       └── hooks.js
│   ├── ui/
│   │   ├── Component.js
│   │   ├── components/
│   │   ├── screens/
│   │   └── forms/
│   ├── import-export/
│   │   ├── exporter.js
│   │   └── importer.js
│   └── utils/
│       ├── dom.js
│       └── json.js
└── sw.js
```

---

## 8. Key Data Flows

## 8.1 Create Entry Flow

```text
User submits form
  -> UI emits save intent
  -> EntryStore.create()
  -> Library validation
  -> beforeSave hook
  -> StorageProvider.set()
  -> afterSave hook
  -> UI refreshes list
```

---

## 8.2 Load Entries Flow

```text
Screen mounts
  -> EntryStore.list(libraryId)
  -> StorageProvider.list()
  -> deserialize entries
  -> afterLoad hook
  -> render UI
```

---

## 8.3 Import Flow

```text
User selects JSON file
  -> parse file
  -> validate envelope
  -> validate libraries
  -> validate entries
  -> beforeImport hook
  -> persist batch
  -> afterImport hook
  -> show result/errors
```

---

## 8.4 Export Flow

```text
User requests export
  -> beforeExport hook
  -> collect groups + libraries + entries
  -> serialize JSON envelope
  -> afterExport hook
  -> trigger download
```

---

## 9. PWA Design Notes

## Manifest

Should include:

- app name
- short name
- start URL
- display mode
- theme color
- background color
- icons

---

## Service Worker Strategy

### Cache naming

Use a hash-based cache name:

```text
dbapp-cache-{sha256-hash}
```

This helps invalidate caches cleanly when assets change.

### Caching strategies

| Asset type | Strategy |
|---|---|
| App shell | network-first or precached, depending on final choice |
| Fonts | cache-first |
| Icons | stale-while-revalidate |
| Audio | lazy cache |
| Dynamic requests | network-first default |

### Important constraint

Since the MVP is static and local-first, PWA support should not complicate storage behavior. Offline support should first focus on app shell availability, not data sync.

---

## 10. Major Architectural Decisions

These are the decisions we should explicitly lock in before coding too far ahead.

### Decision 1 — Storage contract style

Options:

- key/value
- collection/document
- table/entry

Recommendation:
Use a collection-oriented API for groups, libraries, and entries, backed internally by namespaced keys.

---

### Decision 2 — Async storage API

Options:

- synchronous LocalStorage API
- async provider API

Recommendation:
Use async API now, even if LocalStorage implementation is synchronous internally. This makes IndexedDB migration easier.

---

### Decision 3 — Library evolution strategy

Options:

- strict versioning
- loose validation
- migration pipeline

Recommendation for MVP:
Use library version metadata and validation-first behavior. Compatible edits may retain the version; breaking edits require an explicit version change. Full migrations can come later.

Library definitions use stable field IDs. Display names may change without changing stored entry values.

---

### Decision 4 — Relationships and computed fields

Relationships are completely deferred from the MVP. This includes one-way links, bidirectional links, permissions, cascade behavior, and relational querying.

The MVP supports one safe computed operation: `age`, calculated in whole years from a date field when an entry is read or displayed. Computed values are not stored or imported/exported as entry values. General expressions and script fields are deferred.

---

### Decision 5 — UI state ownership

Options:

- component-local state
- screen controller state
- global store

Recommendation for MVP:
Use screen-level state for data views, with component-local state only for UI concerns.

---

### Decision 6 — Plugin power level

Options:

- observe-only
- mutate hooks
- cancellable hooks

Recommendation:
Start with async hooks that can modify payloads and optionally cancel operations, but keep the API surface small.

---

## 11. Risks and Mitigations

### Risk 1 — LocalStorage limits

LocalStorage is small and synchronous.

Mitigation:
Keep storage abstract so IndexedDB can replace it later.

---

### Risk 2 — Library changes break entries

If library definitions evolve too freely, old entries may become invalid.

Mitigation:
Store library version with entries, use stable field IDs, and define compatibility rules early.

### Risk 3 — Uniqueness and derived values create confusing behavior

Composite uniqueness and calculated fields can produce unexpected validation or display results if their rules are implicit.

Mitigation:
Validate uniqueness before persistence, document the comparison semantics, validate computed-field source references, and keep computed values read-only and non-persistent.

---

### Risk 4 — Vanilla components become messy

Without discipline, DOM code can become tangled.

Mitigation:
Enforce lifecycle methods and clear ownership of DOM cleanup.

---

### Risk 5 — Plugin hooks become unpredictable

If hook ordering and mutation rules are unclear, plugins become fragile.

Mitigation:
Define hook payload contracts and execution order early.

---

### Risk 6 — Import becomes unsafe

Importing JSON can corrupt local data if not validated carefully.

Mitigation:
Use staged validation and avoid committing partial imports unless explicitly allowed.

---

## 12. Acceptance Criteria for MVP

The MVP is complete when:

- a library can be created, edited, grouped, and deleted
- fields can be organized into pages and subheaders
- entries can be created, viewed, edited, and deleted within a library
- entries are validated against their library
- entry name, description, and status designations resolve correctly
- single-field and composite uniqueness rules are enforced
- age fields calculate from birthday/date fields without being stored
- data persists across reloads using LocalStorage
- JSON export produces a valid structured file
- JSON import validates groups, libraries, fields, pages, and entries before committing
- imported data is committed atomically
- cross-library links are not required or accepted in the MVP format
- UI components unmount cleanly
- plugin hooks fire at documented points
- app can be served statically

---

## 13. Deferred Future Work

The following capabilities are intentionally documented for future planning but are not part of the MVP. Adding them later should preserve the current Library and Entry contracts where possible.

### Relationships and cross-library links

- Link fields referencing entries in another library
- One-to-one, one-to-many, many-to-one, and many-to-many cardinality
- Lazy link resolution
- Referential integrity and orphan-link validation
- Bidirectional relationship maintenance
- Junction-table optimization for many-to-many relationships
- Cross-library querying and relational views

### Cross-library access control

- Per-library permissions for linked libraries
- Read, write, read/write, and no-access modes
- Permission validation during link resolution and mutation
- Explicit handling of circular relationships

### Cascading behavior

- Configurable cascade deletes and updates
- Restricting deletion when dependent entries exist
- Clear transaction and rollback behavior for multi-library changes

### Expanded computed fields

- General calculation fields with a safe expression language
- Date arithmetic and date-offset calculations
- Dependency tracking and recalculation ordering
- Circular dependency detection
- Additional result types and formatting rules

### Script fields

- User-defined script fields
- Access to a constrained fields context
- Sandboxed execution, preferably isolated from the main UI context
- Execution limits, error reporting, and deterministic behavior

Script fields must not be implemented with unrestricted `eval` or `Function` execution. Their security model must be designed and tested separately before adoption.

### Additional field types and options

- Integer, real-number, and currency fields
- Time and datetime fields
- Image/media fields beyond URL references
- Radio, multiselect, and checklist fields
- Hyperlink fields with URL validation
- Field-specific formatting, units, precision, and display options

### Library and entry enhancements

- Advanced querying and filtering
- Saved views and multiple sort/filter configurations
- More extensive entry-card layouts
- Additional group and page management features
- Field migration tooling for breaking library changes
- Soft deletion and archival workflows

### Storage and platform enhancements

- IndexedDB storage provider
- Remote/API storage provider
- Backend synchronization
- Conflict resolution and offline mutation queues
- Full PWA support, including service-worker caching and install metadata

### Product capabilities outside the MVP

- Authentication and authorization
- Multi-user collaboration
- Realtime synchronization
- Audit history and change tracking

Each deferred capability should receive its own design decision, validation rules, migration strategy, and focused tests before implementation. Deferred features must not be added by weakening the MVP's validation, atomic import, storage abstraction, or lifecycle rules.

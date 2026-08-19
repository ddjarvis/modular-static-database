## 3. Design Doc

You can keep this as the project’s living design document.

---

## Project Design Doc

### Project Name

Vanilla JS ESM Database App

### Status

Draft / MVP planning

---

### 1. Overview

A static, frontend-only database application built with vanilla JavaScript ES modules.

The app allows users to define schemas, manage records dynamically, validate data, and import/export JSON. It is designed to be extensible through plugins and prepared for future offline/PWA support.

The implementation should avoid frameworks and rely on modular, composable vanilla JS patterns.

---

### 2. Goals

#### Primary goals

- Build a lightweight client-side database experience
- Support dynamic schema-driven records
- Keep persistence swappable
- Maintain a clean component lifecycle
- Support validated JSON import/export
- Enable extensibility via ESM plugins

#### Non-goals for MVP

- Multi-user collaboration
- Backend API integration
- Authentication
- Realtime sync
- Advanced relational modeling
- Complex query engine
- Full offline-first mutation sync

---

### 3. Core Principles

#### 1. Storage is replaceable

No UI or domain code should directly call `localStorage`.

All persistence goes through a `StorageProvider`.

#### 2. Schema is authoritative

Records must be validated against schemas before being saved or imported.

#### 3. Components are lifecycle-driven

UI components must have predictable `mount`, `render`, and `unmount` behavior.

#### 4. Plugins are explicit

Extension points should be exposed through named hooks and events, not monkey-patching.

#### 5. ESM-first

The app should be composed of native ES modules suitable for static hosting.

---

### 4. High-Level Architecture

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
Screens   SchemaEngine   StorageProvider Hooks/Events
                             |
                             v
                    LocalStorageProvider
```

---

### 5. Module Responsibilities

### 5.1 App Shell

Responsible for:

- booting the app
- initializing providers
- mounting the root component
- registering plugins
- handling top-level routing or screen switching

Not responsible for:

- direct persistence
- detailed form logic
- schema validation internals

---

### 5.2 Storage Abstraction

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

#### Conceptual contract

```js
class StorageProvider {
  async get(key) {}
  async set(key, value) {}
  async remove(key) {}
  async list(prefix) {}
}
```

#### Design rule

The MVP may use LocalStorage, but the interface should be async-friendly so IndexedDB can be added later without breaking callers.

---

### 5.3 Schema Engine

Responsible for:

- defining entity schemas
- defining fields
- validating records
- exposing schema metadata to UI

#### Schema responsibilities

- field names
- field types
- required fields
- default values
- unique constraints
- enum/options
- string/number/date constraints

#### Example conceptual field types

- `string`
- `number`
- `boolean`
- `date`
- `select`
- `json`

#### Example schema shape

```js
{
  id: "book",
  label: "Book",
  version: 1,
  fields: [
    { name: "title", type: "string", required: true },
    { name: "pages", type: "number", min: 0 }
  ]
}
```

---

### 5.4 Record Store / Repository

Responsible for:

- CRUD operations
- applying schema validation
- generating record IDs
- managing timestamps
- delegating persistence to storage

This is the bridge between:

- Schema Engine
- Storage Provider
- UI

#### Conceptual record envelope

```js
{
  id: "rec_abc123",
  schemaId: "book",
  data: {
    title: "Example",
    pages: 120
  },
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
  schemaVersion: 1
}
```

---

### 5.5 UI Component Runtime

Responsible for:

- rendering views
- handling DOM lifecycle
- managing local UI state
- dispatching user intent events

#### Base lifecycle

```js
class Component {
  mount(container) {}
  render(state) {}
  unmount() {}
}
```

#### Rules

- Components should not directly own business rules
- Components should not directly access storage
- Components should clean up listeners on unmount
- Components should be testable in isolation where possible

---

### 5.6 Plugin / Hook System

Responsible for:

- registering plugins
- emitting lifecycle hooks
- allowing controlled extension of behavior

#### Initial hooks

- `beforeSave`
- `afterSave`
- `beforeDelete`
- `afterDelete`
- `afterLoad`
- `beforeImport`
- `afterImport`
- `beforeExport`
- `afterExport`

#### Conceptual hook flow

```js
await hooks.run("beforeSave", record);
await repository.save(record);
await hooks.run("afterSave", record);
```

#### Design rule

Plugins should be explicit and bounded. They should not silently replace core internals unless we intentionally introduce a service-override mechanism later.

---

### 5.7 Import / Export System

Responsible for:

- serializing app data to JSON
- validating imported JSON
- reporting import errors
- preserving schema/record relationships

#### Export envelope

```js
{
  app: "vanilla-db",
  version: 1,
  exportedAt: "2026-08-20T00:00:00.000Z",
  schemas: [],
  records: []
}
```

#### Import rules

- Validate structure first
- Validate schemas second
- Validate records third
- Reject or collect errors before committing
- Prefer atomic import if possible

---

### 6. MVP Scope

### Included

- App shell
- LocalStorage provider
- Schema engine
- Record repository
- Dynamic CRUD UI
- Schema manager UI
- JSON export
- JSON import with validation
- Basic plugin hooks

### Excluded

- IndexedDB provider
- API sync
- Auth
- relational joins
- advanced querying
- collaborative editing
- full offline mutation sync

---

### 7. Proposed Directory Blueprint

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
│   │   ├── schema/
│   │   │   ├── Schema.js
│   │   │   ├── SchemaRegistry.js
│   │   │   └── validators.js
│   │   ├── records/
│   │   │   ├── RecordStore.js
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

### 8. Key Data Flows

### 8.1 Create Record Flow

```text
User submits form
  -> UI emits save intent
  -> RecordStore.create()
  -> Schema validation
  -> beforeSave hook
  -> StorageProvider.set()
  -> afterSave hook
  -> UI refreshes list
```

---

### 8.2 Load Records Flow

```text
Screen mounts
  -> RecordStore.list(schemaId)
  -> StorageProvider.list()
  -> deserialize records
  -> afterLoad hook
  -> render UI
```

---

### 8.3 Import Flow

```text
User selects JSON file
  -> parse file
  -> validate envelope
  -> validate schemas
  -> validate records
  -> beforeImport hook
  -> persist batch
  -> afterImport hook
  -> show result/errors
```

---

### 8.4 Export Flow

```text
User requests export
  -> beforeExport hook
  -> collect schemas + records
  -> serialize JSON envelope
  -> afterExport hook
  -> trigger download
```

---

### 9. PWA Design Notes

### Manifest

Should include:

- app name
- short name
- start URL
- display mode
- theme color
- background color
- icons

---

### Service Worker Strategy

#### Cache naming

Use a hash-based cache name:

```text
dbapp-cache-{sha256-hash}
```

This helps invalidate caches cleanly when assets change.

#### Caching strategies

| Asset type | Strategy |
|---|---|
| App shell | network-first or precached, depending on final choice |
| Fonts | cache-first |
| Icons | stale-while-revalidate |
| Audio | lazy cache |
| Dynamic requests | network-first default |

#### Important constraint

Since the MVP is static and local-first, PWA support should not complicate storage behavior. Offline support should first focus on app shell availability, not data sync.

---

### 10. Major Architectural Decisions

These are the decisions we should explicitly lock in before coding too far ahead.

#### Decision 1 — Storage contract style

Options:

- key/value
- collection/document
- table/record

Recommendation:
Start with a record/collection-oriented API, backed internally by namespaced keys.

---

#### Decision 2 — Async storage API

Options:

- synchronous LocalStorage API
- async provider API

Recommendation:
Use async API now, even if LocalStorage implementation is synchronous internally. This makes IndexedDB migration easier.

---

#### Decision 3 — Schema evolution strategy

Options:

- strict versioning
- loose validation
- migration pipeline

Recommendation for MVP:
Use schema version metadata and validation-first behavior. Full migrations can come later.

---

#### Decision 4 — UI state ownership

Options:

- component-local state
- screen controller state
- global store

Recommendation for MVP:
Use screen-level state for data views, with component-local state only for UI concerns.

---

#### Decision 5 — Plugin power level

Options:

- observe-only
- mutate hooks
- cancellable hooks

Recommendation:
Start with async hooks that can modify payloads and optionally cancel operations, but keep the API surface small.

---

### 11. Risks and Mitigations

#### Risk 1 — LocalStorage limits

LocalStorage is small and synchronous.

Mitigation:
Keep storage abstract so IndexedDB can replace it later.

---

#### Risk 2 — Schema changes break records

If schema evolves too freely, old records may become invalid.

Mitigation:
Store schema version with records and define compatibility rules early.

---

#### Risk 3 — Vanilla components become messy

Without discipline, DOM code can become tangled.

Mitigation:
Enforce lifecycle methods and clear ownership of DOM cleanup.

---

#### Risk 4 — Plugin hooks become unpredictable

If hook ordering and mutation rules are unclear, plugins become fragile.

Mitigation:
Define hook payload contracts and execution order early.

---

#### Risk 5 — Import becomes unsafe

Importing JSON can corrupt local data if not validated carefully.

Mitigation:
Use staged validation and avoid committing partial imports unless explicitly allowed.

---

### 12. Acceptance Criteria for MVP

The MVP is complete when:

- a schema can be created, edited, and deleted
- records can be created, viewed, edited, and deleted
- records are validated against their schema
- data persists across reloads using LocalStorage
- JSON export produces a valid structured file
- JSON import validates before committing
- UI components unmount cleanly
- plugin hooks fire at documented points
- app can be served statically

## Plan: Vanilla ESM Database MVP

Build the app in small, verifiable vertical slices using native browser ES modules and no build step. The implementation will follow the architecture in `DesignDoc.md`, while resolving the key MVP decisions around imports, schema evolution, and hooks.

**Phases**

1. **Contracts and shell**
   - Define storage, schema, validation, record, import/export, and hook contracts.
   - Replace the empty `index.html` with an accessible app shell.
   - Add `src/main.js` and top-level app/screen wiring.

2. **Storage**
   - Implement `StorageProvider` and `LocalStorageProvider`.
   - Use async-friendly, namespaced collection storage.
   - Ensure only the storage provider accesses `localStorage`.
   - Add focused storage tests.

3. **Schemas and validation**
   - Implement schema normalization and `SchemaRegistry`.
   - Support `string`, `number`, `boolean`, `date`, `select`, and `json`.
   - Support required fields, defaults, options, min/max, and string constraints.
   - Return structured field-level validation errors.

4. **Record repository**
   - Implement IDs, timestamps, schema versions, and CRUD in `RecordStore`.
   - Validate before persistence.
   - Build the first vertical slice: create a Book schema, create/edit/delete records, reload, and verify persistence.

5. **Dynamic UI**
   - Add lifecycle-safe components with `mount`, `render`, and `unmount`.
   - Build schema-driven lists and create/edit forms.
   - Add validation messages, loading/error states, empty states, and delete confirmation.
   - Keep business logic in services/repositories rather than components.

6. **Schema management**
   - Add schema create, edit, list, and delete screens.
   - Allow compatible edits.
   - Require explicit version changes for breaking edits.
   - Block schema deletion while records exist.

7. **Import/export**
   - Implement the documented JSON envelope.
   - Validate imports in stages: envelope, schemas, then records.
   - Support user-selected replace and merge modes.
   - Validate everything before writing and prevent partial imports.
   - Add tests for malformed files, conflicts, invalid records, and atomicity.

8. **Minimal plugin hooks**
   - Implement the documented async hooks:
     `beforeSave`, `afterSave`, `beforeDelete`, `afterDelete`, `afterLoad`, `beforeImport`, `afterImport`, `beforeExport`, and `afterExport`.
   - Define ordering, mutation, cancellation, and error behavior.
   - Avoid monkey-patching and service replacement.

9. **Release verification**
   - Update `README.md` with setup, static serving, usage, import modes, and limitations.
   - Verify all acceptance criteria from `DesignDoc.md`.
   - Test the full browser workflow through a static server.

**Primary files**

- `index.html` — app shell.
- `src/main.js` and `src/app/App.js` — application bootstrap and screen switching.
- `src/core/storage/` — persistence boundary.
- `src/core/schema/` — schema registry and validators.
- `src/core/records/` — record CRUD and validation orchestration.
- `src/ui/` — lifecycle components, screens, and forms.
- `src/import-export/` — validated import and export.
- `src/core/plugins/` — bounded hook system.
- `README.md` — development and usage documentation.

**Decisions**

- Use native ESM with no bundler.
- Use a simple static server for development.
- Support both replace and merge imports.
- Require complete validation before either import mode writes data.
- Guard breaking schema changes with explicit version changes.
- Block schema deletion when records exist.
- Include minimal plugin hooks in the MVP.
- Defer IndexedDB, backend sync, authentication, relationships, advanced querying, collaboration, and full PWA sync.

The one contract detail to settle before implementation is merge conflict behavior. The recommended rule is to reject incompatible same-ID collisions instead of silently overwriting local data.
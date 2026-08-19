## 2. Recommended Milestones

These are the places where I recommend we pause and discuss trade-offs before implementation.

### Milestone A — Storage contract

Decide whether the storage API should look like:

- key/value
- collection/document
- table/record

This affects everything.

### Milestone B — Schema versioning

Decide whether schema changes:

- break old records
- validate old records loosely
- migrate old records
- require export/import

### Milestone C — UI state model

Decide whether UI state is:

- component-local
- screen-level
- global app store
- event-driven

### Milestone D — Plugin mutation power

Decide whether plugins can:

- observe only
- modify data
- cancel operations
- replace core services

### Milestone E — PWA caching model

Decide how aggressive offline support should be.

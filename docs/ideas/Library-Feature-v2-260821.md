# Library Feature Proposal (Final)

## Executive Summary

This proposal defines the **Library** as the fundamental data structure of a static, modular, **relational** database application. A Library is equivalent to a table in a relational database, containing typed fields (columns) and entries (rows). Libraries can be linked together to form relational connections, organized into groups, and subdivided into pages for better UI management.

**Key Principle:** Libraries are relational entities that can interact with each other. They are not isolated silos—they are interconnected tables in a database.

---

## Core Concepts

### 1. Library = Table

A **Library** is the fundamental organizational unit of the database. It is equivalent to a **table** in a relational database system.

- A library defines a **structure** (its fields)
- A library contains **data** (its entries)
- A library can **link** to other libraries (relational connections)

### 2. Entry = Row

An **Entry** is an instance of a library's data. It is equivalent to a **row** in a relational database table.

- An entry is a collection of field values
- An entry belongs to exactly one library
- An entry is identified by its **Entry Name** fields
- An entry displays on an **Entry Card** with designated fields

### 3. Field = Column

A **Field** is a typed container for a unit of data. It is equivalent to a **column** in a relational database table.

- Every field has a type, name, and hint
- Fields may have advanced parameters or display options
- Fields can be organized into pages and subheaders
- Fields can be designated as Entry Name, Entry Description, or Entry Status

---

## Library Structure

### Library Object

```javascript
{
  id: 'lib_abc123',
  name: 'Projects',
  groupId: 'group_default',
  fields: [ /* array of Field definitions */ ],
  pages: [ /* array of Page definitions */ ],
  options: {
    // Entry designation configuration
    entryNameFields: ['title'],           // Required, at least one text field
    entryDescriptionFields: ['summary'],  // Optional, up to 3 fields
    entryStatusField: 'status',           // Optional, single field
    // Uniqueness configuration
    uniqueFields: ['email'],              // Optional, can be empty or multiple
    // Display options
    defaultSort: { field: 'title', direction: 'asc' }
  },
  createdAt: 1729468800000,
  modifiedAt: 1729555200000,
  permissions: { /* cross-library access rules */ }
}
```

### Library Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | UUID (unique identifier) |
| `name` | string | Human-readable name |
| `groupId` | string | Group this library belongs to |
| `fields` | Field[] | Ordered list of field definitions |
| `pages` | Page[] | Page definitions for field organization |
| `options` | object | Library-level configuration |
| `createdAt` | number | Creation timestamp |
| `modifiedAt` | number | Last modification timestamp |
| `permissions` | object | Cross-library interaction rules |

### Library Options

| Option | Type | Description |
|--------|------|-------------|
| `entryNameFields` | string[] | Fields used for entry display name (required, at least one text field) |
| `entryDescriptionFields` | string[] | Fields used for entry description (optional, max 3) |
| `entryStatusField` | string | Field used for entry status indicator (optional) |
| `uniqueFields` | string[] | Fields that must be unique (optional, can be empty) |
| `defaultSort` | object | Default sorting for entry list view |

---

## Entry Designations

### Overview

Entries can have designated fields that control how they appear in the UI, particularly on **Entry Cards**. There are three designation types:

| Designation | Required | Max Fields | Purpose |
|-------------|----------|------------|---------|
| **Entry Name** | Yes (at least one text field) | 3 | Primary identifier shown on cards |
| **Entry Description** | No | 3 | Secondary text shown on cards |
| **Entry Status** | No | 1 | Visual status indicator on cards |

### Entry Name

- **Required:** At least one text field must be designated as Entry Name
- **Maximum:** Up to 3 fields can be designated
- **Concatenation:** Multiple fields are concatenated with spaces
- **Purpose:** Primary identifier for the entry in lists and cards

```javascript
// Example: Single Entry Name field
options: {
  entryNameFields: ['title']
}
// Entry card shows: "Build Website"

// Example: Multiple Entry Name fields
options: {
  entryNameFields: ['firstName', 'lastName']
}
// Entry card shows: "John Doe"
```

### Entry Description

- **Optional:** Can have zero description fields
- **Maximum:** Up to 3 fields can be designated
- **Concatenation:** Multiple fields are concatenated with spaces
- **Purpose:** Secondary text providing context on entry cards

```javascript
options: {
  entryDescriptionFields: ['summary', 'category']
}
// Entry card shows description: "A web project for client X - Development"
```

### Entry Status

- **Optional:** Can have zero or one status field
- **Maximum:** Exactly 1 field
- **Purpose:** Visual indicator (color, icon, badge) on entry cards
- **Typical Field Types:** `select`, `checkbox`, `radio`

```javascript
options: {
  entryStatusField: 'status'
}
// Entry card shows status badge: "Active" (green), "Pending" (yellow), etc.
```

### Entry Card Display

```text
┌─────────────────────────────────────────┐
│ ● Build Website                    [Active] │  ← Name + Status
│ A web project for client X - Development │  ← Description
└─────────────────────────────────────────┘
```

### Overflow Behavior

- If designated fields exceed 3, **overflow is hidden**
- The UI should truncate or hide excess content gracefully
- No error is thrown—just visual truncation

---

## Library Groups

The set of a user's libraries may be subdivided into **groups**.

### Default Behavior

- By default, all libraries fall into the group named **"My Libraries"**
- Users can create custom groups to organize their libraries

### Group Object

```javascript
{
  id: 'group_default',
  name: 'My Libraries',
  order: 0,
  createdAt: 1729468800000
}
```

### Group Use Cases

- **"Personal"** - Libraries for personal projects
- **"Work"** - Libraries for professional use
- **"Clients"** - Libraries organized by client
- **"Archive"** - Inactive or historical libraries

---

## Library Pages

The set of a library's fields may be subdivided into **pages**.

### Default Behavior

- By default, fields fall into the page named **"MAIN"**
- Pages allow visual separation of fields in the UI

### Page Object

```javascript
{
  id: 'page_main',
  name: 'MAIN',
  order: 0,
  fields: ['title', 'status', 'dueDate'],
  subheaders: [
    {
      id: 'sub_1',
      name: 'Basic Info',
      fields: ['title', 'status']
    },
    {
      id: 'sub_2',
      name: 'Timeline',
      fields: ['dueDate']
    }
  ]
}
```

### Page Use Cases

- **"MAIN"** - Primary fields (name, status, description)
- **"DETAILS"** - Extended fields (metadata, notes, attachments)
- **"SETTINGS"** - Configuration fields (permissions, display options)

---

## Entries

### Entry Object

An entry is an instance of a library's data:

```javascript
{
  id: 'entry_001',
  libraryId: 'lib_abc123',
  values: {
    title: 'Build Website',
    status: 'Active',
    summary: 'A web project for client X',
    category: 'Development',
    dueDate: '2024-12-31',
    priority: 3
  },
  createdAt: 1729468800000,
  modifiedAt: 1729555200000
}
```

### Entry Identification

An entry is identified by the fields designated as **Entry Name** in the library options:

```javascript
// Library options
options: {
  entryNameFields: ['firstName', 'lastName']
}

// Entry values
values: {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
}

// Display name: "John Doe"
```

### Entry Uniqueness

Uniqueness is **configurable per library**:

```javascript
options: {
  // No unique fields (duplicates allowed)
  uniqueFields: []
  
  // Single unique field
  uniqueFields: ['email']
  
  // Composite unique (combination must be unique)
  uniqueFields: ['firstName', 'lastName']
}
```

- If `uniqueFields` is empty, no uniqueness is enforced
- If `uniqueFields` has one field, that field must be unique
- If `uniqueFields` has multiple fields, the combination must be unique

### Constraint: No Orphan Entries

**Every entry must belong to a library. There are no orphan entries.**

- Entries can only be created within a library
- Deleting a library deletes all its entries
- There is no "global" or "default" namespace for unassigned data

---

## Fields

### Field Object

Every field has a **type**, **name**, and **hint**:

```javascript
{
  id: 'field_001',
  name: 'Project Title',
  type: 'text',
  hint: 'Enter the name of the project',
  pageId: 'page_main',
  order: 0,
  required: true,
  advanced: { /* type-specific options */ }
}
```

### Field Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique field identifier |
| `name` | string | Display name |
| `type` | string | Field type (see below) |
| `hint` | string | Help text shown in UI |
| `pageId` | string | Which page this field belongs to |
| `order` | number | Display order within page |
| `required` | boolean | Whether this field is mandatory |
| `advanced` | object | Type-specific configuration |

---

## Field Types

### Text Fields

Text fields are containers for text in a library.

#### Text

| Property | Value |
|----------|-------|
| Type | `text` |
| Container | String of text |
| Advanced Options | `maxLength`, `multiline`, `placeholder` |

```javascript
{
  type: 'text',
  advanced: { maxLength: 200, multiline: false }
}
```

---

### Number Fields

Number fields are containers for numeric values.

#### Integer

| Property | Value |
|----------|-------|
| Type | `integer` |
| Container | Positive, negative, or zero integer |
| Advanced Options | `min`, `max`, `units`, `step` |

```javascript
{
  type: 'integer',
  advanced: { min: 0, max: 100, units: 'items' }
}
```

#### Real Number

| Property | Value |
|----------|-------|
| Type | `real` |
| Container | Rational number (floating point) |
| Advanced Options | `min`, `max`, `units`, `precision` |

```javascript
{
  type: 'real',
  advanced: { precision: 2, units: 'kg' }
}
```

#### Currency

| Property | Value |
|----------|-------|
| Type | `currency` |
| Container | International currency value |
| Advanced Options | `currencyCode`, `precision`, `min`, `max` |

```javascript
{
  type: 'currency',
  advanced: { currencyCode: 'USD', precision: 2 }
}
```

---

### Date and Time Fields

Date and time fields are containers for temporal values.

#### Date

| Property | Value |
|----------|-------|
| Type | `date` |
| Container | Calendar date |
| Advanced Options | `format`, `minDate`, `maxDate` |

```javascript
{
  type: 'date',
  advanced: { format: 'YYYY-MM-DD' }
}
```

#### Time

| Property | Value |
|----------|-------|
| Type | `time` |
| Container | Time of day |
| Advanced Options | `format`, `use24Hour` |

```javascript
{
  type: 'time',
  advanced: { use24Hour: false }
}
```

#### DateTime

| Property | Value |
|----------|-------|
| Type | `datetime` |
| Container | Combined date and time |
| Advanced Options | `dateFormat`, `timeFormat`, `timezone` |

```javascript
{
  type: 'datetime',
  advanced: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' }
}
```

---

### Media Fields

Media fields are containers for visual content.

#### Image

| Property | Value |
|----------|-------|
| Type | `image` |
| Container | URL reference to image |
| Advanced Options | `maxSize`, `formats`, `thumbnail` |

**MVP Implementation:** URL reference only. Base64 support added later if needed.

```javascript
{
  type: 'image',
  advanced: { maxSize: 5, formats: ['jpg', 'png', 'webp'] }
}
```

---

### Logical and List Fields

Logical and list fields are containers for boolean values or selections from predefined lists.

#### Checkbox (Boolean)

| Property | Value |
|----------|-------|
| Type | `checkbox` |
| Container | Single true/false value |
| Advanced Options | `defaultChecked` |

```javascript
{
  type: 'checkbox',
  advanced: { defaultChecked: false }
}
```

#### Single-choice List

| Property | Value |
|----------|-------|
| Type | `select` |
| Container | A string selected from a list of strings |
| Advanced Options | `options`, `defaultOption`, `allowCustom` |

```javascript
{
  type: 'select',
  advanced: { 
    options: ['Low', 'Medium', 'High'],
    defaultOption: 'Medium'
  }
}
```

#### Radio Buttons

| Property | Value |
|----------|-------|
| Type | `radio` |
| Container | A string selected from a list of strings |
| Advanced Options | `options`, `defaultOption`, `layout` |

```javascript
{
  type: 'radio',
  advanced: { 
    options: ['Option A', 'Option B', 'Option C'],
    layout: 'horizontal'
  }
}
```

#### Multiple-choice List

| Property | Value |
|----------|-------|
| Type | `multiselect` |
| Container | Array of strings selected from a list |
| Advanced Options | `options`, `maxSelections`, `displayFormat` |

```javascript
{
  type: 'multiselect',
  advanced: { 
    options: ['Tag1', 'Tag2', 'Tag3'],
    maxSelections: 3
  }
}
```

#### Checkboxes

| Property | Value |
|----------|-------|
| Type | `checklist` |
| Container | Array of strings selected from a list |
| Advanced Options | `options`, `layout` |

```javascript
{
  type: 'checklist',
  advanced: { 
    options: ['Item A', 'Item B', 'Item C'],
    layout: 'vertical'
  }
}
```

---

### Link Fields

Link fields enable relational connections between libraries and external resources.

#### Link To Entry

| Property | Value |
|----------|-------|
| Type | `link` |
| Container | Reference(s) to entries in another library |
| Advanced Options | `targetLibraryId`, `cardinality`, `permissions` |

```javascript
{
  type: 'link',
  advanced: { 
    targetLibraryId: 'lib_users',
    cardinality: 'many-to-one',
    permissions: 'read'
  }
}
```

**Relational Behavior:**
- Creates a foreign key relationship between libraries
- Supports all cardinality types (1:1, 1:N, N:1, N:M)
- Can enforce permission levels for cross-library access

**Many-to-Many Implementation (MVP):**
- Stored as array of IDs in both libraries
- Junction tables considered for future optimization

#### Hyperlink

| Property | Value |
|----------|-------|
| Type | `url` |
| Container | Textual internet link |
| Advanced Options | `openInNewTab`, `validateUrl` |

```javascript
{
  type: 'url',
  advanced: { openInNewTab: true, validateUrl: true }
}
```

---

### Scripting Fields

Scripting fields enable computed values based on expressions.

#### Calculation (Simple Expression)

| Property | Value |
|----------|-------|
| Type | `calculation` |
| Container | Result of a simple expression |
| Advanced Options | `expression`, `dependencies`, `resultType` |
| Supported Operations | PEMDAS + modulo (`+`, `-`, `*`, `/`, `%`, `(`, `)`) |

```javascript
{
  type: 'calculation',
  advanced: { 
    expression: 'quantity * unitPrice',
    dependencies: ['quantity', 'unitPrice'],
    resultType: 'currency'
  }
}
```

**Expression Language Rules:**
- References fields by name (e.g., `quantity`, `unitPrice`)
- Supports: `+`, `-`, `*`, `/`, `%`, `(`, `)`
- Follows PEMDAS order of operations
- Dependencies are automatically tracked
- Results are computed on read (not stored)

#### Script (JavaScript)

| Property | Value |
|----------|-------|
| Type | `script` |
| Container | Result of JavaScript execution |
| Advanced Options | `code`, `dependencies`, `resultType`, `sandbox` |

```javascript
{
  type: 'script',
  advanced: { 
    code: 'return fields.quantity * fields.unitPrice * 1.1;',
    dependencies: ['quantity', 'unitPrice'],
    resultType: 'currency',
    sandbox: true
  }
}
```

**Script Rules:**
- Accepts simple JavaScript expressions
- Has access to `fields` object containing all field values
- Must return a value
- Runs in sandboxed environment (no access to DOM, no side effects)
- Dependencies are automatically tracked
- Results are computed on read (not stored)

---

## Relational Model

### Libraries as Tables

Since this is a **relational database**, libraries function as tables:

```text
Library: "Customers"          Library: "Orders"
┌─────────────┐               ┌─────────────┐
│ id          │◄──────────────│ customerId  │ (Link field)
│ name        │               │ orderId     │
│ email       │               │ orderDate   │
│ phone       │               │ totalAmount │
└─────────────┘               └─────────────┘
```

### Cross-Library Links

Libraries can interact with each other through **Link To Entry** fields:

```javascript
// Orders library has a link to Customers library
{
  name: 'Customer',
  type: 'link',
  advanced: {
    targetLibraryId: 'lib_customers',
    cardinality: 'many-to-one',
    permissions: 'read'
  }
}
```

### Link Permissions

When a library links to another, it can specify permission levels:

| Permission | Description |
|------------|-------------|
| `read` | Can view linked entries |
| `write` | Can modify linked entries |
| `readwrite` | Full access to linked entries |
| `none` | Link exists but no access (placeholder) |

### Cardinality Options

| Cardinality | Description | Example | Storage (MVP) |
|-------------|-------------|---------|---------------|
| `one-to-one` | One entry links to exactly one entry | Person → Passport | Single ID |
| `one-to-many` | One entry links to many entries | Customer → Orders | Array of IDs |
| `many-to-one` | Many entries link to one entry | Orders → Customer | Single ID |
| `many-to-many` | Many entries link to many entries | Students ↔ Courses | Array of IDs (both sides) |

---

## Library Interaction Rules

### Cross-Library Access

Libraries are **not isolated**. They can interact with each other, but access is controlled by permissions:

```javascript
// Library permissions object
{
  permissions: {
    'lib_customers': 'read',
    'lib_orders': 'readwrite',
    'lib_archive': 'none'
  }
}
```

### Interaction Types

1. **Link Fields:** Reference entries in other libraries
2. **Calculation Fields:** Can reference fields from linked libraries
3. **Script Fields:** Can access linked entry data via JavaScript
4. **Cascading Operations:** Optionally cascade deletes/updates to linked entries

### Interaction Constraints

- A library can only link to libraries it has permission to access
- Circular links are allowed but must be handled carefully in the UI
- Link resolution happens at read time (lazy loading)

---

## Implementation Plan

### Phase 1: Core Data Structures (Week 1-2)

**Deliverables:**
- `Field` class/object with all type definitions
- `Page` class/object for field organization
- `Library` class/object with metadata and options
- `Entry` class/object with field values
- `Group` class/object for library organization
- Entry designation system (name, description, status)

**Acceptance Criteria:**
- All field types are defined and serializable
- Fields can be organized into pages and subheaders
- Libraries can be organized into groups
- Entry designations are configured per library
- Entry names are resolved from designated fields
- Uniqueness is configurable per library

### Phase 2: Storage Abstraction (Week 3)

**Deliverables:**
- `StorageProvider` interface
- `LocalStorageAdapter` implementation
- Namespaced storage for libraries and entries

**Acceptance Criteria:**
- Libraries and entries can be saved/loaded/deleted
- Storage is organized by library
- No orphan entries can exist

### Phase 3: Relational Engine (Week 4-5)

**Deliverables:**
- Link field resolution
- Cross-library permission checking
- Calculation field evaluation (simple expressions)
- Script field evaluation (JavaScript)
- Entry name/description/status resolution

**Acceptance Criteria:**
- Links between libraries resolve correctly
- Permissions are enforced on cross-library access
- Calculated fields update when dependencies change
- Script fields execute safely in sandbox
- Entry designations display correctly on cards

### Phase 4: CRUD Operations (Week 6)

**Deliverables:**
- Create/Read/Update/Delete for libraries
- Create/Read/Update/Delete for entries
- Field validation on save
- Uniqueness enforcement
- Cascade delete options

**Acceptance Criteria:**
- Full CRUD workflow works for libraries and entries
- Validation prevents invalid data
- Uniqueness constraints are enforced
- Cascade deletes work as expected
- Modified timestamps update correctly

### Phase 5: UI Layer (Week 7-8)

**Deliverables:**
- Library list view with groups
- Library detail view with pages
- Entry form with field types
- Entry list with entry cards
- Entry card display (name, description, status)

**Acceptance Criteria:**
- Users can create/select/delete libraries
- Fields are organized by pages and subheaders
- All field types render correctly
- Entry cards show name, description, and status
- Overflow is hidden gracefully
- Entry names display with multiple field concatenation

---

## Resolved Questions

### 1. Entry Name Uniqueness ✅

**Decision:** Configurable per library.

- A library can have no required unique fields
- A library can have multiple unique fields
- Uniqueness is set in the library options via `uniqueFields` array
- If empty, no uniqueness is enforced

### 2. Calculation Expression Language ✅

**Decision:** Two field types.

- **`calculation`** - Simple field-name references with basic operators (PEMDAS + modulo)
- **`script`** - Simple JavaScript expressions with access to `fields` object

### 3. Image Storage ✅

**Decision:** URL reference for MVP.

- Images are stored as URL strings
- Base64 support added later if needed
- Keeps storage lightweight

### 4. Many-to-Many Links ✅

**Decision:** Array of IDs for MVP.

- Both sides of the relationship store arrays of IDs
- Junction tables considered for future optimization if performance requires

---

## Success Criteria

The Library feature is successful if:

1. **Relational:** Libraries can link to each other with proper permissions
2. **Organized:** Fields are organized into pages, libraries into groups
3. **Typed:** All field types render and validate correctly
4. **Designated:** Entry cards show name, description, and status correctly
5. **Configurable:** Uniqueness and designations are set per library
6. **No Orphans:** Every entry belongs to a library
7. **Performant:** CRUD operations complete in <100ms for libraries with <1000 entries

---

## Conclusion

Libraries serve as the relational tables of this modular database system. By supporting cross-library links with permissions, organizing fields into pages, grouping libraries, providing rich field types, and enabling entry designations for card display, we create a flexible and powerful data management system that can serve as a template for a wide variety of use cases.

The key insights are:
- **Libraries are relational tables**, not isolated silos
- **Entry designations** (name, description, status) control how entries appear in the UI
- **Uniqueness is configurable**, allowing flexibility per use case
- **Two scripting levels** (simple calculation + JavaScript) balance ease of use with power
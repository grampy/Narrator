# GenoPro Narrator - Architecture Diagram

## System Overview
This is a family tree narrative generation system that processes genealogical data (GenoPro format) and generates human-readable narratives using a template-based parser.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ENTRY POINT                                    │
│                           index.htm (Web Page)                              │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ imports
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                         │
│  ┌──────────────────┐    ┌──────────────────┐                               │
│  │ FamilyTree.json  │    │ Dictionary.json  │                               │
│  │  (Genealogical   │    │  (Language &     │                               │
│  │   Data)          │    │   Formatting)    │                               │
│  └────────┬─────────┘    └────────┬─────────┘                               │
│           │                       │                                         │
│           │ loaded as             │ loaded as                               │
│           ▼                       ▼                                         │
│  ┌──────────────────┐    ┌──────────────────┐                               │
│  │   $tree          │    │  $dictionary     │                               │
│  │   (Global)       │    │   (Global)       │                               │
│  └──────────────────┘    └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ accessed by
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN MODEL LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                        │
│         ┌─────────────────────────┼─────────────────────────┐              │
│         ▼                         ▼                         ▼              │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │ Individual   │        │    Event_    │        │    Name_     │          │
│  │              │        │              │        │              │          │
│  │ - ID         │        │ - Age        │        │ - First      │          │
│  │ - Name       │◄───────│ - Date       │        │ - Last       │          │
│  │ - Gender     │        │ - Place      │        │ - Possessive │          │
│  │ - Birth      │        │ - Type       │        │ - toString() │          │
│  │ - BirthCere- │        │ - Role()     │        │              │          │
│  │   mony       │        │              │        │              │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│         │                         │                         │              │
│         │ uses                    │ uses                    │ uses         │
│         ▼                         ▼                         ▼              │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │   Gender_    │        │    Date_     │        │   Place_     │          │
│  │              │        │              │        │              │          │
│  │ - ID         │        │ - Calendar   │        │ - ID         │          │
│  │ - $ (lookup) │        │ - Narrative  │        │ - Name       │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│                                  │                                         │
│                                  │ uses                                    │
│                                  ▼                                         │
│                          ┌──────────────┐                                  │
│                          │  Duration_   │                                  │
│                          │              │                                  │
│                          │ - Years      │                                  │
│                          │ - Months     │                                  │
│                          │ - Days       │                                  │
│                          │ - Weeks      │                                  │
│                          └──────────────┘                                  │
└────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ uses for localization
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       UTILITY LAYER                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        js/utils.js                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                        │
│         ┌─────────────────────────┼─────────────────────────┐              │
│         ▼                         ▼                         ▼              │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │ Dic()        │        │ DicDate()    │        │ Enum()       │          │
│  │              │        │              │        │              │          │
│  │ Dictionary   │        │ Date format  │        │ Enumeration  │          │
│  │ lookup       │        │ lookup       │        │ lookup       │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│         │                                                                  │
│         │ also provides                                                    │
│         ▼                                                                  │
│  ┌──────────────┐        ┌──────────────┐                                  │
│  │ Ind()        │        │ toArray()    │                                  │
│  │              │        │              │                                  │
│  │ Individual   │        │ Array        │                                  │
│  │ factory (    │        │ converter    │                                  │
│  │ cached)      │        │              │                                  │
│  └──────────────┘        └──────────────┘                                  │
└────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ template processing
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                      TEMPLATE PARSER LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       js/parser.js                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                        │
│         ┌─────────────────────────┼─────────────────────────┐              │
│         ▼                         ▼                         ▼              │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐          │
│  │ Phrase()     │        │ Nested()     │        │ SubPhrase()  │          │
│  │              │        │              │        │              │          │
│  │ Main entry   │        │ Recursive    │        │ Token        │          │
│  │ point        │        │ nesting      │        │ substitution │          │
│  └──────────────┘        └──────────────┘        └──────────────┘          │
│         │                         │                         │              │
│         └─────────────────────────┼─────────────────────────┘              │
│                                   ▼                                        │
│                          ┌──────────────┐                                  │
│                          │ Conditional()│                                  │
│                          │              │                                  │
│                          │ {?0|1|2}     │                                  │
│                          │ evaluation   │                                  │
│                          └──────────────┘                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. DATA INITIALIZATION
   FamilyTree.json ──► $tree (global)
   Dictionary.json ──► $dictionary (global)

2. INDIVIDUAL CREATION
   new Individual('1') ──► 
   ├─ Reads $tree.ind['1']
   ├─ Creates Gender_ object
   ├─ Creates Name_ object
   ├─ Creates Event_ objects (Birth, BirthCeremony)
   └─ Resolves relationships via Ind() factory

3. NARRATIVE GENERATION
   Individual data ──► parser.args array
   Template phrase ──► parser.Phrase()
   ├─ Nested() processes [ ] delimiters recursively
   ├─ SubPhrase() replaces {0}, {1}, etc. with values
   ├─ Conditional() evaluates {?0|1} conditions
   └─ Returns formatted narrative string

4. LOCALIZATION
   Dic('Months.Jan') ──► $dictionary.Dates.Months.Jan.text
   DicDate('FmtDateDefault.FmtYMD') ──► Format template
   Enum('Gender.M') ──► $dictionary.Enumerations.Gender.M.T
```

## Key Components

### Data Models
- **$tree**: Genealogical data structure (individuals, events, places, relationships)
- **$dictionary**: Localization and formatting rules

### Domain Classes
- **Individual**: Represents a person with name, gender, birth events
- **Event_**: Represents life events (birth, baptism, death) with date, place, participants
- **Name_**: Handles name formatting and possessive forms
- **Date_**: Formats dates according to locale and calendar
- **Place_**: Represents geographic locations
- **Gender_**: Gender identity with localization
- **Duration_**: Time durations (age, gestation periods)

### Template Parser
- **parser.Phrase()**: Main entry point for template processing
- **parser.Nested()**: Handles recursive [ ] delimited subphrases
- **parser.SubPhrase()**: Replaces tokens with values
- **parser.Conditional()**: Evaluates conditional logic {?0|1&2}

### Utilities
- **Dic()**: Dictionary lookup with path navigation
- **DicDate()**: Date formatting lookup
- **Enum()**: Enumeration value lookup
- **Ind()**: Cached Individual factory
- **toArray()**: Ensures array type

## Template Syntax Examples

```
{0}              - Simple substitution
{0h}             - HTML-escaped substitution
{0=value}        - Default value if empty
{!0}             - Ghost text (show only if 0 is empty)
{?0}             - Conditional: show if 0 is truthy
{?!0}            - Conditional: show if 0 is falsy
{?0|1|2}         - OR condition: show if any are truthy
{?0&1&2}         - AND condition: show if all are truthy
{?0^1}           - XOR condition
[{?0}text]       - Conditional block
[{!}else]         - Else block
```

## Example Usage

```javascript
// Create individual
const person = new Individual('1');

// Generate birth narrative
const template = '[{?1|2|8|9|10}{!0} was[{?1|2|9|10} born]{1}{2h}...]';
const args = [
  person.Name.First,                    // 0
  person.Birth.Date.Narrative,         // 1
  person.Birth.Place.Name.Narrative,   // 2
  person.BirthCeremony.Date.Narrative, // 3
  // ... more arguments
];

const narrative = parser.Phrase(template, args);
```

## File Structure

```
newGenoPro/
├── index.htm                 # Main entry point
├── FamilyTree.json          # Genealogical data
├── frames.html              # Frame layout
├── json.js                  # Legacy sample data
└── js/
    ├── index.js            # Module exports
    ├── api.js              # Legacy API (deprecated)
    ├── parser.js           # Template parser
    ├── utils.js            # Utility functions
    ├── Individual.js       # Person class
    ├── Event_.js           # Event class
    ├── Name_.js            # Name class
    ├── Date_.js            # Date class
    ├── Place_.js           # Place class
    ├── Gender_.js          # Gender class
    ├── Duration_.js        # Duration class
    ├── Dictionary.js       # Localization data
    ├── example.js          # Usage examples
    └── oldparser.js        # Legacy parser (deprecated)
```

## Design Patterns

- **Factory Pattern**: `Ind()` function for cached Individual creation
- **Module Pattern**: ES6 modules for encapsulation
- **Template Method**: Parser with replaceable token processing
- **Recursive Pattern**: Nested template processing
- **Localization Pattern**: Dictionary-based string externalization
# Architecture

## Overview
Single-page application with Express backend and MongoDB database. Built for the TruEstate SDE Intern Assignment.

## Data Flow (CSV → MongoDB → API → Frontend)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  sales.csv  │ ──► │ importCsv.js│ ──► │  MongoDB    │ ──► │   Express   │
│  (Source)   │     │ (One-time)  │     │   Atlas     │     │    API      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   ▼
                                              ┌─────────────────────────────┐
                                              │   React Frontend (Vite)     │
                                              │  Search | Filter | Sort     │
                                              └─────────────────────────────┘
```

### Import Process
1. `npm run import` reads `sales.csv` using `csv-parser`
2. `normalize()` maps CSV columns to Mongoose schema fields
3. Bulk insert in batches of 5000 records for performance
4. Indexes are created on startup via Mongoose schema

## Backend Architecture

### Entry Point
- `src/index.js` - Express server setup, MongoDB connection, single route mounting

### Layers
1. **Routes** (`/routes/salesRoutes.js`) - Single endpoint: `GET /`
2. **Controllers** (`/controllers/salesController.js`) - Request parsing, response formatting
3. **Services** (`/services/salesService.js`) - MongoDB query building
4. **Models** (`/models/Sale.js`) - Mongoose schema with indexes

### Data Flow
```
Request → Router → Controller → Service → MongoDB → Response
```

### Query Building
- Search: `$or` with `$regex` on customerName/phoneNumber
- Multi-select filters: `$in` operator
- Range filters: `$gte` / `$lte` operators
- Sorting: MongoDB `.sort()`
- Pagination: `.skip()` and `.limit()`

## Frontend Architecture

### Entry Point
- `src/main.jsx` → `src/App.jsx`

### Component Hierarchy
```
App
├── FilterPanel
├── SearchBar
├── SortDropdown
├── SalesTable
└── Pagination
```

### State Management
- `useSalesQuery` hook centralizes all state:
  - search, filters, sort, page
  - data, meta, loading, error
  - Actions: updateFilter, resetFilters, setSort, setPage

### Data Flow
```
User Action → State Update → API Call → Data Update → Re-render
```

## Database

### MongoDB Collection: `sales`

### Indexes (for query performance)
- `{ customerName: "text", phoneNumber: "text" }` - Text search
- `{ customerRegion: 1 }` - Filter queries
- `{ gender: 1 }`
- `{ productCategory: 1 }`
- `{ paymentMethod: 1 }`
- `{ date: -1 }` - Default sort
- `{ age: 1 }` - Range queries

## API Contract

### Request
```
GET /api/sales?search=&page=1&limit=10&sortField=date&sortOrder=desc&region=North,South
```

### Response
```json
{
  "data": [...],
  "meta": {
    "total": 1000000,
    "page": 1,
    "limit": 10,
    "totalPages": 100000
  }
}
```

## Deployment Architecture

```
[Vercel/Netlify] → [Render/Railway] → [MongoDB Atlas]
   Frontend           Backend            Database
```

## Edge Cases & Error Handling

### Backend
- **Empty search**: Returns all records (no filter applied)
- **Invalid page/limit**: Defaults to page=1, limit=10
- **Limit cap**: Maximum 100 records per request
- **Invalid sort field**: Falls back to `date` descending
- **Empty filter arrays**: Ignored (no filtering)
- **Date parsing**: ISO format expected, invalid dates ignored
- **CORS**: Enabled for all origins in development

### Frontend
- **Debounced search**: 300ms delay to prevent excessive API calls
- **Loading states**: Spinner shown during data fetch
- **Empty results**: Friendly message with filter adjustment hint
- **Error handling**: Graceful error display with retry option
- **Page reset**: Automatically returns to page 1 when filters change

### Database
- **Indexes**: Pre-defined for all filterable/sortable fields
- **Text search**: Case-insensitive regex on name/phone
- **Null handling**: Missing fields default to appropriate empty values

# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System for querying, filtering, sorting, and paginating sales transactions. Built for the **TruEstate SDE Intern Assignment**.

**Live Demo**: [Frontend URL] | **API**: [Backend URL]

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB (Atlas) |

---

## Features

### Search
- **Endpoint**: `GET /api/sales?search=<term>`
- **Fields Searched**: Customer Name, Phone Number (case-insensitive substring)
- **Implementation**: MongoDB `$regex` with `$options: "i"`

### Multi-Select Filters
- Customer Region
- Gender
- Product Category
- Payment Method
- Tags

### Range Filters
- Age Range (`ageMin`, `ageMax`)
- Date Range (`dateStart`, `dateEnd`)

### Sorting
- **Supported Fields**: Date, Quantity, Customer Name, Amount
- **Endpoint**: `GET /api/sales?sortField=date&sortOrder=desc`

### Pagination
- **Page Size**: 10 items per page
- **Endpoint**: `GET /api/sales?page=1&limit=10`
- **Response**: `{ data: [...], meta: { total, page, limit, totalPages } }`

---

## API Endpoint

### `GET /api/sales`

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search term for name/phone |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortField` | string | Field to sort by |
| `sortOrder` | string | `asc` or `desc` |
| `region` | string | Comma-separated regions |
| `gender` | string | Comma-separated genders |
| `category` | string | Comma-separated categories |
| `paymentMethod` | string | Comma-separated methods |
| `ageMin` | number | Minimum age |
| `ageMax` | number | Maximum age |
| `dateStart` | string | Start date (ISO format) |
| `dateEnd` | string | End date (ISO format) |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Dataset CSV file

### 1. Clone Repository
```bash
git clone <repo-url>
cd SDE
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and set your MONGO_URI
```

### 3. Import Dataset to MongoDB
```bash
# Place sales.csv at backend/src/data/sales.csv
npm run import
```

### 4. Start Backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## Project Structure

```
SDE/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   ├── models/
│   │   │   └── Sale.js        # Mongoose schema
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── services/
│   │   │   └── salesService.js
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   ├── utils/
│   │   │   └── importCsv.js   # CSV import script
│   │   └── data/
│   │       └── sales.csv
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── SalesTable.jsx
│   │   │   └── Pagination.jsx
│   │   ├── hooks/
│   │   │   └── useSalesQuery.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── global.css
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   └── architecture.md
└── README.md
```

---

## Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables: `MONGO_URI`, `DB_NAME`, `PORT`
4. Deploy

### Frontend (Vercel/Netlify)
1. Import project from GitHub
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment: `VITE_API_BASE_URL=<backend-url>`
5. Deploy

---

## Data Model

```javascript
{
  customerId: String,
  customerName: String,
  phoneNumber: String,
  gender: String,
  age: Number,
  customerRegion: String,
  customerType: String,
  productId: String,
  productName: String,
  brand: String,
  productCategory: String,
  tags: [String],
  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  date: Date,
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String
}
```

---

## Author
TruEstate SDE Intern Assignment Submission


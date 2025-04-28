# Customer Traffic Dashboard

A real-time dashboard for monitoring customer traffic in stores. This monorepo contains both the frontend and backend components of the application.

## Features

- Real-time display of customer entries and exits
- Historical data view showing hourly customer traffic
- Store filtering capability
- Responsive design

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Recharts for data visualization

### Backend
- Node.js
- Express.js
- TypeScript
- Mock Kafka simulation

## Project Structure

```
/
├── packages/
│   ├── frontend/  (Next.js app)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   │
│   └── backend/   (Express app)
│       ├── src/
│       │   ├── data/
│       │   ├── routes/
│       │   ├── services/
│       │   └── ...
│       └── ...
│
├── package.json   (Root package.json for monorepo)
└── ...
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development servers:

```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Data Flow

The application simulates Kafka messages with the following format:

```json
{
  "store_id": 10, 
  "customers_in": 2, 
  "customers_out": 3, 
  "time_stamp": "10.12.03"
}
```

The backend processes these messages and provides APIs for the frontend to consume.
## Notification App Backend

Express + MongoDB backend for the campus notification system.

### Setup

```bash
npm install
```

Create a `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus-notifications
```

### Run

```bash
# seed sample data
npm run seed

# start the server
npm run dev
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications (supports `?type=`, `?page=`, `?limit=`) |
| POST | `/notifications` | Create a notification |
| PUT | `/notifications/:id/read` | Mark as read |
| DELETE | `/notifications/:id` | Delete a notification |
| GET | `/notifications/unread` | Get unread notifications and count |
| GET | `/notifications/top?n=10` | Get top N priority-sorted notifications |

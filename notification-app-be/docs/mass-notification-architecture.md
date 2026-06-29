# Mass Notification Architecture

## The Problem

Sending notifications to 50,000+ students using a naive loop:

```javascript
for (const student of students) {
  await sendEmail(student.email, notification);
}
```

This is **synchronous and blocking** — each email waits for the previous one to finish. If each takes 200ms, that's 50,000 × 200ms = **~2.8 hours** just for emails.

## Solution: Queue-Based Architecture

```
┌──────────┐     ┌─────────────┐     ┌──────────────────┐
│  API      │────>│  Job Queue  │────>│  Worker Pool     │
│  Server   │     │  (BullMQ/   │     │                  │
│           │     │   RabbitMQ) │     │  ┌──── Email ──┐ │
└──────────┘     └─────────────┘     │  ├──── Push ───┤ │
                                      │  ├──── SMS ────┤ │
                                      │  └──── DB ─────┘ │
                                      └──────────────────┘
```

### How It Works

1. **Producer** (API Server): When a mass notification is triggered, the server doesn't send anything directly. Instead, it breaks the recipient list into batches and pushes jobs into a message queue.

2. **Queue** (BullMQ/RabbitMQ): Stores the jobs persistently. If a worker crashes, the job stays in the queue and gets retried. This ensures no notification is lost.

3. **Workers** (Consumer Pool): Multiple worker processes pull jobs from the queue concurrently. Each worker handles a batch of notifications:
   - Send email via SMTP/SendGrid
   - Push notification via Firebase
   - SMS via Twilio
   - Update database records

### Benefits

| Aspect | Naive Loop | Queue Architecture |
|--------|------------|-------------------|
| Speed | Sequential (~2.8 hrs) | Parallel (~5-10 min) |
| Failure handling | One failure stops all | Failed jobs retry automatically |
| Scalability | Single process | Add more workers as needed |
| Memory | Holds all in memory | Processes in small batches |
| Monitoring | No visibility | Dashboard shows progress |

### What I Implemented

In this project, I created a lightweight queue simulation (`services/notificationQueue.js`) that demonstrates the concept using `Promise.all` with batching. In production, I'd use BullMQ with Redis as the message broker.

The simulation:
- Accepts an array of notifications
- Splits into batches of 100
- Processes each batch concurrently with simulated delays
- Logs progress to console

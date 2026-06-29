# SQL Query Optimization

## The Problem

The original query fetches all columns and has no index support:

```sql
SELECT * FROM notifications WHERE studentID = 1042 AND isRead = false ORDER BY createdAt ASC;
```

### Issues

1. **`SELECT *` is wasteful** — we're reading every column from disk even though the frontend only needs a few fields (title, message, type, createdAt). This wastes I/O bandwidth and memory.

2. **No index** — without an index, the database does a full table scan, checking every single row. That's fine with 100 rows but becomes really slow once you have thousands of students with tons of notifications.

3. **Sorting without index support** — `ORDER BY createdAt ASC` requires an in-memory sort if there's no index covering the sort column. This adds extra CPU and memory usage.

## The Fix

### Optimized Query

```sql
SELECT id, title, message, type, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

Only select the columns we actually need.

### Composite Index

```sql
CREATE INDEX idx_student_read_date
ON notifications (studentID, isRead, createdAt);
```

This index covers all three operations in one go:
- **Equality filter** on `studentID` (leftmost column)
- **Equality filter** on `isRead` (next column)
- **Sort** on `createdAt` (rightmost column)

The database can now use a single index scan instead of a full table scan + in-memory sort.

### How the MongoDB Equivalent Works

In the Notification model, applied the same logic:

```javascript
notificationSchema.index({ studentId: 1, isRead: 1, createdAt: -1 });
```

The compound index follows the same ESR (Equality, Sort, Range) rule — equality fields first, then the sort field. The `-1` means descending order since we usually want newest notifications first.

## Impact

- Query goes from O(N) full scan to O(log N) index lookup
- Sorting is handled by the index, no extra memory needed
- Response time drops significantly as the dataset grows

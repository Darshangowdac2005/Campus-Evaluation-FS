import { useState } from "react";
import {
  Alert,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { markAsRead, deleteNotification } from "../api/notifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { notifications, totalPages, loading, error, unreadCount, refetch } =
    useNotifications(filter, page);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // reset to first page when changing filters
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      refetch();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationsIcon sx={{ fontSize: 28 }} />
        </Badge>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ marginBottom: 3 }}>
        <NotificationFilter value={filter} onChange={handleFilterChange} />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load notifications: {error}</Alert>
      )}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">
          No notifications found. Try changing the filter or check back later.
        </Alert>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Stack spacing={1.5}>
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}

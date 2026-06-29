import { useState, useEffect } from "react";
import { fetchNotifications, fetchUnreadCount } from "../api/notifications";

export function useNotifications(filter = "All", page = 1) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchNotifications(filter, page, 10);
        if (!cancelled) {
          setNotifications(data.data ?? []);
          setTotal(data.pagination?.total ?? 0);
          setTotalPages(data.pagination?.totalPages ?? 0);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load notifications:", err);
          setError(err.message || "Failed to load notifications");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filter, page]); // re-fetch when filter or page changes

  // fetch unread count separately
  useEffect(() => {
    fetchUnreadCount()
      .then(count => setUnreadCount(count))
      .catch(() => { }); // silently fail, not critical
  }, [notifications]);

  const refetch = () => {
    // trigger re-fetch by toggling a dummy state
    setLoading(true);
    fetchNotifications(filter, page, 10)
      .then(data => {
        setNotifications(data.data ?? []);
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 0);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    fetchUnreadCount()
      .then(count => setUnreadCount(count))
      .catch(() => { });
  };

  return { notifications, total, totalPages, loading, error, unreadCount, refetch };
}

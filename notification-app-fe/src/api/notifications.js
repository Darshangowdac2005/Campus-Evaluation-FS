import axios from "axios";

const API_BASE = "http://localhost:5000";

// fetch notifications with optional filters and pagination
export async function fetchNotifications(type = "All", page = 1, limit = 10) {
    const params = { page, limit };
    if (type && type !== "All") {
        params.type = type;
    }

    const res = await axios.get(`${API_BASE}/notifications`, { params });
    return res.data;
}

// mark a notification as read
export async function markAsRead(id) {
    const res = await axios.put(`${API_BASE}/notifications/${id}/read`);
    return res.data;
}

// delete a notification
export async function deleteNotification(id) {
    const res = await axios.delete(`${API_BASE}/notifications/${id}`);
    return res.data;
}

// get unread count
export async function fetchUnreadCount() {
    const res = await axios.get(`${API_BASE}/notifications/unread`);
    return res.data.count;
}

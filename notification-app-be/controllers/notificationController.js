const Notification = require('../models/Notification');
const { sortByPriority } = require('../utils/prioritySort');
const { getCache, setCache, invalidateCache } = require('../middleware/cache');

// GET /notifications
// supports filtering by type, pagination with page & limit
const getNotifications = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query;

        // check cache first
        const cacheKey = `notifs_${type || 'all'}_p${page}_l${limit}`;
        const cached = getCache(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        const filter = {};
        if (type && type !== 'All') {
            filter.type = type;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const total = await Notification.countDocuments(filter);
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const response = {
            success: true,
            data: notifications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        };

        setCache(cacheKey, response);
        res.json(response);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ success: false, message: 'Something went wrong fetching notifications' });
    }
};

// POST /notifications
const createNotification = async (req, res) => {
    try {
        const { studentId, title, message, type } = req.body;

        // basic validation - could use joi or zod but this works for now
        if (!studentId || !title || !message || !type) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: studentId, title, message, type',
            });
        }

        if (!['Placement', 'Result', 'Event'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Type must be one of: Placement, Result, Event',
            });
        }

        const notification = await Notification.create({ studentId, title, message, type });
        invalidateCache(); // clear cache since data changed

        res.status(201).json({
            success: true,
            data: notification,
            message: 'Notification created successfully',
        });
    } catch (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ success: false, message: 'Failed to create notification' });
    }
};

// PUT /notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        invalidateCache();
        res.json({ success: true, data: notification, message: 'Marked as read' });
    } catch (err) {
        console.error('Error marking as read:', err);
        res.status(500).json({ success: false, message: 'Failed to update notification' });
    }
};

// DELETE /notifications/:id
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        invalidateCache();
        res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
};

// GET /notifications/unread
const getUnread = async (req, res) => {
    try {
        const unread = await Notification.find({ isRead: false }).sort({ createdAt: -1 });
        const count = unread.length;

        res.json({
            success: true,
            data: unread,
            count,
        });
    } catch (err) {
        console.error('Error fetching unread:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch unread notifications' });
    }
};

// GET /notifications/top?n=10
// returns top N notifications sorted by priority
const getTopNotifications = async (req, res) => {
    try {
        const n = parseInt(req.query.n) || 10;

        // get all notifs then sort by priority in memory
        // for large datasets you'd want to do this differently but this is fine for now
        const allNotifications = await Notification.find({});
        const sorted = sortByPriority(allNotifications);
        const topN = sorted.slice(0, n);

        res.json({
            success: true,
            data: topN,
            count: topN.length,
        });
    } catch (err) {
        console.error('Error fetching top notifications:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch top notifications' });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
    getUnread,
    getTopNotifications,
};

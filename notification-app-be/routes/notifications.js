const express = require('express');
const router = express.Router();

const {
    getNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
    getUnread,
    getTopNotifications,
} = require('../controllers/notificationController');

// these need to be before /:id routes otherwise express matches "unread" as an id
router.get('/unread', getUnread);
router.get('/top', getTopNotifications);

router.get('/', getNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;

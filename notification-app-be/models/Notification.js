const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Placement', 'Result', 'Event'],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt automatically
});

// compound index - this makes the common queries way faster
// spent some time reading about indexing strategies for this
notificationSchema.index({ studentId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

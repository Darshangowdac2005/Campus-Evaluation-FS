/**
 * Priority sorting for notifications
 *
 * Rules:
 *   1. Unread notifications come first
 *   2. Type priority: Placement (3) > Result (2) > Event (1)
 *   3. Among same priority, newer notifications come first
 *
 * Time complexity: O(N log N) because of Array.sort
 * Could use a min-heap for O(N log K) if we only need top K,
 * but for our data size this is perfectly fine
 */

const TYPE_PRIORITY = {
    'Placement': 3,
    'Result': 2,
    'Event': 1,
};

function sortByPriority(notifications) {
    return [...notifications].sort((a, b) => {
        // unread first
        if (a.isRead !== b.isRead) {
            return a.isRead ? 1 : -1;
        }

        // higher type priority first
        const priorityA = TYPE_PRIORITY[a.type] || 0;
        const priorityB = TYPE_PRIORITY[b.type] || 0;
        if (priorityA !== priorityB) {
            return priorityB - priorityA;
        }

        // newer first
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

module.exports = { sortByPriority };

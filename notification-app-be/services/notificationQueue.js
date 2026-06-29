// in production I'd use BullMQ with Redis, this is a demo
// this simulates a job queue for sending mass notifications

class NotificationQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.batchSize = 100;
    }

    // add a batch of notifications to the queue
    enqueue(notifications) {
        this.queue.push(...notifications);
        console.log(`Added ${notifications.length} notifications to queue. Total: ${this.queue.length}`);

        if (!this.processing) {
            this.processQueue();
        }
    }

    async processQueue() {
        this.processing = true;

        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.batchSize);
            console.log(`Processing batch of ${batch.length} notifications...`);

            // simulate async processing with a small delay
            await Promise.all(
                batch.map(notif => this.sendNotification(notif))
            );

            console.log(`Batch complete. Remaining: ${this.queue.length}`);
        }

        this.processing = false;
        console.log('Queue empty, all notifications processed');
    }

    // simulate sending a single notification
    async sendNotification(notif) {
        // would actually call email/push/SMS services here
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, id: notif._id });
            }, 10); // simulate network delay
        });
    }
}

// singleton instance
const notificationQueue = new NotificationQueue();

module.exports = { notificationQueue };

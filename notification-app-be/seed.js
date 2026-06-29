require('dotenv').config();

const Notification = require('./models/Notification');

const sampleNotifications = [
    // Placement notifications
    {
        studentId: '1cd23ic013',
        title: 'Google On-Campus Drive',
        message: 'Google is visiting campus on July 15th for SDE roles. Eligibility: 7+ CGPA. Register on the placement portal by July 10th.',
        type: 'Placement',
        isRead: false,
        createdAt: new Date('2025-06-28T09:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Microsoft Internship 2025',
        message: 'Microsoft is hiring summer interns for SWE roles. Apply through the placement cell by June 30th. Shortlisted students will be notified.',
        type: 'Placement',
        isRead: true,
        createdAt: new Date('2025-06-25T14:30:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Infosys Pool Campus',
        message: 'Pool campus drive by Infosys scheduled on July 20th. All branches eligible. Carry updated resume and college ID.',
        type: 'Placement',
        isRead: false,
        createdAt: new Date('2025-06-20T10:15:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'TCS Digital Hiring',
        message: 'TCS Digital hiring for 2025 batch. Registration deadline extended to July 5th. Use NQT scores for shortlisting.',
        type: 'Placement',
        isRead: true,
        createdAt: new Date('2025-06-18T08:45:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Amazon SDE-1 Openings',
        message: 'Amazon is conducting online assessment on July 8th. Selected students will have on-site interviews on July 12th.',
        type: 'Placement',
        isRead: false,
        createdAt: new Date('2025-06-15T11:00:00'),
    },
    // Result notifications
    {
        studentId: '1cd23ic013',
        title: '6th Semester Results Published',
        message: 'VTU has released 6th semester results. Check your results on the VTU portal. Re-evaluation window open till July 20th.',
        type: 'Result',
        isRead: false,
        createdAt: new Date('2025-06-27T16:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Internal Assessment Marks Updated',
        message: 'CIE marks for Data Structures and OS have been updated in the student portal. Contact your faculty for any discrepancies.',
        type: 'Result',
        isRead: true,
        createdAt: new Date('2025-06-22T12:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Lab Exam Schedule Released',
        message: 'Practical examination schedule for 6th semester labs has been released. Check the department notice board.',
        type: 'Result',
        isRead: false,
        createdAt: new Date('2025-06-19T09:30:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Assignment Grades Posted',
        message: 'DBMS assignment 3 grades are now available. Average score: 78%. Top scorer: 95%.',
        type: 'Result',
        isRead: true,
        createdAt: new Date('2025-06-14T15:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Supplementary Exam Results',
        message: 'Supplementary examination results for 5th semester are out. Check VTU website.',
        type: 'Result',
        isRead: true,
        createdAt: new Date('2025-06-10T10:00:00'),
    },
    // Event notifications
    {
        studentId: '1cd23ic013',
        title: 'Tech Fest 2025 - Registrations Open',
        message: 'Annual tech fest "CodeStorm 2025" is on July 25-26. Register for hackathon, coding contest, and workshops. Early bird discount available.',
        type: 'Event',
        isRead: false,
        createdAt: new Date('2025-06-29T08:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Workshop: Cloud Computing with AWS',
        message: 'Free 3-day workshop on AWS services by industry experts. Limited seats. Register at the CS department office.',
        type: 'Event',
        isRead: false,
        createdAt: new Date('2025-06-26T10:30:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Alumni Meet 2025',
        message: 'Annual alumni meet on July 5th. All students welcome. Networking session with industry professionals planned.',
        type: 'Event',
        isRead: true,
        createdAt: new Date('2025-06-23T09:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Sports Day Registration',
        message: 'Inter-department sports tournament starts July 10th. Register your team at the sports office before July 7th.',
        type: 'Event',
        isRead: true,
        createdAt: new Date('2025-06-17T14:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Guest Lecture: AI in Healthcare',
        message: 'Guest lecture by Dr. Ramesh Iyer on AI applications in healthcare. July 3rd, Seminar Hall B, 2 PM.',
        type: 'Event',
        isRead: false,
        createdAt: new Date('2025-06-12T13:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Wipro Pre-Placement Talk',
        message: 'Wipro conducting PPT on July 1st in Auditorium. Attendance mandatory for registered candidates.',
        type: 'Placement',
        isRead: false,
        createdAt: new Date('2025-06-11T10:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Mini Project Evaluation Dates',
        message: 'Mini project evaluations for 6th semester scheduled from July 7-9. Prepare a project report and PPT.',
        type: 'Result',
        isRead: false,
        createdAt: new Date('2025-06-09T11:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Coding Club Weekly Contest',
        message: 'This week\'s coding contest topic: Dynamic Programming. Saturday 6 PM on Codeforces. Prizes for top 3.',
        type: 'Event',
        isRead: true,
        createdAt: new Date('2025-06-08T16:30:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Cognizant GenC Hiring',
        message: 'Cognizant GenC and GenC Next applications closing soon. Apply via placement portal before June 30th.',
        type: 'Placement',
        isRead: true,
        createdAt: new Date('2025-06-05T09:00:00'),
    },
    {
        studentId: '1cd23ic013',
        title: 'Library Book Return Reminder',
        message: 'Please return all borrowed library books before semester end (June 30). Late fees apply.',
        type: 'Event',
        isRead: false,
        createdAt: new Date('2025-06-03T08:00:00'),
    },
];

// auto-seed: called from server.js on startup if DB is empty
async function autoSeed() {
    try {
        const count = await Notification.countDocuments();
        if (count === 0) {
            await Notification.insertMany(sampleNotifications);
            console.log(`Auto-seeded ${sampleNotifications.length} notifications`);
        } else {
            console.log(`Database already has ${count} notifications, skipping seed`);
        }
    } catch (err) {
        console.error('Auto-seed failed:', err.message);
    }
}

// standalone seed: run with `node seed.js`
async function standaloneSeed() {
    const { connectDB, disconnectDB } = require('./config/db');
    try {
        await connectDB();
        await Notification.deleteMany({});
        console.log('Cleared existing notifications');
        await Notification.insertMany(sampleNotifications);
        console.log(`Seeded ${sampleNotifications.length} notifications`);
        await disconnectDB();
        console.log('Done!');
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

// if run directly (node seed.js), call standalone
if (require.main === module) {
    standaloneSeed();
}

module.exports = { autoSeed };

const cron = require('node-cron');
const Task = require('./models/Task');

function startReminderWorker() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
      const dueTasks = await Task.find({
        reminderAt: { $lte: now },
        reminderSent: false,
        status: 'pending'
      });

      if (dueTasks.length > 0) {
        console.log(`🔔 Reminders at ${now.toISOString()}`);

        for (const task of dueTasks) {
          // For now: just log
          console.log(`Reminder: [${task.priority.toUpperCase()}] ${task.title}`);

          // Mark as sent
          task.reminderSent = true;
          await task.save();
        }
      }
    } catch (err) {
      console.error('Reminder worker error:', err.message);
    }
  });

  console.log('Reminder worker scheduled (every minute)');
}

module.exports = startReminderWorker;

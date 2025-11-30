// src/reminder/worker.js
const Task = require('../models/Task');
const twilio = require('twilio');


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const getRecipients = () => {
  if (!process.env.TWILIO_TO_NUMBERS) return [];
  return process.env.TWILIO_TO_NUMBERS
    .split(',')
    .map(n => n.trim())
    .filter(Boolean);
};
/**
 * Check for due reminders and log them.
 * In future, replace console.log with:
 *   - email
 *   - Telegram
 *   - push notification
 */
const checkReminders = async () => {
  const now = new Date();
  console.log('⏰ Checking for reminders at', now.toISOString());
  try {
    const tasksToRemind = await Task.find({
      reminderAt: { $lte: now },
      reminderSent: false,
      status: { $ne: 'done' }
    });

    if (!tasksToRemind.length) return;

    for (const task of tasksToRemind) {
      // For now, just log
      console.log(
        `🔔 Reminder: [${task.priority.toUpperCase()}] ${task.title} (due: ${
          task.dueDate ? task.dueDate.toISOString() : 'no due date'
        })`
      );

   // 🚀 **Twilio outbound call here**
      const recipients = getRecipients();

      for (const number of recipients) {
        try {
          const call = await client.calls.create({
            to: number,
            from: process.env.TWILIO_FROM_NUMBER,
            twiml: `<Response><Say>Hello! Reminder for task: ${task.title}</Say></Response>`
          });

          console.log(`📞 Call triggered → ${number}, SID: ${call.sid}`);
        } catch (twErr) {
          console.error(`❌ Twilio call failed for ${number}:`, twErr.message);
        }
      }

      // Mark reminder as sent
      task.reminderSent = true;
      await task.save();
    }  
    
  } catch (err) {
    console.error('Error in reminder worker:', err);
  }
};

// Start interval (every minute)
const startReminderWorker = () => {
  console.log('⏱️  Reminder worker started (every 60s)');
  setInterval(checkReminders, 60 * 1000);
};

module.exports = {
  startReminderWorker
};

const express = require('express');
const webPush = require('web-push');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set VAPID keys (dapat diganti dengan keys yang sudah Anda miliki)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webPush.setVapidDetails(
  'mailto:muhtopik07@gmail.com', // email Anda
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Simpan endpoint subscription yang diterima dari klien
const userSubscriptions = {};

app.post('/subscribe', (req, res) => {
  const { userId, subscription } = req.body;
  userSubscriptions[userId] = subscription;
  res.status(201).json({});
});

// Route untuk mengirim push notification
app.post('/sendNotification/:userId', async (req, res) => {
  const userId = req.params.userId;
  const notificationPayload = {
    notification: {
      title: `Judul Notifikasi ${userId}`,
      body: 'Isi Notifikasi',
      icon: 'icon-url', // URL ikon notifikasi
    },
  };
  const userSubscription = userSubscriptions[userId];
  if (userSubscription) {
    try {
      await webPush.sendNotification(userSubscription, JSON.stringify(notificationPayload));
      res.status(200).json({ message: 'Notification sent.' });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification.' });
    }
  } else {
    res.status(404).json({ error: 'User subscription not found.' });
  }
});

// Mulai server Express
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

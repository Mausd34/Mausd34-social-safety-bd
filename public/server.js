require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(express.static('public'));

const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Try again later.' }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/safenet_bd')
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.error('DB error:', e));

const reportSchema = new mongoose.Schema({
  category: String,
  priority: { type: String, enum: ['General','Urgent','LifeThreat'], default: 'General' },
  details: { type: String, required: true },
  anonymous: { type: Boolean, default: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['Open','InProgress','Solved'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});
reportSchema.index({ location: '2dsphere' });
const Report = mongoose.model('Report', reportSchema);

app.get('/', (req, res) => res.sendFile('index.html', { root: 'public' }));

app.post('/api/report', reportLimiter, async (req, res) => {
  try {
    const { category, priority, details, anonymous, coords } = req.body;
    const r = await Report.create({
      category: category || 'Other',
      priority: priority || 'General',
      details: details || '',
      anonymous: anonymous !== false,
      location: coords ? { type: 'Point', coordinates: coords } : undefined
    });
    res.status(201).json({ success: true, id: r._id, message: 'Report submitted securely.' });
  } catch (e) {
    res.status(500).json({ error: 'Submission failed', detail: e.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  const total = await Report.countDocuments();
  const open = await Report.countDocuments({ status: 'Open' });
  res.json({ total, open, solved: total - open, rate: total ? ((total-open)/total*100).toFixed(1) : 0 });
});

app.get('/api/admin/cases', async (req, res) => {
  const cases = await Report.find().sort({ createdAt: -1 }).limit(20).lean();
  res.json({ count: cases.length, cases });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
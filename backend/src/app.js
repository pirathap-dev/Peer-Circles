// Express application entry point.
const express = require('express');
const cors = require('cors');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const errorHandler = require('./middleware/errorHandler');
const groupRoutes = require('./routes/groupRoutes');
const groupDiscussionRoutes = require('./routes/groupDiscussionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


const app = express();

app.use(cors());
// Allow larger JSON bodies (e.g. base64 image uploads). Default 100kb is too
// small for a profile picture, so raise it to 10mb.
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api', groupDiscussionRoutes);
app.use('/api/upload', uploadRoutes);


app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use(errorHandler);

const port = config.port;
app.listen(port, () => {
  console.log(`Community Support Network API running on port ${port}`);
});

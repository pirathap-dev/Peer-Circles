// Event controllers: list, details, create, update, delete
const eventService = require('../services/eventService');

// List events with optional category, search, and upcomingOnly filters
exports.listEvents = async (req, res) => {
  try {
    const { category, search, upcomingOnly } = req.query;
    const events = await eventService.listEvents({ category, search, upcomingOnly });
    res.json({ events });
  } catch (err) {
    console.error('List events error:', err);
    res.status(500).json({ error: 'Could not load events.' });
  }
};

// Get details of a specific event by id
exports.getEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json({ event });
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ error: 'Could not load event.' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, latitude, longitude, category } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required.' });
    }
    if ((latitude == null) !== (longitude == null)) {
      return res.status(400).json({ error: 'Both map coordinates must be provided together.' });
    }
    if (latitude != null && (
      !Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90 ||
      !Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180
    )) {
      return res.status(400).json({ error: 'Event map coordinates are invalid.' });
    }
    const event = await eventService.createEvent({
      title, description, date, location,
      latitude: latitude == null ? null : Number(latitude),
      longitude: longitude == null ? null : Number(longitude),
      category,
    });
    res.status(201).json({ message: 'Event created.', event });
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ error: 'Could not create event.' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }
    const existing = await eventService.getEventById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const { title, description, date, location, latitude, longitude, category } = req.body;
    const nextLatitude = latitude !== undefined ? latitude : existing.latitude;
    const nextLongitude = longitude !== undefined ? longitude : existing.longitude;
    if ((nextLatitude == null) !== (nextLongitude == null)) {
      return res.status(400).json({ error: 'Both map coordinates must be provided together.' });
    }
    if (nextLatitude != null && (
      !Number.isFinite(Number(nextLatitude)) || Number(nextLatitude) < -90 || Number(nextLatitude) > 90 ||
      !Number.isFinite(Number(nextLongitude)) || Number(nextLongitude) < -180 || Number(nextLongitude) > 180
    )) {
      return res.status(400).json({ error: 'Event map coordinates are invalid.' });
    }

    const updatedEvent = await eventService.updateEvent(id, {
      title: title !== undefined ? title : existing.title,
      description: description !== undefined ? description : existing.description,
      date: date !== undefined ? date : existing.date,
      location: location !== undefined ? location : existing.location,
      latitude: nextLatitude == null ? null : Number(nextLatitude),
      longitude: nextLongitude == null ? null : Number(nextLongitude),
      category: category !== undefined ? category : existing.category
    });

    res.json({ message: 'Event updated.', event: updatedEvent });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ error: 'Could not update event.' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }
    const success = await eventService.deleteEvent(id);
    if (!success) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ error: 'Could not delete event.' });
  }
};

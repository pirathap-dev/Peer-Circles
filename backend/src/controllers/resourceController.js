const resourceService = require('../services/resourceService');

exports.listResources = async (_req, res) => {
  try {
    const resources = await resourceService.listResources();
    res.json({ resources });
  } catch (err) {
    console.error('List resources error:', err);
    res.status(500).json({ error: 'Could not load educational resources.' });
  }
};

exports.getResource = async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid resource ID.' });
  }

  try {
    const resource = await resourceService.getResourceById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }
    res.json({ resource });
  } catch (err) {
    console.error('Get resource error:', err);
    res.status(500).json({ error: 'Could not load educational resource.' });
  }
};
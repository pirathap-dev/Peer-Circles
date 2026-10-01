// Resource controllers: list, details, create, update, delete
const resourceService = require('../services/resourceService');

// List resources with optional category and search filters
exports.listResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    const resources = await resourceService.listResources({ category, search });
    res.json({ resources });
  } catch (err) {
    console.error('List resources error:', err);
    res.status(500).json({ error: 'Could not load resources.' });
  }
};

// Get details of a specific resource by ID
exports.getResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid resource ID.' });
    }
    const resource = await resourceService.getResourceById(id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }
    res.json({ resource });
  } catch (err) {
    console.error('Get resource error:', err);
    res.status(500).json({ error: 'Could not load resource.' });
  }
};

// Create a new educational resource
exports.createResource = async (req, res) => {
  try {
    const { title, description, content, category, url } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    const resource = await resourceService.createResource({ title, description, content, category, url });
    res.status(201).json({ message: 'Resource created.', resource });
  } catch (err) {
    console.error('Create resource error:', err);
    res.status(500).json({ error: 'Could not create resource.' });
  }
};

// Update an educational resource
exports.updateResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid resource ID.' });
    }
    const { title, description, content, category, url } = req.body;
    
    // Quick check if exists
    const existing = await resourceService.getResourceById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    const updatedResource = await resourceService.updateResource(id, { 
      title: title !== undefined ? title : existing.title, 
      description: description !== undefined ? description : existing.description, 
      content: content !== undefined ? content : existing.content, 
      category: category !== undefined ? category : existing.category, 
      url: url !== undefined ? url : existing.url 
    });
    
    res.json({ message: 'Resource updated.', resource: updatedResource });
  } catch (err) {
    console.error('Update resource error:', err);
    res.status(500).json({ error: 'Could not update resource.' });
  }
};

// Delete an educational resource
exports.deleteResource = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid resource ID.' });
    }
    const success = await resourceService.deleteResource(id);
    if (!success) {
      return res.status(404).json({ error: 'Resource not found.' });
    }
    res.json({ message: 'Resource deleted.' });
  } catch (err) {
    console.error('Delete resource error:', err);
    res.status(500).json({ error: 'Could not delete resource.' });
  }
};

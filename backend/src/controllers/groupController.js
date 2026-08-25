const groupService = require('../services/groupService');

// Get all support groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();

    return res.json({
      groups
    });
  } catch (err) {
    console.error('Get groups error:', err);

    return res.status(500).json({
      error: 'Could not load support groups.'
    });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);

    if (!group) {
      return res.status(404).json({
        error: 'Support group not found.'
      });
    }

    return res.json({
      group
    });
  } catch (err) {
    console.error('Get group error:', err);

    return res.status(500).json({
      error: 'Could not load support group.'
    });
  }
};
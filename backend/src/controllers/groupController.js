const groupService = require('../services/groupService');

// POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const { name, description, location } = req.body;
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof location !== 'string' || !location.trim()
    ) {
      return res.status(400).json({
        error: 'Group name, description, and location are required.'
      });
    }
    if (name.trim().length > 150 || location.trim().length > 100) {
      return res.status(400).json({
        error: 'Group name cannot exceed 150 characters and location cannot exceed 100 characters.'
      });
    }

    const group = await groupService.createGroup({
      name: name.trim(),
      description: description.trim(),
      location: location.trim()
    });
    return res.status(201).json({ message: 'Peer group created.', group });
  } catch (err) {
    console.error('Create peer group error:', err);
    return res.status(500).json({ error: 'Could not create peer group.' });
  }
};

// GET /api/groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();

    res.json({
      groups
    });
  } catch (err) {
    console.error('Get groups error:', err);

    res.status(500).json({
      error: 'Could not load support groups.'
    });
  }
};

// GET /api/groups/:id
exports.getGroup = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);

    if (!group) {
      return res.status(404).json({
        error: 'Support group not found.'
      });
    }

    res.json({
      group
    });
  } catch (err) {
    console.error('Get group error:', err);

    res.status(500).json({
      error: 'Could not load support group.'
    });
  }
};

// POST /api/groups/:id/join
exports.joinGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);

    if (!Number.isInteger(communityId)) {
      return res.status(400).json({
        error: 'Invalid group ID.'
      });
    }

    const result = await groupService.joinGroup(
      userId,
      communityId
    );

    res.status(201).json({
      message: 'Joined support group successfully.',
      group: result
    });

  } catch (err) {
    if (err.code === 'GROUP_NOT_FOUND') {
      return res.status(404).json({
        error: 'Support group not found.'
      });
    }

    if (err.code === 'ALREADY_MEMBER') {
      return res.status(409).json({
        error: 'You are already a member of this group.'
      });
    }

    console.error('Join group error:', err);

    res.status(500).json({
      error: 'Could not join support group.'
    });
  }
};

// DELETE /api/groups/:id/leave
exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);

    if (!Number.isInteger(communityId)) {
      return res.status(400).json({
        error: 'Invalid group ID.'
      });
    }

    const group = await groupService.leaveGroup(
      userId,
      communityId
    );

    res.json({
      message: 'Left support group successfully.',
      group
    });

  } catch (err) {
    if (err.code === 'GROUP_NOT_FOUND') {
      return res.status(404).json({
        error: 'Support group not found.'
      });
    }

    if (err.code === 'NOT_MEMBER') {
      return res.status(404).json({
        error: 'You are not a member of this group.'
      });
    }

    console.error('Leave group error:', err);

    res.status(500).json({
      error: 'Could not leave support group.'
    });
  }
};

// GET /api/groups/:id/membership
exports.checkMembership = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);

    if (!Number.isInteger(communityId)) {
      return res.status(400).json({
        error: 'Invalid group ID.'
      });
    }

    const isMember = await groupService.isMember(
      userId,
      communityId
    );

    res.json({
      isMember
    });

  } catch (err) {
    console.error('Check membership error:', err);

    res.status(500).json({
      error: 'Could not check membership.'
    });
  }
};
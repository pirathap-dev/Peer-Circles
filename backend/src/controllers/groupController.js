const groupService = require('../services/groupService');

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

    await groupService.leaveGroup(
      userId,
      communityId
    );

    res.json({
      message: 'Left support group successfully.'
    });

  } catch (err) {
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
// Community controllers: list, details, join, leave.
const communityService = require('../services/communityService');

// List communities with optional search and location filters
exports.listCommunities = async (req, res) => {
  try {
    const { search, location } = req.query;
    const communities = await communityService.listCommunities({ search, location });

    let joinedIds = [];
    if (req.user) {
      joinedIds = await communityService.getJoinedCommunityIds(req.user.id);
    }

    res.json({
      communities: communities.map((c) => ({
        ...c,
        is_member: joinedIds.includes(c.id),
      })),
    });
  } catch (err) {
    console.error('List communities error:', err);
    res.status(500).json({ error: 'Could not load communities.' });
  }
};

// Get details of a specific community by ID
exports.getCommunity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const community = await communityService.getCommunityById(id);
    // Check if the community exists
    if (!community) {
      return res.status(404).json({ error: 'Community not found.' });
    }

    let isMember = false;
    let memberAnonymous = false;
    if (req.user) {
      const membership = await communityService.getMembership(req.user.id, id);
      if (membership) {
        isMember = true;
        memberAnonymous = membership.anonymous;
      }
    }

    res.json({ community: { ...community, is_member: isMember, member_anonymous: memberAnonymous } });
  } catch (err) {
    console.error('Get community error:', err);
    res.status(500).json({ error: 'Could not load community.' });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let { anonymous } = req.body;
    if (anonymous !== undefined && typeof anonymous !== 'boolean') {
      return res.status(400).json({ error: 'anonymous field must be a boolean.' });
    }
    anonymous = anonymous || false;
    const community = await communityService.joinCommunity(req.user.id, id, anonymous);
    res.json({ message: 'Joined community.', community: { ...community, is_member: true } });
  } catch (err) {
    if (err.code === 'COMMUNITY_NOT_FOUND') {
      return res.status(404).json({ error: 'Community not found.' });
    }
    if (err.code === 'ALREADY_MEMBER') {
      return res.status(409).json({ error: 'You are already a member of this community.' });
    }
    console.error('Join community error:', err);
    return res.status(500).json({ error: 'Could not join community.' });
  }
};

// Leave a community
exports.leaveCommunity = async (req, res) => {
  try {
    // Validate community ID
    const id = parseInt(req.params.id, 10);
    const community = await communityService.leaveCommunity(req.user.id, id);
    res.json({ message: 'Left community.', community });
  } catch (err) {
    if (err.code === 'NOT_A_MEMBER') {
      return res.status(409).json({ error: 'You are not a member of this community.' });
    }
    console.error('Leave community error:', err);
    return res.status(500).json({ error: 'Could not leave community.' });
  }
};

// Update membership anonymity preference
exports.setMembershipAnonymous = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid community ID.' });
    }
    const { anonymous } = req.body;
    if (typeof anonymous !== 'boolean') {
      return res.status(400).json({ error: 'anonymous field must be a boolean.' });
    }
    const membership = await communityService.getMembership(req.user.id, id);
    if (!membership) {
      return res.status(403).json({ error: 'You must be a member to update this preference.' });
    }
    await communityService.setMembershipAnonymous(req.user.id, id, anonymous);
    res.json({ message: 'Anonymity preference updated.', anonymous });
  } catch (err) {
    console.error('Update anonymity preference error:', err);
    res.status(500).json({ error: 'Could not update preference.' });
  }
};

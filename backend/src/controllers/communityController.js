// Community controllers: list, details, join, leave.
const communityService = require('../services/communityService');

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

exports.getCommunity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const community = await communityService.getCommunityById(id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found.' });
    }

    let isMember = false;
    if (req.user) {
      isMember = await communityService.isMember(req.user.id, id);
    }

    res.json({ community: { ...community, is_member: isMember } });
  } catch (err) {
    console.error('Get community error:', err);
    res.status(500).json({ error: 'Could not load community.' });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const community = await communityService.joinCommunity(req.user.id, id);
    res.json({ message: 'Joined community.', community });
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

exports.leaveCommunity = async (req, res) => {
  try {
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

const friendService = require('../services/friendService');

exports.getRelationships = async (req, res) => {
  try {
    const relationships = await friendService.getRelationships(req.user.id);
    return res.status(200).json(relationships);
  } catch (err) {
    console.error('getFriendRelationships error:', err);
    return res.status(500).json({ error: 'Could not load friends.' });
  }
};

exports.searchUsers = async (req, res) => {
  const searchTerm = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (searchTerm.length < 2) {
    return res.status(400).json({ error: 'Search must contain at least 2 characters.' });
  }
  if (searchTerm.length > 100) {
    return res.status(400).json({ error: 'Search cannot exceed 100 characters.' });
  }

  try {
    const users = await friendService.searchUsers(req.user.id, searchTerm);
    return res.status(200).json({ users });
  } catch (err) {
    console.error('searchFriendUsers error:', err);
    return res.status(500).json({ error: 'Could not search for people.' });
  }
};

exports.sendRequest = async (req, res) => {
  const recipientId = Number(req.body && req.body.recipient_id);
  if (!Number.isInteger(recipientId) || recipientId <= 0) {
    return res.status(400).json({ error: 'recipient_id must be a positive integer.' });
  }
  if (recipientId === req.user.id) {
    return res.status(400).json({ error: 'You cannot add yourself as a friend.' });
  }

  try {
    const request = await friendService.sendRequest(req.user.id, recipientId);
    return res.status(201).json({ request });
  } catch (err) {
    if (err.code === 'RELATIONSHIP_EXISTS') {
      return res.status(409).json({ error: err.message });
    }
    if (err.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    console.error('sendFriendRequest error:', err);
    return res.status(500).json({ error: 'Could not send friend request.' });
  }
};

exports.respondToRequest = async (req, res) => {
  const requestId = Number(req.params.requestId);
  const action = req.body && req.body.action;
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ error: 'requestId must be a positive integer.' });
  }
  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'action must be accept or reject.' });
  }

  try {
    await friendService.respondToRequest(requestId, req.user.id, action);
    return res.status(200).json({
      message: action === 'accept' ? 'Friend request accepted.' : 'Friend request rejected.',
    });
  } catch (err) {
    if (err.code === 'REQUEST_NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    if (err.code === 'FORBIDDEN') {
      return res.status(403).json({ error: err.message });
    }
    console.error('respondToFriendRequest error:', err);
    return res.status(500).json({ error: 'Could not update friend request.' });
  }
};

exports.cancelRequest = async (req, res) => {
  const requestId = Number(req.params.requestId);
  if (!Number.isInteger(requestId) || requestId <= 0) {
    return res.status(400).json({ error: 'requestId must be a positive integer.' });
  }

  try {
    await friendService.cancelRequest(requestId, req.user.id);
    return res.status(200).json({ message: 'Friend request cancelled.' });
  } catch (err) {
    if (err.code === 'REQUEST_NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    console.error('cancelFriendRequest error:', err);
    return res.status(500).json({ error: 'Could not cancel friend request.' });
  }
};

exports.removeFriend = async (req, res) => {
  const friendId = Number(req.params.friendId);
  if (!Number.isInteger(friendId) || friendId <= 0) {
    return res.status(400).json({ error: 'friendId must be a positive integer.' });
  }

  try {
    await friendService.removeFriend(friendId, req.user.id);
    return res.status(200).json({ message: 'Friend removed.' });
  } catch (err) {
    if (err.code === 'FRIEND_NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    console.error('removeFriend error:', err);
    return res.status(500).json({ error: 'Could not remove friend.' });
  }
};

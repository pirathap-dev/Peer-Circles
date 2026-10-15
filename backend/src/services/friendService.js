const db = require('../config/db');
const notificationService = require('./notificationService');

function relationshipValues(userId, otherUserId) {
  return [Math.min(userId, otherUserId), Math.max(userId, otherUserId)];
}

async function getRelationships(userId) {
  const result = await db.query(
    `SELECT
       fr.id AS relationship_id,
       fr.status,
       fr.requested_by,
       other.id AS user_id,
       other.name,
       other.avatar_url
     FROM friend_relationships fr
     JOIN users other
       ON other.id = CASE
         WHEN fr.user_a_id = $1 THEN fr.user_b_id
         ELSE fr.user_a_id
       END
     WHERE fr.user_a_id = $1 OR fr.user_b_id = $1
     ORDER BY other.name`,
    [userId]
  );

  const friends = [];
  const incomingRequests = [];
  const outgoingRequests = [];
  for (const row of result.rows) {
    const person = {
      id: row.user_id,
      name: row.name,
      avatar_url: row.avatar_url,
    };
    if (row.status === 'accepted') {
      friends.push({ ...person, relationship_id: row.relationship_id });
    } else if (row.requested_by === userId) {
      outgoingRequests.push({ ...person, request_id: row.relationship_id });
    } else {
      incomingRequests.push({ ...person, request_id: row.relationship_id });
    }
  }

  return { friends, incomingRequests, outgoingRequests };
}

async function searchUsers(userId, searchTerm) {
  const result = await db.query(
    `SELECT
       u.id,
       u.name,
       u.avatar_url,
       CASE
         WHEN fr.status = 'accepted' THEN 'accepted'
         WHEN fr.requested_by = $1 THEN 'request_sent'
         WHEN fr.id IS NOT NULL THEN 'request_received'
         ELSE NULL
       END AS friend_status
     FROM users u
     LEFT JOIN friend_relationships fr
       ON fr.user_a_id = LEAST($1, u.id)
      AND fr.user_b_id = GREATEST($1, u.id)
     WHERE u.id <> $1
       AND u.name ILIKE $2
       AND (u.make_profile_private = FALSE OR fr.id IS NOT NULL)
     ORDER BY u.name
     LIMIT 50`,
    [userId, `%${searchTerm}%`]
  );
  return result.rows;
}

async function sendRequest(userId, recipientId) {
  const [userAId, userBId] = relationshipValues(userId, recipientId);
  return db.transaction(async (client) => {
    const recipient = await client.query('SELECT id FROM users WHERE id = $1', [recipientId]);
    if (recipient.rowCount === 0) {
      const error = new Error('User not found.');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const inserted = await client.query(
      `INSERT INTO friend_relationships (user_a_id, user_b_id, requested_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_a_id, user_b_id) DO NOTHING
       RETURNING id, status`,
      [userAId, userBId, userId]
    );
    if (inserted.rowCount === 0) {
      const error = new Error('A friend request or friendship already exists.');
      error.code = 'RELATIONSHIP_EXISTS';
      throw error;
    }

    await notificationService.createNotification(
      client,
      recipientId,
      'friend_request',
      'You received a friend request.'
    );
    return inserted.rows[0];
  });
}

async function respondToRequest(requestId, userId, action) {
  return db.transaction(async (client) => {
    const request = await client.query(
      `SELECT id, requested_by
       FROM friend_relationships
       WHERE id = $1 AND status = 'pending'
         AND (user_a_id = $2 OR user_b_id = $2)
       FOR UPDATE`,
      [requestId, userId]
    );
    if (request.rowCount === 0) {
      const error = new Error('Friend request not found.');
      error.code = 'REQUEST_NOT_FOUND';
      throw error;
    }
    if (request.rows[0].requested_by === userId) {
      const error = new Error('You cannot respond to your own friend request.');
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (action === 'accept') {
      await client.query(
        `UPDATE friend_relationships
         SET status = 'accepted', updated_at = NOW()
         WHERE id = $1`,
        [requestId]
      );
      await notificationService.createNotification(
        client,
        request.rows[0].requested_by,
        'friend_request_accepted',
        'Your friend request was accepted.'
      );
    } else {
      await client.query('DELETE FROM friend_relationships WHERE id = $1', [requestId]);
    }
  });
}

async function cancelRequest(requestId, userId) {
  const result = await db.query(
    `DELETE FROM friend_relationships
     WHERE id = $1 AND status = 'pending' AND requested_by = $2
     RETURNING id`,
    [requestId, userId]
  );
  if (result.rowCount === 0) {
    const error = new Error('Outgoing friend request not found.');
    error.code = 'REQUEST_NOT_FOUND';
    throw error;
  }
}

async function removeFriend(friendId, userId) {
  const [userAId, userBId] = relationshipValues(userId, friendId);
  const result = await db.query(
    `DELETE FROM friend_relationships
     WHERE user_a_id = $1 AND user_b_id = $2 AND status = 'accepted'
     RETURNING id`,
    [userAId, userBId]
  );
  if (result.rowCount === 0) {
    const error = new Error('Friend not found.');
    error.code = 'FRIEND_NOT_FOUND';
    throw error;
  }
}

module.exports = {
  getRelationships,
  searchUsers,
  sendRequest,
  respondToRequest,
  cancelRequest,
  removeFriend,
};

const db = require('../config/db');

// Get all support groups
async function getAllGroups() {
  const result = await db.query(
    `SELECT
       id,
       name,
       description,
       location,
       member_count,
       created_at
     FROM communities
     ORDER BY created_at DESC`
  );

  return result.rows;
}

// Get one support group
async function getGroupById(id) {
  const result = await db.query(
    `SELECT
       id,
       name,
       description,
       location,
       member_count,
       created_at
     FROM communities
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

// Join a support group
async function joinGroup(userId, communityId) {
  // 1. Check whether the community exists
  const community = await db.query(
    `SELECT id, name
     FROM communities
     WHERE id = $1`,
    [communityId]
  );

  if (community.rowCount === 0) {
    const error = new Error('GROUP_NOT_FOUND');
    error.code = 'GROUP_NOT_FOUND';
    throw error;
  }

  // 2. Check whether user already joined
  const existingMember = await db.query(
    `SELECT id
     FROM community_members
     WHERE user_id = $1
       AND community_id = $2`,
    [userId, communityId]
  );

  if (existingMember.rowCount > 0) {
    const error = new Error('ALREADY_MEMBER');
    error.code = 'ALREADY_MEMBER';
    throw error;
  }

  // 3. Add member
  await db.query(
    `INSERT INTO community_members
       (user_id, community_id, joined_at)
     VALUES ($1, $2, NOW())`,
    [userId, communityId]
  );

  // 4. Increase member count
  await db.query(
    `UPDATE communities
     SET member_count = member_count + 1
     WHERE id = $1`,
    [communityId]
  );

  return {
    communityId,
    communityName: community.rows[0].name
  };
}

// Leave a support group
async function leaveGroup(userId, communityId) {
  return db.transaction(async (client) => {
    const community = await client.query(
      `SELECT id, name FROM communities WHERE id = $1 FOR UPDATE`,
      [communityId]
    );

    if (community.rowCount === 0) {
      const error = new Error('GROUP_NOT_FOUND');
      error.code = 'GROUP_NOT_FOUND';
      throw error;
    }

    const membership = await client.query(
      `DELETE FROM community_members
       WHERE user_id = $1 AND community_id = $2
       RETURNING id`,
      [userId, communityId]
    );

    if (membership.rowCount === 0) {
      const error = new Error('NOT_MEMBER');
      error.code = 'NOT_MEMBER';
      throw error;
    }

    const updatedGroup = await client.query(
      `UPDATE communities
       SET member_count = GREATEST(member_count - 1, 0)
       WHERE id = $1
       RETURNING id, name, member_count`,
      [communityId]
    );

    return updatedGroup.rows[0];
  });
}

// Check whether user is a member
async function isMember(userId, communityId) {
  const result = await db.query(
    `SELECT id
     FROM community_members
     WHERE user_id = $1
       AND community_id = $2`,
    [userId, communityId]
  );

  return result.rowCount > 0;
}

module.exports = {
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  isMember
};
// Data-access layer for communities and membership.
const db = require('../config/db');

async function listCommunities({ search, location } = {}) {
  let query = 'SELECT id, name, description, location, member_count, created_at FROM communities';
  const where = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (location) {
    params.push(location);
    where.push(`location = $${params.length}`);
  }

  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY name ASC';

  const result = await db.query(query, params);
  return result.rows;
}

async function getCommunityById(id) {
  const result = await db.query(
    'SELECT id, name, description, location, member_count, created_at FROM communities WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function isMember(userId, communityId) {
  const result = await db.query(
    'SELECT 1 FROM community_members WHERE user_id = $1 AND community_id = $2',
    [userId, communityId]
  );
  return result.rowCount > 0;
}

async function joinCommunity(userId, communityId) {
  const exists = await getCommunityById(communityId);
  if (!exists) {
    const error = new Error('COMMUNITY_NOT_FOUND');
    error.code = 'COMMUNITY_NOT_FOUND';
    throw error;
  }

  const already = await isMember(userId, communityId);
  if (already) {
    const error = new Error('ALREADY_MEMBER');
    error.code = 'ALREADY_MEMBER';
    throw error;
  }

  await db.query(
    'INSERT INTO community_members (user_id, community_id) VALUES ($1, $2)',
    [userId, communityId]
  );
  await db.query(
    'UPDATE communities SET member_count = member_count + 1 WHERE id = $1',
    [communityId]
  );
  return getCommunityById(communityId);
}

async function leaveCommunity(userId, communityId) {
  const already = await isMember(userId, communityId);
  if (!already) {
    const error = new Error('NOT_A_MEMBER');
    error.code = 'NOT_A_MEMBER';
    throw error;
  }

  await db.query(
    'DELETE FROM community_members WHERE user_id = $1 AND community_id = $2',
    [userId, communityId]
  );
  await db.query(
    'UPDATE communities SET member_count = GREATEST(member_count - 1, 0) WHERE id = $1',
    [communityId]
  );
  return getCommunityById(communityId);
}

async function getJoinedCommunityIds(userId) {
  const result = await db.query(
    'SELECT community_id FROM community_members WHERE user_id = $1',
    [userId]
  );
  return result.rows.map((row) => row.community_id);
}

module.exports = {
  listCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  isMember,
  getJoinedCommunityIds,
};

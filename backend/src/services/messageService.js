const db = require('../config/db');

async function resolveOtherUser(otherUserId, requestingUserId) {
  const userQuery = `
    SELECT id, name, avatar_url
    FROM users
    WHERE id = $1
  `;
  const userRes = await db.query(userQuery, [otherUserId]);
  if (userRes.rowCount === 0) {
    const error = new Error('User not found.');
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  const user = userRes.rows[0];

  const anonQuery = `
    SELECT cm.anonymous, cm.anon_alias
    FROM community_members cm
    WHERE cm.user_id = $1
      AND cm.community_id IN (
        SELECT community_id FROM community_members WHERE user_id = $2
      )
    LIMIT 1;
  `;
  const anonRes = await db.query(anonQuery, [otherUserId, requestingUserId]);
  
  let is_anonymous = false;
  let anon_alias = null;
  let display_name = user.name;
  let name = user.name;
  let avatar_url = user.avatar_url || null;

  if (anonRes.rowCount > 0 && anonRes.rows[0].anonymous === true) {
    is_anonymous = true;
    anon_alias = anonRes.rows[0].anon_alias;
    display_name = anon_alias;
    name = null;
    avatar_url = null;
  }

  return {
    id: user.id,
    name,
    display_name,
    avatar_url,
    is_anonymous,
    anon_alias
  };
}

async function getConversationsForUser(userId) {
  const convQuery = `
    SELECT
      c.id,
      CASE WHEN c.user_a_id = $1 THEN c.user_b_id ELSE c.user_a_id END AS other_user_id,
      (
        SELECT row_to_json(m)
        FROM (
          SELECT id, content, sender_id, created_at, is_read
          FROM messages
          WHERE conversation_id = c.id
          ORDER BY created_at DESC
          LIMIT 1
        ) m
      ) AS last_message,
      (
        SELECT COUNT(*)::int
        FROM messages
        WHERE conversation_id = c.id
          AND sender_id != $1
          AND is_read = false
      ) AS unread_count
    FROM conversations c
    WHERE c.user_a_id = $1 OR c.user_b_id = $1
    ORDER BY (
      SELECT created_at FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    ) DESC NULLS LAST;
  `;
  const result = await db.query(convQuery, [userId]);
  const conversations = result.rows;

  for (let conv of conversations) {
    const otherUserId = conv.other_user_id;
    conv.other_user = await resolveOtherUser(otherUserId, userId);
    delete conv.other_user_id;
  }

  return conversations;
}

async function getOrCreateConversation(userAId, userBId) {
  const u1 = Math.min(userAId, userBId);
  const u2 = Math.max(userAId, userBId);

  await db.query(`
    INSERT INTO conversations (user_a_id, user_b_id)
    VALUES ($1, $2)
    ON CONFLICT ON CONSTRAINT conversations_unique_pair DO NOTHING;
  `, [u1, u2]);

  const res = await db.query(`
    SELECT id, user_a_id, user_b_id
    FROM conversations
    WHERE user_a_id = $1 AND user_b_id = $2;
  `, [u1, u2]);

  return res.rows[0];
}

async function getMessagesForConversation(conversationId, requestingUserId) {
  const convRes = await db.query(`SELECT user_a_id, user_b_id FROM conversations WHERE id = $1`, [conversationId]);
  if (convRes.rowCount === 0) {
    const error = new Error('You do not have access to this conversation.');
    error.code = 'FORBIDDEN';
    throw error;
  }
  const conv = convRes.rows[0];
  if (conv.user_a_id !== requestingUserId && conv.user_b_id !== requestingUserId) {
    const error = new Error('You do not have access to this conversation.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  await db.query(`
    UPDATE messages
    SET is_read = true
    WHERE conversation_id = $1
      AND sender_id != $2
      AND is_read = false
  `, [conversationId, requestingUserId]);

  const msgRes = await db.query(`
    SELECT id, conversation_id, sender_id, content, is_read, created_at
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC
  `, [conversationId]);

  return msgRes.rows;
}

async function sendMessage({ conversationId, senderId, content }) {
  const convRes = await db.query(`SELECT user_a_id, user_b_id FROM conversations WHERE id = $1`, [conversationId]);
  if (convRes.rowCount === 0) {
    const error = new Error('You do not have access to this conversation.');
    error.code = 'FORBIDDEN';
    throw error;
  }
  const conv = convRes.rows[0];
  if (conv.user_a_id !== senderId && conv.user_b_id !== senderId) {
    const error = new Error('You do not have access to this conversation.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  const msgRes = await db.query(`
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, conversation_id, sender_id, content, is_read, created_at;
  `, [conversationId, senderId, content]);

  return msgRes.rows[0];
}

async function deleteMessage(messageId, requestingUserId) {
  const msgRes = await db.query(`SELECT sender_id FROM messages WHERE id = $1`, [messageId]);
  if (msgRes.rowCount === 0) {
    const error = new Error('Message not found.');
    error.code = 'MESSAGE_NOT_FOUND';
    throw error;
  }
  if (msgRes.rows[0].sender_id !== requestingUserId) {
    const error = new Error('You can only delete your own messages.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  await db.query(`DELETE FROM messages WHERE id = $1`, [messageId]);
  return true;
}

module.exports = {
  resolveOtherUser,
  getConversationsForUser,
  getOrCreateConversation,
  getMessagesForConversation,
  sendMessage,
  deleteMessage
};

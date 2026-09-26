const messageService = require('../services/messageService');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getConversationsForUser(userId);
    return res.status(200).json({ conversations });
  } catch (err) {
    console.error('getConversations error:', err);
    return res.status(500).json({ error: 'Could not load conversations.' });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const recipientId = Number(req.body.recipient_id);

    if (!Number.isInteger(recipientId) || recipientId <= 0) {
      return res.status(400).json({ error: 'recipient_id must be a positive integer.' });
    }
    if (recipientId === userId) {
      return res.status(400).json({ error: 'Cannot start a conversation with yourself.' });
    }

    let other_user;
    try {
      other_user = await messageService.resolveOtherUser(recipientId, userId);
    } catch (err) {
      if (err.code === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: err.message });
      }
      throw err;
    }

    const conversation = await messageService.getOrCreateConversation(userId, recipientId);

    return res.status(201).json({
      conversation: {
        id: conversation.id,
        other_user
      }
    });
  } catch (err) {
    console.error('startConversation error:', err);
    return res.status(500).json({ error: 'Could not start conversation.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = Number(req.params.conversationId);

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      return res.status(400).json({ error: 'conversationId must be a positive integer.' });
    }

    const messages = await messageService.getMessagesForConversation(conversationId, userId);
    return res.status(200).json({ messages });
  } catch (err) {
    if (err.code === 'FORBIDDEN') {
      return res.status(403).json({ error: err.message });
    }
    console.error('getMessages error:', err);
    return res.status(500).json({ error: 'Could not load messages.' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = Number(req.body.conversation_id);
    let { content } = req.body;

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      return res.status(400).json({ error: 'conversation_id must be a positive integer.' });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }
    content = content.trim();
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Message content cannot exceed 2000 characters.' });
    }

    const message = await messageService.sendMessage({
      conversationId,
      senderId: userId,
      content
    });

    return res.status(201).json({ message });
  } catch (err) {
    if (err.code === 'FORBIDDEN') {
      return res.status(403).json({ error: err.message });
    }
    console.error('sendMessage error:', err);
    return res.status(500).json({ error: 'Could not send message.' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = Number(req.params.messageId);

    if (!Number.isInteger(messageId) || messageId <= 0) {
      return res.status(400).json({ error: 'messageId must be a positive integer.' });
    }

    await messageService.deleteMessage(messageId, userId);
    return res.status(200).json({ message: 'Message deleted.' });
  } catch (err) {
    if (err.code === 'MESSAGE_NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    if (err.code === 'FORBIDDEN') {
      return res.status(403).json({ error: err.message });
    }
    console.error('deleteMessage error:', err);
    return res.status(500).json({ error: 'Could not delete message.' });
  }
};

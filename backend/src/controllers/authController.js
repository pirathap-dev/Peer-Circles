// Auth controllers: register, login, me.
const userService = require('../services/userService');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const user = await userService.createUser({ name, email, password });
    const token = userService.issueAuthToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url || null },
    });
  } catch (err) {
    if (err.code === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Could not create account. Please try again.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await userService.authenticate({ email, password });
    const token = userService.issueAuthToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url || null },
    });
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Could not sign in. Please try again.' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Could not load user.' });
  }
};

exports.updateMe = async (req, res) => {
  const { name, email, avatar_url } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !email.trim() || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (avatar_url !== undefined && avatar_url !== null && typeof avatar_url !== 'string') {
    return res.status(400).json({ error: 'avatar_url must be a string.' });
  }

  try {
    const user = await userService.updateUser(req.user.id, { name, email, avatar_url });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    if (err.code === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Could not update profile.' });
  }
};

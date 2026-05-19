const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /auth/google
 * Verifies the Firebase token and returns user info.
 * Used by frontend to confirm backend auth is working.
 */
router.post('/google', protect, (req, res) => {
  res.status(200).json({
    message: 'Authenticated successfully',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

module.exports = router;

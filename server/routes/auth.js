const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, me, refresh } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Guest mode - bypass authentication
router.post('/guest', (req, res) => {
  const guestUser = {
    _id: 'guest-user-id',
    name: 'Guest User',
    email: 'guest@arcadia.health',
    role: 'guest'
  };
  
  // Create a simple token for guest
  const token = Buffer.from(JSON.stringify(guestUser)).toString('base64');
  
  res.json({
    token,
    user: guestUser
  });
});

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  login
);

router.get('/me', auth, me);
router.post('/refresh', refresh);

module.exports = router;

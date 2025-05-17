const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add route logging
router.use((req, res, next) => {
  console.log(`User route hit: ${req.method} ${req.path}`);
  next();
});

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
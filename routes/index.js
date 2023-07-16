const router = require('express').Router();

const { createUser, loginUser, logoutUser } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', loginUser);
router.post('/signout', logoutUser);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
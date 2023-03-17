const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('cookie');
});

router.get('/cook', (req, res) => {
  res.cookie('alert', true, {
    maxAge: 1000 * 5,
  });
  res.status(200).json('쿠키 굽기 성공!');
});

module.exports = router;

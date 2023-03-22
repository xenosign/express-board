const mongoClient = require('./mongoConnect');

const UNEXPECTED_MSG =
  '알 수 없는 문제 발생.<br><a href="/register">회원 가입으로 이동</a>';
const DUPLICATED_MSG =
  '동일한 ID를 가지는 회원이 존재합니다.<br><a href="/register">회원 가입으로 이동</a>';
const SUCCESS_MSG = '회원 가입 성공!<br><a href="/login">로그인으로 이동</a>';

const LOGIN_UNEXPECTED_MSG =
  '알 수 없는 문제 발생.<br><a href="/login">로그인으로 이동</a>';
const LOGIN_NOT_REGISTERD_MSG =
  '입력 하신 ID를 가지는 회원이 존재하지 않습니다.<br><a href="/register">회원 가입으로 이동</a>';
const LOGIN_WRONG_PASSWORD_MSG =
  '비밀번호가 틀렸습니다.<br><a href="/login">로그인으로 이동</a>';

const registerUser = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const user = client.db('kdt5').collection('user');

    const duplicatedUser = await user.findOne({ id: req.body.id });
    if (duplicatedUser) return res.status(400).send(DUPLICATED_MSG);

    await user.insertOne(req.body);
    res.status(200).send(SUCCESS_MSG);
  } catch (err) {
    console.error(err);
    res.status(500).send(UNEXPECTED_MSG);
  }
};

const loginUser = async (req, res) => {
  try {
    const client = await mongoClient.connect();
    const user = client.db('kdt5').collection('user');

    const findUser = await user.findOne({ id: req.body.id });
    if (!findUser) return res.status(400).send(LOGIN_NOT_REGISTERD_MSG);

    if (findUser.password !== req.body.password)
      return res.status(400).send(LOGIN_WRONG_PASSWORD_MSG);

    req.session.login = true;
    req.session.userId = req.body.id;

    res.cookie('user', req.body.id, {
      maxAge: 1000 * 30,
      httpOnly: true,
      signed: true,
    });

    res.status(200);
    res.redirect('/dbBoard');
  } catch (err) {
    console.error(err);
    res.status(500).send(LOGIN_UNEXPECTED_MSG);
  }
};

module.exports = {
  registerUser,
  loginUser,
};

// const userDB = {
//   // 중복 회원 찾기
//   userCheck: async (userId) => {
//     try {
//       const client = await mongoClient.connect();
//       const user = client.db('kdt5').collection('user');
//       const findUser = await user.findOne({ id: userId });
//       return findUser;
//     } catch (err) {
//       console.error(err);
//     }
//   },
//   // 회원 가입 하기
//   registerUser: async (newUser) => {
//     try {
//       const client = await mongoClient.connect();
//       const user = client.db('kdt5').collection('user');

//       await user.insertOne(newUser);
//       return true;
//     } catch (err) {
//       console.error(err);
//     }
//   },
// };

// module.exports = userDB;

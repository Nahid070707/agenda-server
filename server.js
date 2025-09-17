const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// LOGIN endpoint
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ username, password }).value();

  if (user) {
    res.json({ token: user.token });
  } else {
    res.status(401).json({ error: 'İstifadəçi adı və ya şifrə səhvdir' });
  }
});

// REGISTER endpoint
server.post('/register', (req, res) => {
  const { username, password } = req.body;
  const db = router.db;
  const existingUser = db.get('users').find({ username }).value();

  if (existingUser) {
    return res.status(400).json({ error: 'Bu istifadəçi artıq mövcuddur' });
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    token: Math.random().toString(36).substring(2)
  };

  db.get('users').push(newUser).write();
  res.status(201).json({ token: newUser.token });
});

// Google login (mock)
server.post('/login/google', (req, res) => {
  const { access_token } = req.body;
  if (access_token) {
    res.json({ token: 'google_' + access_token });
  } else {
    res.status(400).json({ error: 'Access token tələb olunur' });
  }
});

// Facebook login (mock)
server.post('/login/facebook', (req, res) => {
  const { access_token } = req.body;
  if (access_token) {
    res.json({ token: 'facebook_' + access_token });
  } else {
    res.status(400).json({ error: 'Access token tələb olunur' });
  }
});

// Default router
server.use(router);

// Railway port konfiqurasiyası
const port = process.env.PORT || 8010;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 JSON Server custom API ${port} portunda işə düşdü`);
});

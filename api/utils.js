const requireLoggedIn = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "Error",
      message: "Username or Password is incorrect",
    });
  }
  next();
};

const requireAuth = () => {
  const auth = req.header("Authorization");
  if (!auth) {
    res
      .status(401)
      .send({
        error: "Access denied. No token provided.",
        message: "You must be logged in to perform this action",
        name: "Error",
      });
  } else {
    const token = auth.slice(7);
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
  }
};

module.exports = {
  requireLoggedIn,
  requireAuth
};

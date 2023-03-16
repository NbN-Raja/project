function validateUsername(req, res, next) {
    const { username } = req.body;
    if (username && username.length > 5) {
      next();
    } else {
      const error = new Error('Username must be greater than 5 characters');
      error.status = 400;
      next(error);
    }
  }
  
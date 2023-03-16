module.exports = {
  
    dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
    jwtSecret: process.env.JWT_SECRET || 'myappsecret'
  };
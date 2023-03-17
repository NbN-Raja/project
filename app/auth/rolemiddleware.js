
// module.exports={

//     function roleauth(params) {
    
//         if (req.user.role === 'admin') {
//             // Add admin-specific functionality or redirect to admin panel
//             res.status('200').send(user);
//           } else {
//             // Add user-specific functionality or redirect to user dashboard
//             res.status('404').send({message : "You Are Not Admin"});
//           }
//     }
// }

module.exports = async function requireAdmin(req, res, next) {
    // Check if user is authenticated and has admin role
    if ( req.user.role === 'admin') {
      return next();
    }
    // Redirect to login page if user is not authenticated or doesn't have admin role
    res.status(401).send({message: "You are Not Admin"});
  };

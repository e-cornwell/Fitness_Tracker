const requireUserPass = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        next({
            name: "Error",
            message: "Username or Password is incorrect"
        });  
    }
    next()
}

module.exports = {
    requireUserPass
};
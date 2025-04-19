const adminPage = (req, res) => {
    res.json({
        message: "Welcome Admin!",
        user: req.user // Display user details from the token
    });
};

module.exports = adminPage;

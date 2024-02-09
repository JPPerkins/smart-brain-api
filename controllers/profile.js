const handleProfileGet = (req, res, db) => {
    const { id } = req.params;

    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(404).json('User not found.');
            }
        })
        .catch(err => {
            console.error('Error getting user.');
            res.status(500).json('Internal Server Error');
        });
};

export default handleProfileGet;
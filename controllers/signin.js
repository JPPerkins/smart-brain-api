const handleSignIn = (req, res, db, bcrypt) => {
	const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

	db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then(data => {
			if (data.length === 0) {
                return res.status(400).json('Wrong credentials');
            }

			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*')
					.from('users')
					.where('email', '=', email)
					.then(user => {
						if (user.length === 0) {
                            return res.status(400).json('Unable to get user');
                        }
                        res.json(user[0]);
					})
					.catch(err => {
                        console.error('Error getting user.');
                        res.status(500).json('Internal Server Error');
                    });
			} else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch(err => {
            console.error('Error checking credentials.');
            res.status(500).json('Internal Server Error');
        });
};

export default handleSignIn;
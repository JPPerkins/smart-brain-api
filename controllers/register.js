const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password } = req.body;

	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into("login")
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0].email,
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
				.catch(err => {
					console.error('Error inserting user.');
					res.status(500).json('Internal Server Error');
				});
		})
		.then(trx.commit)
		.catch(err => {
			console.error('Error committing transaction.');
			trx.rollback();
			res.status(500).json('Internal Server Error');
		});
	})
	.catch(err => {
        console.error('Error starting transaction:', err);
        res.status(500).json('Internal Server Error');
    });
};

export default handleRegister;
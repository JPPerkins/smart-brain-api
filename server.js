const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const app = express();
app.use(express.json());


const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
			res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const {email, name, password } = req.body;
	
	bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash);
	});

	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});

	res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;

	database.users.forEach(user => {
		if (user.id == id) {
			found = true;
			res.json(user);
		}
	})

	if (!found) {
		res.status(400).json('not found');
	}
});

app.put('/image', (req, res) => {
	const { id } = req.params;
	let found = false;

	database.users.forEach(user => {
		if (user.id == id) {
			found = true;
			user.entires++;
			return res.json(user.entries);
		}
	})

	if (!found) {
		res.status(400).json('not found');
	}
})

app.listen(3000, () => {
	console.log('app is running on port 3000');
});
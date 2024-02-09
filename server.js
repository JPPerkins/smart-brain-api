import express, { json } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import { handleRegister } from './controllers/register';
import { handleSignIn } from './controllers/signin';
import { handleProfileGet } from './controllers/profile';
import { handleImage, handleApiCall } from './controllers/image';

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
		host: process.env.DATABASE_HOST,
		port: process.env.PORT,
		user : process.env.DATABASE_USER,
		password : process.env.DATABASE_PW,
		database : process.env.DATABASE_DB
	}
});

const app = express();
app.use(json());

app.use(cors());

app.get('/', (req, res) => {res.send('success')});

app.post('/signin', (req, res) => { handleSignIn(req, res, db, bcrypt)});

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => { handleProfileGet(req, res, db)});

app.put('/image', (req, res) => { handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { handleApiCall(req, res)})

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('app is running on... ' + port);
});
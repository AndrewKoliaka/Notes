const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json');
const app = express();
const router = express.Router();

// db
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
	useNewUrlParser: true
});


// schemas
const userSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const noteSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
});

// models
const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

// routes
router.post('/login', async (req, res) => {
	({ email, password } = req.body);

	try {
		const user = await User.findOne({ email, password })
		user ? res.status(200).json({ id: user.id }) : res.sendStatus(404);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post('/register', async (req, res) => {
	({ name, email, password } = req.body);

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) return res.sendStatus(409);
		const createdUser = await User.create({ name, email, password });
		res.status(200).json(createdUser);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get('/users/:id/notes', async (req, res) => {
	const userId = req.params.id;

	try {
		const notes = await Note.where({ userId });
		res.status(200).json({ notes });
	} catch (error) {
		res.status(404).json(error)
	}
});

router.post('/notes', async (req, res) => {
	try {
		await Note.create(req.body)
		res.sendStatus(200);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post('/notes/:id', async (req, res) => {
	const id = req.params.id;
	const updateData = {
		text: req.body.text,
		date: new Date()
	}

	try {
		await Note.findOneAndUpdate({ _id: id } , { $set: updateData });
		res.sendStatus(200);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.delete('/notes/:id', async (req, res) => {
	const id = req.params.id;

	try {
		await Note.findOneAndDelete({ _id: id });
		res.sendStatus(200);
	} catch (error) {
		res.status(500).json(error);
	}
});

// middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', router);

app.listen(config.port, () => {
	console.log(`Server is listening ${config.port}`);
});
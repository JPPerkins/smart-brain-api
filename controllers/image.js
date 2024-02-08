const handleImage = (req, res) => {
	const { id } = req.params;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'));
};

module.exports  = {
	handleImage: handleImage
};
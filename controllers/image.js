import {ClarifaiStub, grpc} from 'clarifai-nodejs-grpc';

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key ' + process.env.API_CLARIFAI);

const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
		{
			model_id: 'face-detection',
			inputs: [{data: {image: {url: req.body.input}}}]
		},
		metadata,
        (err, response) => {
            if (err) {
                console.error('Error.');
                return res.status(500).json('Internal Server Error');
            }

            if (response.status.code !== 10000) {
                console.error(`Received failed status: ${response.status.description}\n${response.status.details}`);
                return res.status(400).json('Failed to process image');
            }

            console.log('Predicted concepts, with confidence values:');
            for (const c of response.outputs[0].data.concepts) {
                console.log(`${c.name}: ${c.value}`);
            }

            res.json(response);
        }
	);
};


const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
        .catch(err => {
            console.error('Error getting entries.');
            res.status(500).json('Internal Server Error');
        });
};

export { handleImage, handleApiCall };
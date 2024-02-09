const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + process.env.API_CLARIFAI);

// const Clarifai = require('clarifai');
// console.log(Clarifai);

// const app = new Clarifai.App({
// 	apiKey: '97ef50b5bd4e402d92bfc1b218fd6806'
//   });


const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
		{
			model_id: "face-detection",
			inputs: [{data: {image: {url: req.body.input}}}]
		},
		metadata,
		(err, response) => {
			if (err) {
				console.log("Error: " + err);
				return;
			}

			if (response.status.code !== 10000) {
				console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
				return;
			}

			console.log("Predicted concepts, with confidence values:")
			for (const c of response.outputs[0].data.concepts) {
				console.log(c.name + ": " + c.value);
			}

			res.json(response)
		}
	);

	// app.models
	// 	.predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
	// .then(data => {
	// 	res.json(data);
	// })
	// .catch(err => res.status(400).json('unable to work with API'));
}


const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'));
};

export default { handleImage, handleApiCall };
// module.exports  = {
// 	handleImage: handleImage,
// 	handleApiCall: handleApiCall
// };
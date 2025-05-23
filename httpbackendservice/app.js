const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const fs = require('fs');
const path = require('path');

const port = process.env.APP_PORT || 5000

const backendfood = process.env.backendfood || "potato"

const containerMountPath = "/backendvolume"

const directoryPath = containerMountPath + "/directory3"

app.get('/writebackendfile', (req, res) => {
	const filePath = path.join(directoryPath, 'myfile1.txt');

	fs.writeFile(filePath, "pickled lasagna", function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("myfile1.txt was saved!");
	});

	fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }

		console.log("filepath of myfile1.txt: " + filePath);

    res.set('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.get('/backendpoint', (req, res) => {
    console.log('executing backendpoint method')
	res.send("This is the response from the backendpoint method: " + backendfood);
})

app.get('/', (req, res) => {  
  res.sendStatus(200);
});

app.listen(port, () => console.log(`App listening on port ${port}!`))
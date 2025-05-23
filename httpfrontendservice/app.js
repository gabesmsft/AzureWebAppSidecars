const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const fs = require('fs');
const path = require('path');

const port = process.env.APP_PORT || 4000
const backendPrefix = process.env.backendPrefix || 'localhost'

const food = process.env.food || "cornflakes"

const containerMountPath = "/frontendvolume"

var outboundrequest = require('request');

app.get('/getbackendresponse', async (req, res) => {
    console.log('executing getbackendresponse route via frontend container')
	res.setHeader('Content-Type', 'application/json');
	var backendUrl = "http://" + backendPrefix + ":5000/backendpoint";
	const response = await backendresponse(backendUrl);
	
	res.send(JSON.stringify(response));
	//res.status(200).send()
})

function backendresponse (url) {
    return new Promise((resolve, reject) => {
	    outboundrequest.get(url, (error, response, body) => {
		    if(error) {
			    console.log(error);
				reject(body);
		    }
			else {
				console.log('Response from outbound request to backendpoint method: ' + body);
				resolve(body);
			}
		});
	});
}

app.get('/', (req, res) => {  
  res.send(food);
});

//invokes backend container, which writes a file to its volume mount
app.get('/writebackendfile', async (req, res) => {	
	var backendUrl = "http://" + backendPrefix + ":5000/writebackendfile";	
    const response = await backendresponse(backendUrl);
	res.send(JSON.stringify(response));
})

//reads the file that was written via /writebackendfile. The file will be successfully read only if the volume mount that is used by the backend container is shared with this container.
app.get('/readbackendfile', async (req, res) => {
		
	const filePath = path.join(containerMountPath, 'myfile1.txt');

	fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }

		console.log("filepath of myfile1.txt: " + filePath);

    res.set('Content-Type', 'text/plain'); // Set the correct content type
    res.send(data);
  });
})

//delete the file from the volume (if the file exists). This will reset the test.
app.get('/deletebackendfile', async (req, res) => {
	const filePath = path.join(containerMountPath, 'myfile1.txt');
	
	if (fs.existsSync(filePath)){
		fs.unlinkSync(filePath);
	}
    res.sendStatus(200);
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
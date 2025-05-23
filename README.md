# Azure Web App Sidecars


[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fgabesmsft%2FAzureWebAppSidecars%2Fmaster%2Fdeploy%2Fazuredeploy.json)

This sample Azure Resource Manager template deploys an Azure Web App for Containers with [sidecar containers](https://learn.microsoft.com/azure/app-service/tutorial-custom-container-sidecar).

The Web App has an environment variable named "food" with a value of "home fries".

The following sidecars are deployed:

| Sidecar name | IsMain | Environment variables | Volume sub path 1 | Container mount path 1 |
| ------------ | ------ | --------------------- | ----------------- | ---------------------- |
| frontend | true   | <inherits from Web App> | /directory1/directory2/directory3 | /frontendvolume |
| backend | false   | backendfood: <references the food environment variable> | /directory1/directory2 | /backendvolume |

The backend container has following GET routes:

| Route | Description |
| ----- | ----------- |
| /backendpoint | Returns the value of the backendfood environment variable if present, otherwise returns "potato" in the response |
| /writebackendfile | Writes "pickled lasagna" to a file /backendvolume/directory3/myfile.txt. In effect, this writes to directory3 directory under the /directory1/directory2 volume mount subpath. |

The frontend container has following GET routes:

| Route | Description |
| ----- | ----------- |
| /getbackendresponse | Makes a request to the backend container's /backendpoint route and returns its response value. |
| /writebackendfile | Makes a request to the backend container's /writebackendfile route so that the backend container writes the file to the backend container's volume mount. |
| /readbackendfile | Reads and returns the contents of /frontendvolume/myfile1.txt if it exists, otherwise returns an error reading file. In effect, this reads from the /directory1/directory2/directory3 volume mount subpath. |
| /deletebackendfile | Deletes the file /frontendvolume/myfile1.txt. From the backend container's perspective, this deletes /backendvolume/directory3/myfile.txt. |

To test the application, append the frontend route that you want to test to the end of the Web App's URL.

For example:

https://<WebAppDomainPrefix>.azurewebsites.net/getbackendresponse should return the following response:
"This is the response from the backendpoint method: home fries"

If you delete the environment variable from the backend sidecar, /getbackendresponse should contain "potato" instead of "home fries" in the response.

Note: If backend and frontend had the same volume sub path, then their code would reference the file via the same directory level with respect to each other (e.g. /backendvolume/myfile1.txt and /frontendvolume/myfile1.txt).
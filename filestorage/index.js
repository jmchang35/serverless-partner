const { BlobServiceClient } = require("@azure/storage-blob");
var multipart = require("parse-multipart")


async function upload(req) {

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;

    

    try {
        var parsedBody = multipart.Parse(body, boundary);
        context.log(parsedBody);

        var filetype = parsedBody[0].type;
        if (filetype == "image/png") {
            ext = "png";
        } else if (filetype == "image/jpeg") {
            ext = "jpeg";
        } else {
            username = "invalidimage"
            ext = "";
        }

        var fileName = req.headers['codename'];

        const connectionString = 'DefaultEndpointsProtocol=https;AccountName=serverlessstorageaccount;AccountKey=F4sTMgATmZu078sU5vUm99OTVLSsEq0ytAWOWiF1IaFQSUbTLoagj5lFcGnlabsxuL+Qx7UGw2+D+ASt8JGaGA==;EndpointSuffix=core.windows.net'
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        // Create a unique name for the container
        const containerName = "serverlesspartner";

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create the container
        const blobName = fileName + "." + ext;

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob
        const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
        console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
        const responseMessage = 'uploaded'
        return responseMessage;
    } catch (err) {
        context.log(err)
        context.log("Undefined body image")
        const responseMessage = 'Sorry! No image attached.'
        return responseMessage;
    }



}

async function download(req) {

}


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let output;
    if (req.method == 'POST') {
        output = upload(req);
    }
    else {
        output = download(req);
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: output
    };
}d
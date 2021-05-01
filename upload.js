const AWS = require("aws-sdk")
const uuidv4= require("uuid/v4")
const ENV = require("./env/vars.json")

const s3= new AWS.S3({
    region: "us-east-1",
    accessKeyId: ENV.dev.keys.lambda_upload_get.AWSAccessKeyId,
    secretAccessKey: ENV.dev.keys.lambda_upload_get.AWSSecretAccessKey,
});

const bucket = "s3-demo-c1-as-tm-demo"
const expirationTimeSeconds = 600

function generateUrlSigned(){
    const uuid= uuidv4()
    const bucketKey = "docs/${uuid}"

    const maxSizeInBytes = 5242880;
    const minSizeInBytes = 1;

    const params = {
        Bucket: bucket,
        Expires: expirationTimeSeconds,
        Fields: {
            key: bucketKey,
            acl: "public-read",
        },
        Conditions: [["content-length-range", minSizeInBytes, maxSizeInBytes]],
    }

    return new Promise((resolve, reject) => {
        s3.createPresignedPost(params, (error, result) =>{
            if(error) reject(error)
            else resolve(result)
        })
    })
}

exports.handler = async (event, context, callback) =>{
    const done = (err, code, res) => callback(null, {
        statusCode = code, 
        body: err ? JSON.stringify(err) : JSON.stringify(res),
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    })
    
    const urlSigned = await generateUrlSigned()

    done(null, "200", {
        status: "Success",
        data: urlSigned,
    })
}
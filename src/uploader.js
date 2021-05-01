'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const lambda = new AWS.Lambda({region: "us-east-1"}) // If you use other region change this value
const s3 = new AWS.S3()

const URL_EXPIRATION_SECONDS = 300

// Main Lambda entry point
exports.handler = async (event, context, callback) => {
  return await getUploadURL(event)
}

const getUploadURL = async function(event) {
  const randomID = parseInt(Math.random() * 10000000)
  const filetype = event["queryStringParameters"]["filetype"]
  const Key = randomID+"."+filetype.split("/")[1]

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: filetype,
  }
  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)
  console.log(uploadURL) 
  return JSON.stringify({
    uploadURL: uploadURL,
    Key
  })
}
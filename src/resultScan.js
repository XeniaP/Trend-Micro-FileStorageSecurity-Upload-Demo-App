const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Main Lambda entry point
exports.handler = async (event) => {
    const objectKey = JSON.parse(event.body)["key"]
    let tags, tagQ; //This var is for Storage the tags of object
    console.log("-----INICIO-----")
      try {
        tags = await getObjectTags(process.env.UploadBucket, objectKey);
        tagQ = await getObjectTags(process.env.QuarantineBucket, objectKey);
        if((Object.keys(tags).length>0 || Object.keys(tagQ).length>0) && (tags["fss-scanned"] || tagQ["fss-scanned"])){
          return JSON.stringify(tags)  // return all tags object
        }else{
          var res = {
            "fss-scanned" : false //Return False when can't receive a response
          }
          return res;
        }
      } catch (err) {
        console.error(err);
        console.log(err)
        return;
      }
  };

const getObjectTags = (bucket, objectKey) => new Promise((resolve, reject) => {
  const params = {
    Bucket: bucket,
    Key: objectKey,
  };

  s3.getObjectTagging(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      const tags = {};
      data.TagSet.forEach((tag) => {
        tags[tag.Key] = tag.Value;
      });
      resolve(tags);
    }
  });
});

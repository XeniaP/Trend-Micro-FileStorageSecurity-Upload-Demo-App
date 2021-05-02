const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Main Lambda entry point
exports.handler = async (event) => {
    const params = JSON.parse(event.body)
    const bucket = params["bucket"]
    const objectKey = params["key"]
      let tags;
      console.log("-----INICIO-----")
      try {
        for (let step = 0; step < 100; step++) {
          tags = await getObjectTags(bucket, objectKey);
          if(Object.keys(tags).length>0){
            break;
          }
        }
        console.log(tags)
        if(Object.keys(tags).length>0 && tags["fss-scanned"]){
          console.log(tags)
          return tags
        }else{
          var res = {
            "info" : "We could not get the scan status please check the CloudWatch LogGroup or Cloud One File Storage Security Dashboard",
            "clg" : process.env.CW_LG_FSS,
            "fss-scanned" : false
          }
          return res;
        }
      } catch (err) {
        console.error(err);
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

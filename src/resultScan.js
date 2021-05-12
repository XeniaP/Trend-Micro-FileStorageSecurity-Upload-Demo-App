const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// Main Lambda entry point
exports.handler = async (event) => {
    const objectKey = JSON.parse(event.body)["key"]
    console.log(JSON.parse(event.body)["key"])
    const mainBucket = process.env.UploadBucket
    const quarantineBucket = process.env.QuarantineBucket
    let tagS; //This var is for Storage the tags of object
    console.log("-----INICIO-----")
      try {
        if(getObjectTags(mainBucket, quarantineBucket, objectKey)){
          tagS = await getObjectTags(mainBucket, quarantineBucket, objectKey);
          if((Object.keys(tagS).length>0) && (tagS["fss-scanned"])){
            return JSON.stringify(tagS)  // return all tags object
          }
        }else{
          var res = {
            "fss-scanned" : false //Return False when can't receive a response
          }
          return res;
        }
      } catch (err) {
        console.error(err);
        return;
      }
  };

const getObjectTags = (bucket, quarantine, objectKey) => new Promise((resolve, reject) => {
  
  if(bucket){
    const params = {
      Bucket: bucket,
      Key: objectKey,
    };
    s3.getObjectTagging(params, (err, data) => {
      if (err) {
        console.log("err", params)
        const params2 = {
          Bucket: quarantine,
          Key: objectKey,
        };
        s3.getObjectTagging(params2, (err, data) => {
          if (err) {
            console.log("err", params2)
          }else{
            const tags = {};
            data.TagSet.forEach((tag) => {
              tags[tag.Key] = tag.Value;
            });
            resolve(tags);
          }
        });
      }else{
        const tags = {};
        data.TagSet.forEach((tag) => {
          tags[tag.Key] = tag.Value;
        });
        console.log("tags", tags)
        resolve(tags);
      }
    });
  }
});

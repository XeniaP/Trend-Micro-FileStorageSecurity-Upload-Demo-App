# Serverless-Example-S3-Upload-Interface-for-Demo-of-CloudOne-FileStorage-Security
[Cloud One - File Storage Security Trial -](https://cloudone.trendmicro.com/) 

## Architecture

![Image of Architecture](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/0ff19e2c977edbb19044ca5312512e9777458a37/Img/Architecture.jpeg)

## Guide

1) [Install SAM-CLI -](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) 
2) [Install AWS-CLI -](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
3) [Configure AWS-CLI -](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
4) [Deploy Cloud One File Storage Security - Scanner Stack](https://cloudone.trendmicro.com/docs/file-storage-security/stack-add/#AddScanner).
5) Create and S3 Bucket for Storage code and files- [How-to](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)
6) Clone this repository 
```
git clone https://github.com/XeniaP/Upload-Demo-C1-FSS.git
cd Upload-Demo-C1-FSS
```
7) Copy files to S3 for Storage Code and File, with the next Commands:
```
sam package --template-file Template.yaml --s3-bucket <Bucket-Name-Created-Step-5>
sam package --output-template-file Template.yaml --s3-bucket <Bucket-Name-Created-Step-5>
```
8) Edit this values in samconfig.toml without <>
```
stack_name = <Name-Of-Deployment>
s3_bucket = <Name-Bucket-Created-Step-5>
region = <AWS-Region>
parameter_overrides = "S3BucketToScan=\"<Name-Of-Bucket-To-Scan>\" ExternalID=\"<ExternalID>\" ScannerAWSAccount=\"<AWS-Account-ID>\" ScannerSQSURL=\"<ScannerSQSURL>" AWSRegion=\"<AWS-Region>\" PromoteMode=\"move\" QuarantineMode=\"move\""
```

>**NOTE:** S3BucketToScan It's the name it's for a new S3 Bucket

>**NOTE:** The values for ExternalID, ScannerAWSAccount and ScannerSQSURL you can get from ScannerStack deployed in Step 4

9) Deploy the application:
```
sam deploy --template-file Template.yaml --stack-name <Name-Bucket-Created-Step-5>
```

10) Copy the API-gateway-value in gui/js/index.js [Line 5], you can get the HTTP API endpoint URL from outputs in sam-cli or CloudFormation Stack.
    ![Image of get Api URL](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/f2cab6e7ecc330c3c1b8c0caeb0d4093593db605/Img/api-gateway-value.png)
    ![Image of Configure Value in Index.html](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/f2cab6e7ecc330c3c1b8c0caeb0d4093593db605/Img/api-url-index.html.png)

11) You cannot run this directly on a local browser, you can use [XAMPP](https://www.apachefriends.org/es/index.html), or [deploy using AWS Amplify Console](https://aws.amazon.com/amplify/console/).

12) Configure the Storage in Trend Micro Cloud One 
    > Before you must have the Cloud One File Storage Stack Scanner deployed - [Here you find the guide](https://cloudone.trendmicro.com/docs/file-storage-security/stack-add/#AddScanner).

    In the Cloud One - File Storage Security console, in the Stack Management Menu.
    Select Add Storage and in Step 3: Copy the value of the arn that you can obtain from the SAM-CLI outputs or the AWS Cloud Formation Stack outputs
    
    ![Image of get ARN Value](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/f2cab6e7ecc330c3c1b8c0caeb0d4093593db605/Img/storage-stack-management-role-arn.png)
    ![Image of Add Storage](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/f2cab6e7ecc330c3c1b8c0caeb0d4093593db605/Img/add-storage.png)
    ![Image of Paste ARN](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/f2cab6e7ecc330c3c1b8c0caeb0d4093593db605/Img/copy-arn.png)

13) Use the application

![caption](https://github.com/XeniaP/Upload-Demo-C1-FSS/blob/75fee3a52f78ab270f2e432c5cc725d6e9b42fba/Img/use-app.gif)



## NOTES:
For Delete first Empty de S3 Bucket created in Deploy and Delete de Root Stack and delete storage in Cloud One File Storage

## Contributing
If you encounter a bug, think of a useful feature, or find something confusing in the docs, please create a new issue!
We ❤️ pull requests.


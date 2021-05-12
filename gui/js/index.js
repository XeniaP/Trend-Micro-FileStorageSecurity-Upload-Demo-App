      const MAX_IMAGE_SIZE = 15000000 // 15 MB 

      /* ENTER YOUR ENDPOINT HERE */

      const API_ENDPOINT = '' // e.g. https://ab1234ab123.execute-api.us-east-1.amazonaws.com/uploads
      
      const MIMETypes = ["image/png","text/plain","application/x-zip-compressed","audio/aac","application/x-abiword","application/octet-stream","video/x-msvideo","application/vnd.amazon.ebook","application/octet-stream","application/x-bzip","application/x-bzip2","application/x-csh","text/css","text/csv","application/msword","application/epub+zip","image/gif","text/html","image/x-icon","text/calendar","application/java-archive","image/jpeg","application/javascript","application/json","audio/midi","video/mpeg","application/vnd.apple.installer+xml","application/vnd.oasis.opendocument.presentation","application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.text","audio/ogg","video/ogg","application/ogg","application/pdf","application/vnd.ms-powerpoint","application/x-rar-compressed","application/rtf","application/x-sh","image/svg+xml","application/x-shockwave-flash","application/x-tar","image/tiff","font/ttf","application/vnd.visio","audio/x-wav","audio/webm","video/webm","image/webp","font/woff","font/woff2","application/xhtml+xml","application/vnd.ms-excel","application/xml","application/vnd.mozilla.xul+xml","application/zip","video/3gpp","audio/3gpp","video/3gpp2","audio/3gpp2","application/x-7z-compressed"]
      var FileType = ""
      new Vue({
        el: "#app",
        data: {
          image: '',
          uploadURL: '',
          scanResult: '',
          uploading: '',
          HTMLcontent: '',
          name: '',
          isHidden : false
        },
        methods: {
          onFileChange (e) {
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            this.createImage(files[0])
          },
          createImage (file) {
            this.name = file.name
            let reader = new FileReader()
            
            reader.onload = (e) => {
              MIMETypes.forEach(element => {
                if(e.target.result.includes(element)){
                  FileType = element
                }
              });
              if (!FileType) {
                  return alert('File Extension is not permit')
              }
              if (file.size > MAX_IMAGE_SIZE) {
                return alert('File is loo large.')
              }
              this.image = e.target.result
            }
            reader.readAsDataURL(file)
          },
          removeImage: function (e) {
            console.log('Remove clicked')
            this.image = ''
          },
          uploadImage: async function (e) {
            // Get the presigned URL
            this.uploading = `<div> Uploading file .... </div> `;
            const response = await axios({
              method: 'GET',
              url: API_ENDPOINT+"uploads?filetype="+FileType+"&nameFile="+this.name,
            })
            let binary = atob(this.image.split(',')[1])
            let array = []
            for (var i = 0; i < binary.length; i++) {
              array.push(binary.charCodeAt(i))
            }
            let blobData = new Blob([new Uint8Array(array)], {type: FileType})
            // PUT Object in S3 
            const result = await fetch(response.uploadURL, {
              method: 'PUT',
              body: blobData
            })
            
            // Final URL for the user doesn't need the query string params
            finalURL = response.uploadURL.split('?')[0]
            var url = finalURL.split("/")[2]
            var filename = finalURL.split("/")[3]
            this.uploadURL = finalURL
                
          },
          checkScanResult: async function(e){
            const response2 = await axios({
              method: 'POST',
              url: API_ENDPOINT+"status",
              data: {
                key: this.name
              }
            })
            if(response2["fss-scanned"] == true || response2["fss-scanned"] == "true"){
              this.uploading= ""
              this.HTMLcontent = `</br>
                </br><div>Scanned = ${response2["fss-scanned"]}</div>
                <div>Scan Result = ${response2["fss-scan-result"]}</div>
                <div>Scan Date = ${response2["fss-scan-date"]}</div>`;
                }else{
              this.HTMLcontent = `
                <div>Scanned = ${response2["fss-scanned"]}</div>
                <div>Please Review AWS CloudWatch or File Storage Security Console</div>`;
            }
          }
        }
      })
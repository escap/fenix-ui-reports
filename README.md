# FENIX Reports

```javascript
var Reports = require('fx-reports/start');

var reports = new Reports({
        ...
    });
```

# Configuration
<table>
   <thead>
      <tr>
         <th>Parameter</th>
         <th>Type</th>
         <th>Default Value</th>
         <th>Example</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>format</td>
         <td>string</td>
         <td> - </td>
         <td>"table" || "metadata"</td>
         <td>Export format</td>
      </tr>
      <tr>
         <td>config</td>
         <td>Object</td>
         <td>-</td>
         <td>-</td>
         <td>Check specific format configuration/td>
      </tr>
   </tbody>
</table>

# API

```javascript
//This is an example
reports.on("catalog.show", function () {...});
```

- `reports.on(event, callback[, context])` : pub/sub 
- `reports.export( config )` : export resource

# Events

- `export.start` : export start
- `export.success` : export success
- `export.error` : export error


How to use it
-----------------------------------

Steps to use it:

 1. Create an instance of FenixExport module
 2. Call the ```init``` method on that instance, specifying the plugin that you want to call (for now, it's possible to call only ```tableExport``` and ```metadataExport``` )
 3. Call the  ```export(*** *payload*, *URL*, *successCallback** , *errorCallback** )``` method passing as parameters (the parameters with * are facultative)

```javascript
var fenixExport = new FenixExport;
var payload = {
	"input":{
		"config":{
			"uid":#UID_CHOSEN
		}
	}
};
	
var URL = "localhost:8080"		 
fenixExport.init("metadataExport");
     
fenixExport.export(payload,URL);
```     

## Formats

- `metadata`: export metadata in a PDF file.
- `table`: export table in  an MS Excel file (.xlsx).

## Metadata format configuration

*Set the language:*

```javascript
var payload =  {  
   "input":{  
      "config":{  
         "uid":"#UID_CHOSEN"
      }
   },
   "output":{  
      "config":{  
         "lang":"ES"
      }
   }
};
```

*Set file name*

```javascript
var payload =  {
	"input":  {
		"config":{
			"uid": #UID_CHOSEN
		} 
	},
	"output": {
		"config": {
			"fileName": #fileName.pdf
		}
	}
};
```

## Table format configuration
		 
		 TODO
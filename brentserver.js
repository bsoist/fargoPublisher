//Copyright 2014, Small Picture, Inc.
	//1/19/14 by DW
		//This is a shell for developing the functionality of the Fargo back-end.
		//When done, it will take requests saying that a named outline has updated.
		//It will know how to find the OPML, and from there, to find a "package" of updates.
		//Which it will then parse, and upload to a bucket on S3.
		//Still have a ways to go, but it's fun, and a lot is working! :-)


var AWS = require ("aws-sdk");
var s3 = new AWS.S3 ();
var http = require ('http');

var writeStaticFile = function (path, data, type, acl) {
	var bucketname = "";
	if (type == undefined) {
		type = "text/plain";
		}
	if (acl == undefined) {
		acl = "public-read";
		}
	
	//split path into bucketname and path -- like this: /tmp.scripting.com/testing/one.txt
		if (path.length > 0) {
			if (path [0] == "/") { //delete the slash
				path = path.substr (1); 
				}
			var ix = path.indexOf ("/");
			bucketname = path.substr (0, ix);
			path = path.substr (ix + 1);
			console.log ("Writing to bucket: \"" + bucketname + "\" path: \"" + path + "\"");
			}
	
	var params = {
		ACL: acl,
		ContentType: type,
		Body: data,
		Bucket: bucketname,
		Key: path
		};
	s3.putObject (params, function (err, data) { 
		console.log ("Wrote S3 file: http://" + bucketname + "/" + path);
		});
	}

console.log ("starting server");
var counter = 0;
var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});
	var color = 'blue';
	if (counter % 2 === 1) {
		color = 'no, green';
		}
	response.end(color);
	writeStaticFile ("/tmp.scripting.com/testing/" + counter + ".txt", new Date ().toString ());
	counter++;
	});
server.listen (1337);

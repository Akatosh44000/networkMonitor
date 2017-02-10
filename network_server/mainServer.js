// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // NETWORKS VARIABLE
    networkList=[]
    // configuration =================


    app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.get('/', function(req, res) {
        res.sendfile('./app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    
    app.get('/getNetworksList',function(request,response){
    	response.json({ networks: networkList})
    });
    
    app.post('/networkProbe',function(request,response){
    	 var id=request.body.network_id;
         if(id=='0'){
        	 console.log('NEW NETWORK DETECTED !')
        	 var proposal_id=1;
             var fineID=false;
             while(!fineID){
            	 fineID=true;
            	 for (var i = 0; i < networkList.length; i++) {
         		    if (networkList[i].network_id==proposal_id){
         		    	console.log(networkList[i][0])
         		    	proposal_id++;
         		    	fineID=false;
                        break;
         		    }
         		 }
             }
             var network={"network_id":proposal_id,
            		 		"network_name":request.body.network_name,
            		 		"network_port":0,
            		 		"network_time":(new Date).getTime()};
             networkList.push(network);
             response.end(proposal_id.toString());
         }else{
        	 for (var i = 0; i < networkList.length; i++) {
      		    if (networkList[i].network_id==id){
      		    	networkList[i].network_port=request.body.network_port
      		    	networkList[i].network_time=(new Date).getTime()
      		    }
      		 }
        	 console.log(networkList);
        	 response.end('OK')
         }
	});


    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
    
    
    
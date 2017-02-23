// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var http = require('http');
    var server=http.createServer(app)
    var io = require('socket.io')
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    io = io.listen(server)
    
    // NETWORKS VARIABLE
    networkList=[]
    subscriptions=[]
    
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
    
    app.get('/getNetwork/:id',function(request,response){
    	console.log(networkList[request.params.id-1])
    	response.json({"network" : networkList[request.params.id-1]});
    });

    app.post('/postNetworkMessage',function(request,response){
    	var socket_id=request.body.socket_id
    	var message=request.body.message
    	var socketList = io.sockets.server.eio.clients;
    	if (socketList[socket_id] === undefined){
    		response.json({'response' : 'None'});
    	}else{
    		io.sockets.emit('MESSAGE_FROM_SERVER', {'message':message});
    		response.json({'response' : 'OK'});
    	}
    });

    io.on('connection', function (socket) {
    	socket.on('PROBE_FROM_NETWORK', function (data) {
    		var id=data.network_id;
            if(id=='0'){
             console.log('INFO:: NEW NETWORK DETECTED')
           	 var proposal_id=1;
                var fineID=false;
                while(!fineID){
               	 fineID=true;
               	 for (var i = 0; i < networkList.length; i++) {
            		    if (networkList[i].network_id==proposal_id){
            		    	proposal_id++;
            		    	fineID=false;
                            break;
            		    }
            		 }
                }
                var network={"network_id":proposal_id,
               		 		"network_name":data.network_name,
               		 		"network_socket_id":socket.id,
               		 		"network_status":'on'};
                networkList.push(network);
                socket.emit('PROBE_FROM_SERVER', {'network_id': proposal_id.toString()});
            }
    		socket.broadcast.emit('PROBE_FROM_SERVER', networkList);

		});
		socket.on('disconnect', function() {
			for (var i = 0; i < networkList.length; i++) {
				if(socket.id==networkList[i].network_socket_id){
					console.log('INFO:: NETWORK '+networkList[i].network_id+' DISCONNECT FROM SOCKET '+socket.id);
					networkList[i].network_status='off';
					socket.broadcast.emit('PROBE_FROM_SERVER', networkList);
				}else{
					console.log('INFO:: USER DISCONNECT FROM SOCKET '+socket.id);
				}
			}
		});
		socket.on('MESSAGE_FROM_NETWORK', function (data) {
			console.log('RECEIVED MESSAGE FROM NETWORK ' + data.message);
			for (var i = 0; i < subscriptions.length; i++) {
				if(subscriptions[i][1]==socket.id){
					socket.broadcast.to(subscriptions[i][0]).emit('MESSAGE_FROM_NETWORK', data.message)
				}
			}
		});
		socket.on('MESSAGE_FROM_NETWORK_TO_CLIENT', function (data) {
			console.log('RECEIVED MESSAGE FROM NETWORK ' + data.message + ' TO CLIENT ' + data.client_socket_id);
			socket.broadcast.to(data.client_socket_id).emit('MESSAGE_FROM_NETWORK_TO_CLIENT', data.message)
		});
		socket.on('REQUEST_FROM_CLIENT_TO_NETWORK', function (data) {
			console.log('RECEIVED REQUEST '+data.request.name+' FROM CLIENT '+socket.id+' TO NETWORK '+data.network_socket_id)
			socket.broadcast.to(data.network_socket_id).emit('REQUEST_FROM_CLIENT_TO_NETWORK', 
					{'client_socket_id':socket.id,'name':data.request.name,'params':{}});
		});
		socket.on('REQUEST_FROM_CLIENT_TO_SERVER', function (data) {
			console.log('RECEIVED REQUEST '+data.request.name+' FROM CLIENT '+socket.id)
			if(data.request.name=='subscribeToNetwork'){
				for (var i = 0; i < subscriptions.length; i++) {
					if(subscriptions[i][0]==socket.id && subscriptions[i][1]==data.request.params.network_socket_id){
						console.log('CLIENT '+socket.id+' ALREADY SUBSCRIBED TO '+data.request.params.network_socket_id)
						return 
					}
				}
				subscriptions.push([socket.id,data.request.params.network_socket_id])
				console.log('CLIENT '+socket.id+' SUBSCRIBED TO '+data.request.params.network_socket_id)
			}
			else if(data.request.name=='unsubscribeFromNetwork'){
				for (var i = 0; i < subscriptions.length; i++) {
					if(subscriptions[i][0]==socket.id && subscriptions[i][1]==data.request.params.network_socket_id){
						subscriptions.splice(i,1);
						console.log('CLIENT '+socket.id+' UNSUBSCRIBED FROM '+data.request.params.network_socket_id)
						return 
					}
				}
			}
		});
    });

    // listen (start app with node server.js) ======================================
    server.listen(8080);
    console.log("App listening on port 8080");
    
    
    
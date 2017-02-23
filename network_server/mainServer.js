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
    var path = require('path');
    io = io.listen(server)
    
    // NETWORKS VARIABLE
    networkList=[]
    subscriptions=[]
    
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.get('/', function(req, res) {
        res.sendfile('public/views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
   
    io.on('connection', function (socket) {
    	socket.on('REQUEST_FROM_NETWORK_TO_SERVER', function (request) {
    		if(request.name=='getNewId'){
    			var id=request.params.network_id;
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
                   		 		"network_name":request.params.network_name,
                   		 		"network_socket_id":socket.id,
                   		 		"network_status":'on'};
                    networkList.push(network);
                    socket.emit('MESSAGE_FROM_SERVER_TO_NETWORK', {'network_id': proposal_id.toString()});
                }
				socket.broadcast.emit('MESSAGE_FROM_SERVER_TO_CLIENT',
						{'name':'networksList','data':{'networksList':networkList}});

    		}
		});
		socket.on('disconnect', function() {
			for (var i = 0; i < networkList.length; i++) {
				if(socket.id==networkList[i].network_socket_id){
					console.log('INFO:: NETWORK '+networkList[i].network_id+' DISCONNECT FROM SOCKET '+socket.id);
					networkList[i].network_status='off';
					socket.broadcast.emit('MESSAGE_FROM_SERVER_TO_CLIENT',
							{'name':'networksList','data':{'networksList':networkList}});
					for (var j = 0; j < subscriptions.length; j++) {
						if(subscriptions[j][1]==socket.id){
							console.log(networkList[i])
							socket.broadcast.to(subscriptions[j][0]).emit('MESSAGE_FROM_SERVER_TO_CLIENT',
									{'name':'networkInfoWithId','data':{'networkInfoWithId':networkList[i]}});
						}
					}
					return

				}else{
					console.log('INFO:: USER DISCONNECT FROM SOCKET '+socket.id);
				}
			}
		});
		socket.on('MESSAGE_FROM_NETWORK_TO_SERVER', function (message) {
			console.log('INFO:: RECEIVED MESSAGE FROM NETWORK ' + socket.id + ' TO SERVER');
			for (var i = 0; i < subscriptions.length; i++) {
				if(subscriptions[i][1]==socket.id){
					socket.broadcast.to(subscriptions[i][0]).emit('MESSAGE_FROM_NETWORK', message)
				}
			}
		});
		socket.on('MESSAGE_FROM_NETWORK_TO_CLIENT', function (message) {
			console.log('INFO:: RECEIVED MESSAGE FROM NETWORK ' + socket.id + ' TO CLIENT ' + message.client_socket_id);
			socket.broadcast.to(message.client_socket_id).emit('MESSAGE_FROM_NETWORK_TO_CLIENT', message)
		});
		socket.on('REQUEST_FROM_CLIENT_TO_NETWORK', function (request) {
			console.log('INFO:: RECEIVED REQUEST '+request.name+' FROM CLIENT '+socket.id+' TO NETWORK '+request.network_socket_id)
			socket.broadcast.to(request.network_socket_id).emit('REQUEST_FROM_CLIENT_TO_NETWORK', 
					{'client_socket_id':socket.id,'name':request.name,'params':{}});
		});
		socket.on('REQUEST_FROM_CLIENT_TO_SERVER', function (request) {
			console.log('INFO:: RECEIVED REQUEST '+request.name+' FROM CLIENT '+socket.id)
			if(request.name=='subscribeToNetwork'){
				for (var i = 0; i < subscriptions.length; i++) {
					if(subscriptions[i][0]==socket.id && subscriptions[i][1]==request.params.network_socket_id){
						console.log('WARNING:: CLIENT '+socket.id+' ALREADY SUBSCRIBED TO '+request.params.network_socket_id)
						return 
					}
				}
				subscriptions.push([socket.id,request.params.network_socket_id])
				console.log('SUCCESS:: CLIENT '+socket.id+' SUBSCRIBED TO '+request.params.network_socket_id)
			}
			else if(request.name=='unsubscribeFromNetwork'){
				for (var i = 0; i < subscriptions.length; i++) {
					if(subscriptions[i][0]==socket.id && subscriptions[i][1]==request.params.network_socket_id){
						subscriptions.splice(i,1);
						console.log('SUCCESS:: CLIENT '+socket.id+' UNSUBSCRIBED FROM '+request.params.network_socket_id)
						return 
					}
				}
			}
			else if(request.name=='getNetworksList'){
				socket.emit('MESSAGE_FROM_SERVER_TO_CLIENT',
						{'name':'networksList','data':{'networksList':networkList}});
			}
			else if(request.name=='getNetworkInfoWithId'){
				for(var i = 0; i < networkList.length; i++) {
					if(networkList[i].network_id==request.params.network_id){
						socket.emit('MESSAGE_FROM_SERVER_TO_CLIENT',
								{'name':'networkInfoWithId','data':{'networkInfoWithId':networkList[i]}});
						return
					}
				}
				
			}
		});
    });

    // listen (start app with node server.js) ======================================
    server.listen(8080);
    console.log("App listening on port 8080");
    
    
    
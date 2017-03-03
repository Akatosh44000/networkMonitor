angular.module('networkServerApp').service('parametersParsing',function() {
	this.filterParameters=function(parameters){
		 res=[]
		 listOfParameters=parameters.split(',')
		 for(var i=0;i<listOfParameters.length;i++){
			 if(listOfParameters[i].length>0){
				 parameter=listOfParameters[i].split(':');
				 if(parameter.length==2){
					 if(parameter[0].length>0 && parameter[1].length>0){
						 if(!isNaN(parseInt(parameter[0])) && isFinite(parameter[0])){
							 if(!isNaN(parseInt(parameter[1])) && isFinite(parameter[1])){
								 if (parseInt(parameter[0]) < parseInt(parameter[1])){
									 res.push(parameter[0]+':'+parameter[1])
								 }
							 }
						 }
					 }
				 }else if(parameter.length>=1){
					 if(!isNaN(parseFloat(parameter[0])) && isFinite(parameter[0])){
						 res.push(parameter[0]);
					 }
				 }
			 }
		 }
		 return res
	}
	this.treatAsImages=function(dataO){
		images=[]
		 console.log(dataO.length)
		 for(var k=0;k<dataO.length;k++){
	   	 data=dataO[k][1]
			 max=parseFloat(Math.max(...data))
			 min=parseFloat(Math.abs(Math.min(...data)))
			 for(var i=0;i<data.length;i++){
				 data[i]=Math.floor(((parseFloat(data[i])+min)/(max+min))*255);
				 if(data[i] >= 0 && data[i] <= 255){
				    var n = (255 - data[i]).toString(16);
				    data[i]="#" + n + n + n;
				 }
			 }
	   	 image=[]
	   	 var size=Math.sqrt(data.length)
	   	 for(var i=0;i<size;i++){
	   		 row={}
	   		 col=[]
	       	 for(var j=0;j<size;j++){
	       		 col.push(data[i*size+j])
	       	 }
	   		 row.columns=col
	   		 image.push(row)
	   	 }
	   	 images.push(image)
		 }
		return images

	}
	
});
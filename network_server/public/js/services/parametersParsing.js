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
	this.filterPipeline=function(parameter){
		if(!isNaN(parseInt(parameter)) && isFinite(parameter)){
			res=parameter
		}else{
			res=''
		}
		return res
	}
	this.treatAsImages=function(dataO){
		images=[]
		 for(var k=0;k<dataO.length;k++){
			 data=dataO[k][1]
	   	 images.push(data)
		 }
		return images

	};
	this.filterArchitecture=function(params){
		newParams=[];
		typesCount={'CONV':0,'FC':0,'POOL':0};
		for(var i=0;i<params.length;i++){
			newParam={}
			if(params[i][0]=='CONV'){
				typesCount.CONV++;
				newParam.name='CONV #'+typesCount.CONV
				newParam.imageChoice='true';
				newParam.explorable='true';
				newParam.shape=params[i][1]
			}else if(params[i][0]=='FC'){
				typesCount.FC++;
				newParam.name='FC #'+typesCount.FC
				newParam.imageChoice='false';
				newParam.explorable='true';
				newParam.shape=params[i][1]
			}else if(params[i][0]=='POOL'){
				typesCount.POOL++;
				newParam.name='POOLING #'+typesCount.POOL
				newParam.imageChoice='true';
				newParam.explorable='false';
				newParam.shape=0;
			}else if(params[i][0]=='INPUT'){
				newParam.name='INPUT'
				newParam.imageChoice='true';
				newParam.explorable='false';
				newParam.shape=params[i][1];
			}else{
				newParam.name='UNKNOWN';
				newParam.imageChoice='false';
				newParam.explorable='false';
				newParam.shape=0;
			}
			
			newParams.push(newParam)
		}
		return newParams
	};
	
});
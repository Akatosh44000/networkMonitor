angular.module('networkServerApp').controller('imageController', 
		function($scope,$element,parametersParsing) {
		var canvas = $element[0];
		
		img=$scope.image
		var context = canvas.getContext('2d');
		var size=Math.sqrt($scope.image.length)
		if($scope.sub.architecture.imageChoice=='true'){
			canvas.height=50;
			scale=Math.floor(50/size)+1
			var imgData = context.createImageData(size*scale,size*scale);
			var col=[]
			for (var i = 0; i < size; i += 1) {
				line=[]
				for (var j = 0; j < size; j += 1) {
					for(var s=0;s<scale;s+=1){
						line.push(img[i*size+j])
					}
				}
				for(var s=0;s<scale;s+=1){
					col.push(line)
				}
			}
			img=[]
			for (var i = 0; i < size*scale; i += 1) {
				for (var j = 0; j < size*scale; j += 1) {
					img.push(col[i][j])
				}
			}
			for (var i = 0; i < size*scale*size*scale*4; i += 4) {
			    imgData.data[i] = img[i/4];
			    imgData.data[i+1] = img[i/4];
			    imgData.data[i+2] = img[i/4];
			    imgData.data[i+3] = 255;
			}
			context.putImageData(imgData,0,0);
			
		}else{
			canvas.height=10;
			
			size=$scope.image.length
			
			scale=3
			canvas.width=size*scale;
			var imgData = context.createImageData(size*scale,10);
			var col=[]
			var line=[]
			for (var j = 0; j < size; j += 1) {
				for(var s=0;s<scale;s+=1){
					line.push(img[j])
				}
			}
			for(var s=0;s<10;s+=1){
				col.push(line)
			}
			
			img=[]
			for (var i = 0; i < 10; i += 1) {
				for (var j = 0; j < size*scale; j += 1) {
					img.push(col[i][j])
				}
			}
			for (var i = 0; i < size*scale*10*4; i += 4) {
			    imgData.data[i] = img[i/4];
			    imgData.data[i+1] = img[i/4];
			    imgData.data[i+2] = img[i/4];
			    imgData.data[i+3] = 255;
			}
			context.putImageData(imgData,0,0);
		}
	    
		

		
});
angular.module('networkServerApp').service('graphService',function() {

		var graphService = function(id) {
			this.setChart(id);
			this.dataset=[]
		};
		
		graphService.prototype.setChart=function(id){
			this.chart={"palette": "1",
			        "caption": "LAYER #"+id+" VIEWER",
			        "yaxisname": "Value",
			        "xaxisname": "weight #",
			        "xaxisminvalue": "0",
			        "setAdaptiveYMin":"True",
			        "setAdaptiveYMax":"True"}
		};
		graphService.prototype.getChart=function(){
			return {"chart":this.chart,"dataset": this.dataset};
		};
		graphService.prototype.pushDataset=function(name,color){
			this.dataset.push({"drawline": "1",
	            "seriesname": name,
	            "color": color,
	            "anchorsides": "2",
	            "anchorradius": "1",
	            "anchorbgcolor": color,
	            "anchorbordercolor": '000000',
		        "data": []})
		};
		graphService.prototype.setData=function(data){
			var colorList=['FF0000','800000','FFFF00','808000','00FF00','008000','00FFFF','008080','0000FF','000080','FF00FF','800080']
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					this.pushDataset((data[i][0]).toString(),colorList[i])
					newData=[]
					for(var j=0;j<data[i][1].length;j++){
						newData.push({'x': j,'y':data[i][1][j]});
					}
					this.dataset[i].data=newData;
				}
			}

		}
		
		return graphService

});
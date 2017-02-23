angular.module('networkServerApp').service('graphService',function() {

		var graphService = function(params,numberOfValues) {
			createChart=function(params){
				return 	{"palette": "2",
			        "caption": "Network weights visualization",
			        "yaxisname": "Value",
			        "xaxisname": "weight #",
			        "xaxisminvalue": "0",
			        "setAdaptiveYMin":"True",
			        "setAdaptiveYMax":"True"}
			}
			createCategories=function(numberOfValues){
		        return {"category":[{"label": "Jan"},{"label": "Feb"},{"label": "Mar"},{"label": "Apr"},{"label": "May"}]}
			}
			createDataset=function(data){
				return {"drawline": "1",
		            "seriesname": "Server 1",
		            "color": "009900",
		            "anchorsides": "3",
		            "anchorradius": "4",
		            "anchorbgcolor": "D5FFD5",
		            "anchorbordercolor": "009900",
			        "data": []}
			}
			this.chart=createChart();
			this.categories=createCategories();
			this.dataset=createDataset();
		};
	
		graphService.prototype.getChart=function(){
			return {"chart":this.chart,"dataset": [this.dataset]};
		}
		
		graphService.prototype.setData=function(data){
			newData=[]
			for(var i=0;i<data.length;i++){
				newData.push({'x': i,'y':data[i]});
			}
			this.dataset.data=newData;
		}
		
		return graphService

});
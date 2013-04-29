var Polygon = function Polygon(pL){
	this.pointList = pL;
	this.type = "Polygon";
	this.gMap = new google.maps.Polygon({
		map: parent.map,
		strokeWeight: "1.0",
		fillColor: "#222222",
		fillOpacity: 0.4
	});
	this.gMap.setPaths(this.pointList);
	this.gMap.setMap(parent.map);

}
Polygon.prototype = {
	addPoint: function addPoint(){

	},
	initialize: function initialize(){
		google.maps.event.addListener(this.gMap,"mouseover",function(){
			this.setOptions({fillColor: "#999999"});
		});
		google.maps.event.addListener(this.gMap,"mouseout",function(){
			this.setOptions({fillColor: "#222222"});
		});

	},
	getName: function getName(){
		return this.name;
	},
}
var MultiPolygon = function MultiPolygon(pA){
	this.pointArray = pA;
	this.type = "MultiPolygon";
	this.gMap = new google.maps.Polygon({
		map: parent.map,
		strokeWeight: "1.0",
		fillColor: "#222222",
		fillOpacity: 0.4
	});
	this.gMap.setPaths(this.pointArray);
	this.gMap.setMap(parent.map);
}
MultiPolygon.prototype = {
	addPolygon: function addPolygon(points){
		var poly = new Polygon(points);
		this.polyArray.push(poly);
	},
	signalPolygons: function signalPolygons(signal){
		$.each(this.polyArray, function(i, v){
			signal(i);
		});
	},
	initialize: function initialize(){
		var that=this;
	}
}
var MapTools = function MapTools(mn) {
	this.features = new Array();
	this.map = mn;
}
MapTools.prototype = {
	addPolygon: function addPolygon(points){
		var poly = new Polygon(points);
		poly.initialize();
		this.features.push(poly);
	},
	addMultiPolygon: function addMultiPolygon(pointArray){
		var mpoly = new MultiPolygon(pointArray);
		mpoly.initialize();
		this.features.push(mpoly);
	},
	startPolygon: function startPolygon(){

	},
	closePolygon: function closePolygon(){

        },
	readGeoJSON: function readGeoJSON(fileName){
		var that=this;
		$.ajax({
  		url: fileName,
  		dataType: 'json',
  		async: false,
			success: function(geoJSON) {
				for (var f = 0; f < geoJSON.features.length; f++){
					var fT = geoJSON.features[f].geometry.type;
					if (fT == "Polygon"){
						var cL = [];
						for (var i = 0; i < geoJSON.features[f].geometry.coordinates[0].length; i++){
							var myLatLng = new google.maps.LatLng(geoJSON.features[f].geometry.coordinates[0][i][1], geoJSON.features[f].geometry.coordinates[0][i][0]);
							cL.push(myLatLng);
						}
						that.addPolygon(cL);
					}
					if (fT == "MultiPolygon"){
						var pA = []; //Path Array
						for (var i = 0; i < geoJSON.features[f].geometry.coordinates.length; i++){
							var cL = [];
							for (var j = 0; j < geoJSON.features[f].geometry.coordinates[i][0].length; j++){
								var myLatLng = new google.maps.LatLng(geoJSON.features[f].geometry.coordinates[i][0][j][1], geoJSON.features[f].geometry.coordinates[i][0][j][0]);
								cL.push(myLatLng);
							}
							pA.push(cL);
						}
						that.addMultiPolygon(pA);
					}
				}
			}
		});
	}
}

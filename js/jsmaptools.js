var Polygon = function Polygon(pL, props){
	this.pointList = pL;
	this.type = "Polygon";
	this.p = new L.Polygon(pL, {weight: '1.0', color: '#000', opacity: '0.9'}).addTo(parent.map);
	this.p.on('mouseover', function(){ this.setStyle({fillColor: '#ff0066'})});
	this.p.on('mouseout', function(){ this.setStyle({fillColor: ''})});
	this.properties = props;
}
Polygon.prototype = {
	addPoint: function addPoint(){

	},
	initialize: function initialize(){

	},
	getName: function getName(){
		return this.name;
	},
}
var MultiPolygon = function MultiPolygon(pA, props){
	this.pointArray = pA;
	this.type = "MultiPolygon";
	this.p = new L.MultiPolygon(pA, {weight: '1.0', color: '#000'}).addTo(parent.map);
	this.p.on('mouseover', function(){ this.setStyle({fillColor: '#cc3399'})});
	this.p.on('mouseout', function(){ this.setStyle({fillColor: ''})});
	this.properties = props;
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
	addPolygon: function addPolygon(points, propArray){
		var poly = new Polygon(points, propArray);
		poly.initialize();
		this.features.push(poly);
	},
	addMultiPolygon: function addMultiPolygon(pointArray, propArray){
		var mpoly = new MultiPolygon(pointArray, propArray);
		mpoly.initialize();
		this.features.push(mpoly);
	},
	startPolygon: function startPolygon(){

	},
	closePolygon: function closePolygon(){

        },
	applyChoropleth: function applyChoropleth(prop, lowcolor, highcolor){
		var min;
		var max;
		var min_r = parseInt(lowcolor.substring(1,3), 16);
		var max_r = parseInt(highcolor.substring(1,3), 16);
		var min_g = parseInt(lowcolor.substring(3,5), 16);
		var max_g = parseInt(highcolor.substring(3,5), 16);
		var min_b = parseInt(lowcolor.substring(5,7), 16);
		var max_b = parseInt(highcolor.substring(5,7), 16);
		$.each(this.features, function(i,v){
			var pv = eval("v.properties." + prop);
			if (i == 0){
				min = pv;
				max = pv;
			} else {
				if (pv < min){
					min = pv;
				}
				if (pv > max){
                                        max = pv;
                                }
			}
		});
		//min = 5;
		//max = 8;
		var diff = max - min;
		var scale_r = 1 / (diff) * (max_r - min_r);
		var scale_g = 1 / (diff) * (max_g - min_g);
		var scale_b = 1 / (diff) * (max_b - min_b);
		$.each(this.features, function(i,v){
			var pv = eval("v.properties." + prop);
			/*
			if (pv < min){ 
				var c_r = min_r.toString(16);
				var c_g = min_g.toString(16);
				var c_b = min_b.toString(16);
			} else if (pv > max){
				var c_r = max_r.toString(16);
				var c_g = max_g.toString(16);
				var c_b = max_b.toString(16);
			} else {
			*/
			if (scale_r < 0){
				var c_r = Math.round(max_r - (max - pv) * scale_r).toString(16);
			} else {
				var c_r = Math.round((pv - min) * scale_r + min_r).toString(16); 
			}
			if (scale_g < 0){
				var c_g = Math.round(max_g - (max - pv) * scale_g).toString(16);
			} else {
				var c_g = Math.round((pv - min) * scale_g + min_g).toString(16);
			}
			if (scale_b < 0){
				var c_b = Math.round(max_b - (max - pv) * scale_b).toString(16);
			} else {
				var c_b = Math.round((pv - min) * scale_b + min_b).toString(16);
			}
			//}
			if (c_r.length < 2){ c_r = "0" + c_r; }
			if (c_g.length < 2){ c_g = "0" + c_g; }
			if (c_b.length < 2){ c_b = "0" + c_b; }
			var colorString = eval("'#" + c_r + c_g + c_b + "'");
			v.p.setStyle({ fillColor: colorString, fillOpacity: '1.00', color: '#ffffff' });
			v.p.on('mouseout', function(){ this.setStyle({fillColor:  colorString})});
		});
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
							var myLatLng = new L.LatLng(geoJSON.features[f].geometry.coordinates[0][i][1], geoJSON.features[f].geometry.coordinates[0][i][0]);
							cL.push(myLatLng);
						}
						that.addPolygon(cL, geoJSON.features[f].properties);
					}
					if (fT == "MultiPolygon"){
						var pA = []; //Path Array
						for (var i = 0; i < geoJSON.features[f].geometry.coordinates.length; i++){
							var cL = [];
							for (var j = 0; j < geoJSON.features[f].geometry.coordinates[i][0].length; j++){
								var myLatLng = new L.LatLng(geoJSON.features[f].geometry.coordinates[i][0][j][1], geoJSON.features[f].geometry.coordinates[i][0][j][0]);
								cL.push(myLatLng);
							}
							pA.push(cL);
						}
						that.addMultiPolygon(pA, geoJSON.features[f].properties);
					}
				}
			}
		});
	}
}

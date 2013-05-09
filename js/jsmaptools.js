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
		var min_r = parseInt(lowcolor[1] + lowcolor[2], 16);
		var max_r = parseInt(highcolor[1] + highcolor[2], 16);
		var min_g = parseInt(lowcolor[3] + lowcolor[4], 16);
		var max_g = parseInt(highcolor[3] + highcolor[4], 16);
		var min_b = parseInt(lowcolor[5] + lowcolor[6], 16);
		var max_b = parseInt(highcolor[5] + highcolor[6], 16);

		$.each(this.features, function(i,v){
			if (i == 0){
				min = eval("v.properties." + prop);
				max = eval("v.properties." + prop);
			} else {
				if (eval("v.properties." + prop) < min){
					min = eval("v.properties." + prop);
				}
				if (eval("v.properties." + prop) > max){
                                        max = eval("v.properties." + prop);
                                }
			}
		});
		var diff = max - min;
		var scale_r = 1 / (diff) * (max_r - min_r);
		var scale_g = 1 / (diff) * (max_g - min_g);
		var scale_b = 1 / (diff) * (max_b - min_b);
		$.each(this.features, function(i,v){
			var c_r = Math.round(eval("v.properties." + prop) * scale_r + min_r).toString(16);
			var c_g = Math.round(eval("v.properties." + prop) * scale_g + min_g).toString(16);
			var c_b = Math.round(eval("v.properties." + prop) * scale_b + min_b).toString(16);
			if (c_r.length < 2){ c_r = "0" + c_r; }
			if (c_g.length < 2){ c_g = "0" + c_g; }
			if (c_b.length < 2){ c_b = "0" + c_b; }
			var colorString = eval("'#" + c_r + c_g + c_b + "'");
			v.p.setStyle({ fillColor: colorString });
			v.p.setStyle({ fillOpacity: '1.00' });
			v.p.setStyle({ color: '#ffffff' });
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

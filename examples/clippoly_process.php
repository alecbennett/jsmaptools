<?php
	var_dump($_POST);
	$max = count($_POST['Shape']);
	$mainString = '{ "type": "FeatureCollection", "features": [ { "type": "Feature",';
	$mainString .= ' "geometry": { ';
	$mainString .= '"type": "Polygon", "coordinates": [ [';
	$mainString .= ' [ '.$_POST['Shape'][0]['Point'].' ]';
	for ($i = 1; $i < $max; $i++){
		$mainString .= ', [ '.$_POST['Shape'][$i]['Point'].' ]';
	}
	$mainString .= ' ] ] }, "properties": { "prop0": "value0" } } ] }';
	file_put_contents ( md5($_SERVER['REMOTE_ADDR']).".json" , $mainString );
	system("./clipwarp.sh ".md5($_SERVER['REMOTE_ADDR']));
/*
	GeoJSON
	{ "type": "Polygon",
	  "coordinates": [
	    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
	    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
	    ]
	 }
*/
?>

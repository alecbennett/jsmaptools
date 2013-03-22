<?php
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
	$sysout = "";
	system("./clipwarp.sh ".md5($_SERVER['REMOTE_ADDR'])." 2&>/dev/null", $sysout);

	echo md5($_SERVER['REMOTE_ADDR']).".tif";
?>

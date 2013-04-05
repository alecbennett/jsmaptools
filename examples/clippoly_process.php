<?php
	$max = count($_POST['Shape']);
	$mainString = '{ "type": "FeatureCollection", "features": [ { "type": "Feature",';
	$mainString .= '"properties": { "prop0": "value0" },';
	$mainString .= '"id": 0,';
	$mainString .= ' "geometry": { ';
	$mainString .= '"type": "Polygon", "coordinates": [ [';
	$mainString .= ' [ '.$_POST['Shape'][0]['Point'].' ]';
	for ($i = 1; $i < $max; $i++){
		$mainString .= ', [ '.$_POST['Shape'][$i]['Point'].' ]';
	}
	$mainString .= ' ] ] } } ] }';
	$fileName = md5($SERVER['REMOTE_ADDR'].time());
	file_put_contents ( "output/".$fileName.".json" , $mainString );
	$sysout = "";
	$layerName = $_POST['layerName'];
	system("./clipwarp.sh ".$fileName." ".$layerName." 2&>/dev/null", $sysout);
	echo $fileName.".tif";
?>

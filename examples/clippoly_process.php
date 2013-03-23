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
	$fileName = md5($SERVER['REMOTE_ADDR'].time());
	file_put_contents ( "output/".$fileName.".json" , $mainString );
	$sysout = "";
	system("./clipwarp.sh ".$fileName." 2&>/dev/null", $sysout);
	echo $fileName.".tif";
?>

<?php

 ?>
<html>
	<head>
		<link rel="stylesheet" href="../css/style.css">
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"> </script>
		<script  src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
		<script type="text/javascript" src="../js/maps.js"></script>

		<script type="text/javascript">

			function sendData() {
				var validPoints = false;
				if (rectangle){
					var shapeList = '{ "Shape": [';
					shapeList += ' { "Point": "' + marker_list[0].getPosition().lng() + ', ' + marker_list[0].getPosition().lat() +  '" },';
					shapeList += ' { "Point": "' + marker_list[0].getPosition().lng() + ', ' + marker_list[1].getPosition().lat() +  '" },';
					shapeList += ' { "Point": "' + marker_list[1].getPosition().lng() + ', ' + marker_list[1].getPosition().lat() +  '" },';
					shapeList += ' { "Point": "' + marker_list[1].getPosition().lng() + ', ' + marker_list[0].getPosition().lat() +  '" }';
					shapeList += '] }';
					shapeList = $.parseJSON( shapeList ); 
					validPoints = true;
				} else if(polygon && marker_list.length >= 3){
					var shapeList = '{ "Shape": [';
					shapeList += ' { "Point": "' + marker_list[0].getPosition().lng() + ', ' + marker_list[0].getPosition().lat() +  '" }';
					for (var i = 1; i < marker_list.length; i++){
						shapeList += ', { "Point": "' + marker_list[i].getPosition().lng() + ', ' + marker_list[i].getPosition().lat() + '" }';
					}
					shapeList += '] }';
					shapeList = $.parseJSON( shapeList ); 
					validPoints = true;
               		    	} else {
					alert("Not enough points selected.");
				}
				if (validPoints){
					$.ajax({
						url: 'clippoly_process.php',
						type: 'POST',
						data: shapeList,
						success: function(msg){ 
							$('#downloadLink').html('<a href="output/' + msg + '">Download File</a>'); 
							$('#downloadLink').show();
							$('#downloadBox').hide();
							$('#downloadBox').html('');
						},
						error: function(a,b,c){ console.log(a); console.log(b); console.log(c); }
					});
					$('#downloadBox').html("loading...");
				};
			}
		</script>
	</head>
	<body>
		<div id="main_body">
			<div id="main_content">
				<script type="text/javascript">
					google.maps.event.addDomListener(window, 'load', init);
					setPointLayer("pointDisplay");

				</script>	


				<div id="map_wrapper" style="position: relative; border: 1px solid black; padding: 3px;">
					<div id="map_canvas" style="margin: auto; width: 992px; height: 600px; position: relative;"></div>

				</div>
				<div id="controls" style="margin-top: 20px; border: 1px solid black; padding: 5px;";>
					<div class="mapbutton" id="drawPoly">Draw Polygon</div>
					<div class="mapbutton" id="drawRectangle">Draw Rectangle</div>
					<div class="mapbutton" id="postPoly" style="background-color: pink;">Save Map</div>
					<div id="downloadBox" style="display: inline-block;"></div><div class="mapbutton" style="display: none;" id="downloadLink"></div>
				</div>
					<div id="pointDisplay" style="border: 1px solid black; padding: 5px; margin-top: 10px;">No Points Selected</div>
			</div>
		</div>
	</body>
					<script type="text/javascript">
						$("#drawPoly").click( function(){ drawPolygon(); $('#downloadLink').hide(); });
						$("#drawRectangle").click( function(){ drawRectangle(); $('#downloadLink').hide(); });
						$("#postPoly").click( function(){ sendData(); });
					</script>
</html>

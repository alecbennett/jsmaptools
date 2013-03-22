<?php

 ?>
<html>
	<head>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"> </script>
		<script  src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
		<script type="text/javascript" src="../js/maps.js"></script>

		<script type="text/javascript">

			function sendData() {
				if (marker_list.length > 0){
					var shapeList = '{ "Shape": [';
					shapeList += ' { "Point": "' + marker_list[0].getPosition().lng() + ', ' + marker_list[0].getPosition().lat() +  '" }';
					for (var i = 1; i < marker_list.length; i++){
						shapeList += ', { "Point": "' + marker_list[i].getPosition().lng() + ', ' + marker_list[i].getPosition().lat() + '" }';
					}
					shapeList += '] }';
					//alert(shapeList);	
					//var shapeList2 = $.parseJSON( shapeList ); 
					shapeList = $.parseJSON( shapeList ); 
               		    	}

			    $.ajax({
					url: 'clippoly_process.php',
					type: 'POST',
					//data: { "People": [ {"Name": "Bob"}, {"Name": "John"} ] },
					data: shapeList,
					success: function(){  },
					error: function(a,b,c){ console.log(a); console.log(b); console.log(c); }
			    });
			};
		</script>
	</head>
	<body>
		<div id="main_body">
			<div id="main_content">
				<script type="text/javascript">
					google.maps.event.addDomListener(window, 'load', init);
					setPointLayer("pointDisplay");

				</script>	

				<div id="controls">
					<input type="button" onclick="javascript:drawPoly();" value="Draw Polygon" />
					<input type="button" onclick="javascript:drawRectangle();" value="Draw Rectangle" />
					<input type="button" id="postPoly" />

				</div>
				<div id="map_wrapper" style="position: relative;">
					<div id="map_canvas" style="height: 600px; position: relative;"></div>
					<div id="pointDisplay"></div>
				</div>
			</div>
		</div>
	</body>
					<script type="text/javascript">
						$("#postPoly").click( function(){ 
							sendData(); 
						});
					</script>
</html>

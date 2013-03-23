#!/bin/bash

JOBID=$1
OUTDIR=output
PREFIX="output/$1"

rm ${PREFIX}.tif
ogr2ogr -f "ESRI Shapefile" -t_srs EPSG:3338 ${PREFIX}.shp ${PREFIX}.json
gdalwarp -dstnodata 255 -co COMPRESS=DEFLATE -co TILED=YES -of GTiff -r lanczos -crop_to_cutline -cutline ${PREFIX}.shp NALCMS.tif ${PREFIX}.tif
#rm ${PREFIX}.json ${PREFIX}.shp ${PREFIX}.shx  ${PREFIX}.dbf  ${PREFIX}.prj

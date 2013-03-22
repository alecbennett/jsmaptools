#!/bin/bash

JOBID=$1;

rm ${JOBID}.tif
ogr2ogr -f "ESRI Shapefile" -t_srs EPSG:3338 ${JOBID}.shp ${JOBID}.json
gdalwarp -dstnodata 255 -co COMPRESS=DEFLATE -co TILED=YES -of GTiff -r lanczos -crop_to_cutline -cutline ${JOBID}.shp /home/apbennett/NALCMS.tif ${JOBID}.tif
rm ${JOBID}.json ${JOBID}.shp ${JOBID}.shx  ${JOBID}.dbf  ${JOBID}.prj

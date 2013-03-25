#!/bin/bash

JOBID=$1
OUTDIR=output
PREFIX="output/$1"

rm ${PREFIX}.tif
gdalwarp -dstnodata 255 -co COMPRESS=DEFLATE -co TILED=YES -of GTiff -r lanczos -crop_to_cutline -cutline ${PREFIX}.json NALCMS.tif ${PREFIX}.tif
#rm ${PREFIX}.json 

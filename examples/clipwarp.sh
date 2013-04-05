#!/bin/bash

JOBID=$1
OUTDIR=output
PREFIX="output/$1"

FILENAME=$2
wget tiles.snap.uaf.edu/maps/${FILENAME}.tif -O output/$FILENAME.tif

rm ${PREFIX}.tif
gdalwarp -dstnodata 255 -co COMPRESS=DEFLATE -co TILED=YES -of GTiff -crop_to_cutline -cutline ${PREFIX}.json output/$FILENAME.tif ${PREFIX}.tif
#rm ${PREFIX}.json 
rm $FILENAME

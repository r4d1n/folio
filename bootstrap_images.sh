#!/bin/bash

set -e

FILES=static/img/*.jpg
for f in $FILES
do
  convert $f -resize "750>" $f
  jpegoptim --size=250k $f
  exiftool -all= $f
  name="$(cut -d'/' -f3 <<< $f)"
  hugo new image/${name/jpg/md}
done

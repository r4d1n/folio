FILES=static/img/*.jpg
for f in $FILES
do
  name="$(cut -d'/' -f3 <<< $f)"
  echo "${name/jpg/md}"
  hugo new image/${name/jpg/md}
done

#!/bin/bash

names=(absent done inwork question discard frozen bury warning burning idea future)
colors=(FF9090 A0FFC0 F8F860 C0C0C0 C0C0C0 C0C0C0 C0C0C0 FFB060 FF9090 E8E8C0 E0F0FF)

for i in ${!names[@]}
do
echo -n "\".make_plan .mark.${names[$i]}:before  {   background-color: #${colors[$i]};  background-image: url('data:image/png;base64,";  base64 --wrap 0 image/${names[$i]}.png;  echo "');  } \" +";
done
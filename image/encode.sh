#!/usr/bin/env bash
cd "$(dirname "$0")"

names=(bullet detail absent done inwork question discard frozen bury warning burning idea future)
colors=(FFFFFF FFFFFF FF9090 A0FFC0 F8F860 C0C0C0 C0C0C0 C0C0C0 C0C0C0 FFB060 FF9090 E8E8C0 E0F0FF)

for i in ${!names[@]}
do
classname=.${names[$i]}
if [ $classname = .bullet ]; then
classname=
fi
echo -n "CSSSelector+\" .mark$classname:before  {   background-color: #${colors[$i]};  background-image: url('data:image/png;base64,";  base64 --wrap 0 ${names[$i]}.png;  echo "');  } \" +";
done
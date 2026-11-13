#!/bin/bash
# fal125_cmp.sh: balance check. Puts each fighter in the SAME team and compares clear rate and average wave.
# USAGE (from the project folder): tools/fal125_cmp.sh GAME.html "other,team,members" WORLD(1-8) LEVEL DIFF RUNS key1 key2 ...
# Example: tools/fal125_cmp.sh fal125_battle_prototype-v258.html "cy,inkating,shamoon" 5 1 Hard 60 marrowline demure
H=$1; O=$2; W=$3; L=$4; D=$5; R=$6; shift 6
DIR="$(cd "$(dirname "$0")" && pwd)"
lab(){ timeout 280 node "$DIR/fal125_lab.js" --html "$H" --party $1,$O --world $W --level $L --diff $D --runs $R --seed 5 2>&1 | grep "clears" | sed "s/^/$1: /"; }
while [ $# -gt 0 ]; do lab $1 & [ -n "$2" ] && lab $2 & wait; shift; shift; done 2>/dev/null

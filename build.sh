#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist

mkdir data
cp ../data/export.csv ./data/

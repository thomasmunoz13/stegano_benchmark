#!/bin/bash

# Repository url
URL=$(cat url.txt)

echo "-> Cloning base repository ..."

git clone $URL &> /dev/null

# Temporary
cd private
git checkout benchmarks
cd ../

echo "-> Building dissimulation ..."
cd private/dissimulation
./build.sh &> /dev/null

echo "-> Building revelation ..."

cd ../revelation
./build.sh &> /dev/null

echo "-> Downloading dataset ..."
cd ../..
git clone https://github.com/mosser/steganography-dataset &> /dev/null


for directory in $(ls -d steganography-dataset/raw/*/)
do
    for image in $(ls $directory/*.jpg)
    do   
        echo "$image"
    done
done

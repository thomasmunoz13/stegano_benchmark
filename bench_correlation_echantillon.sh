#!/bin/bash

# Repository url
PROJECT_URL=$(cat url.txt)
DATASET_URL=https://github.com/mosser/steganography-dataset 
REVELATION="$(pwd)/private/revelation"
DISSIMULATION="$(pwd)/private/dissimulation"
LOG_FILE="$(pwd)/logs.json"

# $1 : attribute
# $2 : value
# $3 : file
# $4 : if last
function write_json_attribute()
{
    if [[ $1 == "correlation" ]]
    then
        echo "\"$1\" : \"$2\"" >> $3  
    else
        echo "\"$1\" : \"$2\"," >> $3  

    fi

}

# Execute total bench for one image
# $1 : image
# $2 : log_file
# $3 : dataset location
# $4 : dissimulation directory
# $5 : revelation directory
function execute_bench()
{
    correlation[0]="template"
    correlation[1]="histogram"

    ########### DISSIMULATION ##########
    for b in 1 2 3 4 5 6 7 8
    do
        for file in $(ls $3/*)
        do
            for c in "${correlation[@]}"
            do
                cd $4

                before=$(date +%s%3N) 

                ./dissimulate -in $1 -msg $file -metrics $c -b $b &> temp123.txt 2> /dev/null

                if [[ $? -eq 0 ]]
                then
                    after=$(date +%s%3N)

                    echo "{ $(echo "")" >> $LOG_FILE
                    
                    write_json_attribute "image" $image $LOG_FILE
                    write_json_attribute "type" "dissimulation" $LOG_FILE
                    write_json_attribute "time" $((after-before)) $LOG_FILE
                    write_json_attribute "bitnumber" $b $LOG_FILE
                    echo "\"message\" : \"$file\"" >> $LOG_FILE
                    echo "\"output\" : \"$(cat temp123.txt)\"" >> $LOG_FILE
                    write_json_attribute "correlation" $c $LOG_FILE

                    echo "}," >> $LOG_FILE  
                fi
                ########### DISSIMULATION #########
            done
        done
    done
}


echo "-> Cloning base repository ..."

git clone $PROJECT_URL &> /dev/null 2> /dev/null

# Temporary
cd private
git checkout benchmarks &> /dev/null 2> /dev/null
cd ../

echo "-> Building dissimulation ..."
cd private/dissimulation
./build.sh 1 &> /dev/null 2> /dev/null

echo "-> Building revelation ..."

cd ../revelation
./build.sh &> /dev/null 2> /dev/null

echo "-> Downloading dataset ..."
cd ../..

git clone $DATASET_URL &> /dev/null 2> /dev/null

DATASET_LOCATION="$(pwd)/echantillons_image"

echo "-> Creating log files ..."

touch $LOG_FILE
echo "var results = [" > $LOG_FILE

echo "-> Scanning dataset files ..."

for image in $(ls $DATASET_LOCATION/*.jpg)
do   
    echo "--> Working on $image ..."
    execute_bench $image $LOG_FILE $DATASET_LOCATION $DISSIMULATION $REVELATION

done

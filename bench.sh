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
    if [[ $1 == "message" ]]
    then
        echo "\" $1 \" : \" $2 \"" >> $3  
    else
        echo "\" $1 \" : \" $2 \"," >> $3  

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
    RESULT_IMAGE="$4/result.png"

    channels[0]="Red,Green,Blue"
    channels[1]="Red"
    channels[2]="Green"
    channels[3]="Blue"
    channels[4]="Red,Green"
    channels[5]="Red,Blue"
    channels[6]="Green,Blue"
    channels[7]="Blue,Green"
    channels[8]="Blue,Red"
    channels[9]="Green,Red"
    channels[10]="Blue,Green,Red"
    channels[11]="Green,Blue,Red"
    channels[12]="Green,Red,Blue"

    for i in 1 2 3 4 5 6 7 8
    do
        for f in $(ls $3/txt/*.txt)
        do
            for c in "${channels[@]}"
            do
                ########### DISSIMULATION ##########
                cd $4

                before=$(date +%s%3N) 

                ./dissimulate -in $1 -magic FFFFFFFF -msg $f -b $i -c $c &> /dev/null

                if [[ $? -eq 0 ]]
                then
                    after=$(date +%s%3N)

                    echo "{ $(echo "")" >> $LOG_FILE

                    write_json_attribute "image" $image $LOG_FILE
                    write_json_attribute "type" "dissimulation" $LOG_FILE
                    write_json_attribute "time" $((after-before)) $LOG_FILE
                    write_json_attribute "bitnumber" $i $LOG_FILE
                    write_json_attribute "channel" $c $LOG_FILE
                    write_json_attribute "message" "file: $f" $LOG_FILE

                    echo "}," >> $LOG_FILE  
                fi

                ########### DISSIMULATION #########
                ########### REVELATION ############
                cd $5 

                before=$(date +%s%3N)   

                ./reveal -in $RESULT_IMAGE -magic FFFFFFFF -b $i -c $c &> /dev/null

                if [[ $? -eq 0 ]] 
                then
                    after=$(date +%s%3N)

                    echo "{ $(echo "")" >> $LOG_FILE

                    write_json_attribute "image" $image $LOG_FILE
                    write_json_attribute "type" "revelation" $LOG_FILE
                    write_json_attribute "time" $((after-before)) $LOG_FILE
                    write_json_attribute "bitnumber" $i $LOG_FILE
                    write_json_attribute "channel" $c $LOG_FILE
                    write_json_attribute "message" "file: $f" $LOG_FILE

                    echo "}," >> $LOG_FILE
                fi

                ########### REVELATION ############
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

DATASET_LOCATION="$(pwd)/steganography-dataset/"

echo "-> Creating log files ..."

touch $LOG_FILE
echo "var results = [" > $LOG_FILE

echo "-> Scanning dataset files ..."

for directory in $(ls -d $DATASET_LOCATION/raw/*/)
do
    for image in $(ls $directory/*.jpg)
    do   
        echo "--> Working on $image ..."
        execute_bench $image $LOG_FILE $DATASET_LOCATION $DISSIMULATION $REVELATION

    done

    cd $DATASET_LOCATION 
done

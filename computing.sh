#!/bin/bash

# $1 : first file
# $2 : second file
# $3 : destination
function uniting_files()
{
    echo "$(cat $1) $(echo "") $(cat $2)" > $3
}

# $1 : name of the program to check
function command_exist()
{
    type "$1" &> /dev/null
}


if [ $# -ne 3 ]
then
    echo "Illegal number of argument !"
    echo "Usage : ./computing.sh log_file analyze_file result_file"
else
    LOG_FILE=$1
    ANALYZE_FILE=$2
    RESULT_FILE=$3

    uniting_files $1 $2 $3
    
    if command_exist node 
    then
        node $3 
    else
        echo "Error : node is not installed on your computer"
    fi

    rm $3
fi

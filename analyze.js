
var stats = [];


function existIn(array, attribute, value, imageName){
    for(var i = 0; i < array.length; ++i){
        if(array[i][attribute] == value && array[i].image == imageName){
            return i;
        }
    }
    return -1;
};



function computeBitNumbers(results){

    var stats = {
        "dissimulation" : [], 
        "revelation" : []
    };

    results.forEach(function(elem){
        var current = stats[elem.type]
        var currentIndex = existIn(current, "bitnumber", elem.bitnumber, elem.image);
       
        if(currentIndex != -1){
            current[currentIndex].times.push(elem.time);   
        } else {
            current.push({
                "image" : elem.image, 
                "bitnumber" : elem.bitnumber, 
                "times" : [elem.time]
            });
        }
    });
  
    return stats;
};


function computeChannels(results){

};


function computeMessage(results){

};

function displayResults(results){
    console.log("--> Dissimulation");
    
    results.dissimulation.forEach(function(elem){
        console.log(elem);
    });

    console.log("--> Revelation");

    results.dissimulation.forEach(function(elem){
        console.log(elem);
    });
};

displayResults(computeBitNumbers(results));

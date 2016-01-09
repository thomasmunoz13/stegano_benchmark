
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
    var stats = {
        "dissimulation" : [], 
        "revelation" : []
    };

    results.forEach(function(elem){
        var current = stats[elem.type]
        var currentIndex = existIn(current, "channel", elem.channel, elem.image);
       
        if(currentIndex != -1){
            current[currentIndex].times.push(elem.time);   
        } else {
            current.push({
                "image" : elem.image, 
                "channel" : elem.channel, 
                "times" : [elem.time]
            });
        }
    });
  
    return stats;
};


function computeMessage(results){
    var stats = {
        "dissimulation" : [], 
        "revelation" : []
    };

    results.forEach(function(elem){
        var current = stats[elem.type]
        var currentIndex = existIn(current, "message", elem.message, elem.image);
       
        if(currentIndex != -1){
            current[currentIndex].times.push(elem.time);   
        } else {
            current.push({
                "image" : elem.image, 
                "message" : elem.message, 
                "times" : [elem.time]
            });
        }
    });
  
    return stats;

};


function computeImageSize(results){
    var stats = {
        "dissimulation" : [], 
        "revelation" : []
    };

    results.forEach(function(elem){
        var current = stats[elem.type]
        var currentIndex = existIn(current, "image", elem.image, elem.image);
       
        if(currentIndex != -1){
            current[currentIndex].times.push(elem.time);   
        } else {
            current.push({
                "image" : elem.image, 
                "times" : [elem.time]
            });
        }
    });
  
    return stats;


};

function incrementalAverage(previous, current, index){
    return ((parseInt(current) - parseInt(previous)) / (parseInt(index) + 1)) + parseInt(previous);
};

function averageBitNumber(results){
    var dissimulation = results.dissimulation; 
    var revelation = results.revelation;

    var bitresult = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var bitcount = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    dissimulation.forEach(function(elem, index){
        for(var i = 0; i < elem.times.length; ++i){
            bitcount[elem.bitnumber]++;
            bitresult[elem.bitnumber] = incrementalAverage(bitresult[elem.bitnumber], elem.times[i], bitcount[elem.bitnumber]); 
        }
    });

    console.log("Dissimulation");
    
    for(var i = 1; i < bitresult.length; ++i){
        console.log("[" + i + ", " + bitresult[i] + "],");
    }
 
    bitresult = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    bitcount = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    revelation.forEach(function(elem, index){
        for(var i = 0; i < elem.times.length; ++i){
            bitcount[elem.bitnumber]++;
            bitresult[elem.bitnumber] = incrementalAverage(bitresult[elem.bitnumber], elem.times[i], bitcount[elem.bitnumber]); 
        }
    });

    console.log("Revelation");
    
    for(var i = 1; i < bitresult.length; ++i){ 
        console.log("[" + i + ", " + bitresult[i] + "],");
    }
};


function findChannelIndex(channels, channel){

    for(var i = 0; i < channels.length; ++i){
        if(channels[i] == channel){
           return i; 
        }
    }

    return -1;
};


function averageChannels(results){
    var dissimulation = results.dissimulation; 
    var revelation = results.revelation;
    
    var channels = []; 
    var channelAverage = [];
    var channelCount = [];

    dissimulation.forEach(function(elem){
        for(var i = 0; i < elem.times.length; ++i){
            var index = findChannelIndex(channels, elem.channel);
            
            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(elem.channel);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
    });

    console.log("Dissimulation");
    
    for(var i = 0; i < channels.length; ++i){
        console.log("['" + channels[i] + "', " + channelAverage[i] + "],");
    }
 
   
    channels = [];
    channelAverage = [];
    channelCount = []; 

    revelation.forEach(function(elem){
        for(var i = 0; i < elem.times.length; ++i){
            var index = findChannelIndex(channels, elem.channel);

            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(elem.channel);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
    });

    console.log("Revelation");

    for(var i = 0; i < channels.length; ++i){
        console.log("['" + channels[i] + "', " + channelAverage[i] + "],");
    }
};

function averageMessage(results){
    var dissimulation = results.dissimulation; 
    var revelation = results.revelation;
    
    var channels = []; 
    var channelAverage = [];
    var channelCount = [];

    dissimulation.forEach(function(elem){
        for(var i = 0; i < elem.times.length; ++i){
            var parsedMessage = elem.message.split("/");
            parsedMessage = parsedMessage[parsedMessage.length - 1].trim();

            var index = findChannelIndex(channels, parsedMessage);
            
            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(parsedMessage);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
    });

    console.log("Dissimulation");
    
    for(var i = 0; i < channels.length; ++i){
        console.log("['" + channels[i] + "', " + channelAverage[i] + "],");
    }
 
   
    channels = [];
    channelAverage = [];
    channelCount = []; 

    revelation.forEach(function(elem){
         for(var i = 0; i < elem.times.length; ++i){
            var parsedMessage = elem.message.split("/");
            parsedMessage = parsedMessage[parsedMessage.length - 1].trim();

            var index = findChannelIndex(channels, parsedMessage);
            
            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(parsedMessage);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
     });

    console.log("Revelation");

    for(var i = 0; i < channels.length; ++i){
        console.log("['" + channels[i] + "', " + channelAverage[i] + "],");
    }

};

function averageImage(results){
    var dissimulation = results.dissimulation; 
    var revelation = results.revelation;
    
    var channels = []; 
    var channelAverage = [];
    var channelCount = [];

    dissimulation.forEach(function(elem){
        for(var i = 0; i < elem.times.length; ++i){
            var parsedMessage = elem.image.split("/");
            parsedMessage = parsedMessage[parsedMessage.length - 1].split('.')[0].trim().split('_');
            parsedMessage = parsedMessage[parsedMessage.length - 1];          
            parsedMessage = parseInt(parsedMessage.split('x')[0]) * parseInt(parsedMessage.split('x')[1]);

            var index = findChannelIndex(channels, parsedMessage);
            
            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(parsedMessage);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
    });

    console.log("Dissimulation");
    
    var temp = [];

    for(var i = 0; i < channels.length; ++i){
        temp.push([channelAverage[i], channels[i]]);
    }

    temp.sort(function(a, b){
        return a[1] - b[1];
    });


    for(var i = 0; i < temp.length; ++i){
        console.log("[" + temp[i][1] + ", " + temp[i][0] + "],");
    }


   
    channels = [];
    channelAverage = [];
    channelCount = []; 

    revelation.forEach(function(elem){
         for(var i = 0; i < elem.times.length; ++i){
            var parsedMessage = elem.image.split("/");
            parsedMessage = parsedMessage[parsedMessage.length - 1].split('.')[0].trim().split('_');
            parsedMessage = parsedMessage[parsedMessage.length - 1];          
            parsedMessage = parseInt(parsedMessage.split('x')[0]) * parseInt(parsedMessage.split('x')[1]);

          
            var index = findChannelIndex(channels, parsedMessage);
            
            if(index > -1){
                channelCount[index]++;
                channelAverage[index] = incrementalAverage(channelAverage[index], elem.times[i], channelCount[index]);
            } else {
                channels.push(parsedMessage);
                channelAverage.push(elem.times[i]);
                channelCount.push(0);
            }
       }
     });

    console.log("Revelation");
    
    temp = [];

    for(var i = 0; i < channels.length; ++i){
        temp.push([channelAverage[i], channels[i]]);
    }

    temp.sort(function(a, b){
        return a[1] - b[1];
    });


    for(var i = 0; i < temp.length; ++i){
        console.log("[" + temp[i][1] + ", " + temp[i][0] + "],");
    }


};


function displayResults(results){
    results.dissimulation.forEach(function(elem){
        console.log(elem);
        console.log(",");
    });

    results.dissimulation.forEach(function(elem){
        console.log(elem);
        console.log(",");
    });
};

//var bitresults = computeBitNumbers(results);
//averageBitNumber(bitresults);


//var channelResults = computeChannels(results);
//averageChannels(channelResults);

//var messageResults = computeMessage(results);
//averageMessage(messageResults);

var imageResults = computeImageSize(results);
averageImage(imageResults);

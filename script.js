const DATA = require('./DATASET.js');
const episodes = DATA._embedded.episodes;


///////////
// Task A
///////////


// console.log(episodes);

let summaryWordCounts = {};

for (let i = 0; i < episodes.length; i++) {
  //  strip <p> tags, regular expression from stack overflow.
  let summary = episodes[i].summary.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
  // but this regex i wrote :)
  let stripPunctuation = summary.replace(/[.,:;"]/g, "")
  let splitSummary = stripPunctuation.split(' ');

  //todo: better way to do this than nested for loop?  Do Task B Here also?
  for (let j = 0; j < splitSummary.length; j++) {
    let word = splitSummary[j].toLowerCase();
    if (summaryWordCounts[word] === undefined){
      summaryWordCounts[word] = 1
    } else {
      summaryWordCounts[word]++;
    }
  }
}

// sort the keys in an array
let sorted = Object.keys(summaryWordCounts).sort((a,b) => {
  return summaryWordCounts[b] - summaryWordCounts[a]
});

//grab the values for the first five words in the array
let fiveMostCommon = {}
for (i = 0; i < 5; i++){
  fiveMostCommon[sorted[i]] = summaryWordCounts[sorted[i]]
}

console.log('Task A: ', fiveMostCommon);




/////////////////
// Task B
/////////////////


let firstEpisodeDustinMentioned;

//this could be done almost verbatim on line 15
for (i = 0; i<episodes.length; i++) {
  if(episodes[i].summary.includes('Dustin')) {
    console.log('dustin found!')
    firstEpisodeDustinMentioned = episodes[i].id;
    break;
  }
}

console.log('Task B: ', firstEpisodeDustinMentioned);



//////////////
// Task C
///////////////

let reformattedJsonBlob = {
  "show_01": {

  }
}

// Total Duration
let runtimeArray = episodes.map((episode)=> episode.runtime);
let totalRuntime = runtimeArray.reduce((total, current)=> {
  return total + current
})

reformattedJsonBlob.show_01["totalDurationSec"] = totalRuntime * 60;

// Average Episodes Per season
let episodeCount = episodes.length;

// this makes an assumption that the episodes are in order, refactor opportunity
let seasonCount = episodes[episodeCount-1].season;
let episodesPerSeason = Math.round((episodeCount / seasonCount) *10)/10;
reformattedJsonBlob.show_01["averageEpisodesPerSeason"] = episodesPerSeason;

// episodes

let reformattedEpisodesObject = {}

for (var i = 0; i< episodes.length; i++){
  reformattedEpisodesObject[episodes[i].id] = {
    sequenceNumber: 'S' +episodes[i].season + 'E' + episodes[i].number,
    shortTitle: episodes[i].name.split(':')[1],
    airTimestamp: new Date(episodes[i].airstamp).getTime() / 1000,
    // same regex from above to strip <p> tag
    shortSummary: episodes[i].summary.split('.')[0].replace(/(<p[^>]+?>|<p>|<\/p>)/img, "")
  }
}

reformattedJsonBlob['episodes'] = reformattedEpisodesObject;

console.log(reformattedJsonBlob);

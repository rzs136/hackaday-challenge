var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xhr2');


/* GET project listing. */
router.get('/:id', function (req, res, next) {

  console.log("Project id: " + req.params['id']);
  urlId = req.params['id'];

  console.log("urlid: " + urlId);
  console.log("GETTING: " + 'http://api.hackaday.io/v1/projects/' + urlId + '?api_key=TSUB8Y5RVeZbZSru');
  //projectRequest.open('get', 'http://api.hackaday.io/v1/projects/1340?api_key=TSUB8Y5RVeZbZSru');
  projectRequest.open('get', 'http://api.hackaday.io/v1/projects/' + urlId + '?api_key=TSUB8Y5RVeZbZSru', true);
  projectRequest.send();

  allProjectRequest.open('get', 'http://api.hackaday.io/v1/projects?api_key=TSUB8Y5RVeZbZSru', true);
  allProjectRequest.send();


  loadProject.then(() => {
    loadAll.then(() => {
      //recommend().then(() => {
      //recommended(projTag, allData).then(() => {
      res.render('project', {
        title: 'Express',
        display: `<div>${Object.values(projData)}</div>`,
        //display: 'need to fix',
        //display: `<div>${projValues}</div>`,
        projects: `<div>${uniqueProjects}</div>`
      });
    }).catch(console.error);
    //}).catch(console.error);
  }).catch(console.error);

});



var resolvedFlag = true;
var urlId = null;
let projectRequest = new XMLHttpRequest();
let allProjectRequest = new XMLHttpRequest();

var projData = null;
var allData = null;

var projTag = [];
//var allTags = [];
var recommendedProjects = [];
var uniqueProjects = [];
var done = true;

const loadProject = new Promise((resolve, reject) => {

  projTag = [];
  projData = [];
  projTag.length = 0;
  projData.length = 0;
  projTag.splice(0, projTag.length);
  projData.splice(0, projData.length);

  projectRequest.onload = function () {
    projData = JSON.parse(projectRequest.response);
    if (projectRequest.status == 200) {
      console.log("Project metadata available");
      //console.log(projData);
      console.log("Tag: " + projData.tags[0]);
      for (var i = 0; i < projData.tags.length; i++) {
        projTag.push(projData.tags[i]);
      };
      console.log("Tag array: " + projTag);
      resolve("Resolved");
      //show(projData);
    } else {
      console.log('Bad project request ' + `error ${projectRequest.status} ${projectRequest.statusText}`);
      reject("Reject");
    }
  }
})



const loadAll = new Promise((resolve, reject) => {
  allProjectRequest.onload = function () {
    allData = JSON.parse(allProjectRequest.response);
    if (allProjectRequest.status == 200) {
      console.log("All projects available");
      //console.log(allData);
      console.log("All Projects tag 1: " + allData.projects[0].tags[0]);
      //recommended(projTag, allData);
      //showRecommended(recommendedProjects);

      recommended(projTag, allData).then((res) => {
        console.log(`The recommended function recieved with value ${res}`);

      }).catch((error) => {
        console.log(`Handling error as we received ${error}`);
      });

      resolve("Resolved");

    } else {
      console.log(`error ${allProjectRequest.status} ${allProjectRequest.statusText}`);
      reject("Reject");
    }
  }
})


/*let recommend =*/ function recommended(projTag, allData) {

  recommendedProjects = [];
  uniqueProjects = [];
  recommendedProjects.length = 0;
  uniqueProjects.length = 0;
  recommendedProjects.splice(0, recommendedProjects.length);
  uniqueProjects.splice(0, uniqueProjects.length);

  console.log("inside recommended function call");
  for (var i = 0; i < projTag.length; i++) {
    for (var j = 0; j < allData.projects.length; j++) {
      var allTags = [];
      //allTags.push(allData.projects[j].tags[j]);
      for (var l = 0; l < allData.projects[j].tags.length; l++) {
        allTags.push(allData.projects[j].tags[l]);
      }
      for (var k = 0; k < allTags.length; k++) {
        if (projTag[i] == allTags[k]) {
          console.log("Function Project Tag: " + projTag[i]);
          console.log("Function Matching Tag: " + allTags[k]);
          console.log("Original project " + projData.name + " tag matches project " + allData.projects[j].name);
          recommendedProjects.push(allData.projects[j].name);
        } else {
          console.log("No matching tags");
        }
      }
    }
  }
  console.log("Final array: " + recommendedProjects);
  console.log("Recommended function finished");
  uniqueProjects = recommendedProjects.filter((c, index) => {
    return recommendedProjects.indexOf(c) === index;
  })

  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        console.log("Inside the promise of recommended function");
        if (resolvedFlag == true) {
          resolve("Resolved");
        } else {
          reject("Rejected")
        }
      }, 2000
    );
  });
}


module.exports = router;



/*const recommend = new Promise((resolve, reject) => {

  recommended(projTag, allData);

  function recommended(projTag, allData) {
    //recommendedProjects = [];
    console.log("inside recommended function call");
    for (var i = 0; i < projTag.length; i++) {
      for (var j = 0; j < allData.projects.length; j++) {
        var allTags = [];
        //allTags.push(allData.projects[j].tags[j]);
        for (var l = 0; l < allData.projects[j].tags.length; l++) {
          allTags.push(allData.projects[j].tags[l]);
        }
        for (var k = 0; k < allTags.length; k++) {
          if (projTag[i] == allTags[k]) {
            console.log("Function Project Tag: " + projTag[i]);
            console.log("Function Matching Tag: " + allTags[k]);
            console.log("Original project " + projData.name + " tag matches project " + allData.projects[j].name);
            recommendedProjects.push(allData.projects[j].name);
          } else {
            console.log("No matching tags");
          }
        }
      }
    }
    console.log("Final array: " + recommendedProjects);
    console.log("Recommended function finished");
    uniqueProjects = recommendedProjects.filter((c, index) => {
      return recommendedProjects.indexOf(c) === index;
    })
    if(done){
      resolve("Resolved");
    } else {
      reject("Reject");
    }
  }
})*/

var express = require('express');
var router = express.Router();
var XMLHttpRequest = require('xhr2');
var page = "";

/* GET home page. */
router.get('/', function (req, res, next) {
  //console.log("Current page: " + req.params['page']);
  //page = req.params['page'];
  //let { page } = req.query;

  loadOwner.then(() => {
    loadAll.then(() => {

      res.render('index', {
        title: 'Express',
        grid: gridOutput,
        totalPageNumber: numberOfPages
        //grid: listArray.slice(trimStart, trimEnd).join(' ')
      });
    }).catch(console.error);
  }).catch(console.error);
});

/* GET pagination pages. */
/*router.get('/:page', function (req, res, next) {
  console.log("current page: ", req.params['page']);
  res.render('index', {
    title: 'Express',
    //grid: listArray.slice(trimStart, trimEnd).join(' ')
  });
});*/


var numberOfPages = 0;
var gridOutput = "";

const listArray = [];

let xhr = new XMLHttpRequest();
var data = null;
var allProjects = [];

xhr.open('get', 'http://api.hackaday.io/v1/projects?api_key=TSUB8Y5RVeZbZSru', true);
xhr.send();

const loadAll = new Promise((resolve, reject) => {
  xhr.onload = function () {
    data = JSON.parse(xhr.response);
    if (xhr.status == 200) {
      console.log(data);

      allProjects = data.projects;

      console.log("Projects: ");
      console.log(allProjects);
      console.log("Project 1: ");
      console.log(allProjects[0]);
      console.log("Project 1 id: ");
      console.log(allProjects[0].id);

      myPromise().then((res) => {
        console.log(`The function recieved with value ${res}`);
        console.log("Project Grid IDs: " + projId);
      }).catch((error) => {
        console.log(`Handling error as we received ${error}`);
      });

      //show(data);
      resolve("resolved");
    }
    else {
      console.log(`error ${xhr.status} ${xhr.statusText}`);
      reject("rejected");
    }
  };

})


let ownerRequest = new XMLHttpRequest();
var metadata = null;
var ownerData = [];
var ownerName = null;
var ownerMeta = [];
var resolvedFlag = true;
var projId = [];


ownerRequest.open('get', 'http://api.hackaday.io/v1/users?api_key=TSUB8Y5RVeZbZSru', true)
ownerRequest.send();


const loadOwner = new Promise((resolve, reject) => {
  ownerRequest.onload = function () {
    metadata = JSON.parse(ownerRequest.response);
    if (ownerRequest.status == 200) {
      console.log("Owner metadata available");
      console.log(metadata);
      ownerData = metadata.users;
      console.log("Owner array: ")
      console.log(ownerData);
      ownerName = ownerData[0].username;
      console.log("First owner screen name:");
      console.log(ownerName);
      resolve("Resolved");
    } else {
      console.log(`error ${ownerRequest.status} ${ownerRequest.statusText}`);
      reject("Reject");
    }
  }
})


let myPromise = function show(data) {
  let cardArray = [];
  for (var i = 0; i < allProjects.length; i++) {
    for (var j = 0; j < ownerData.length; j++) {
      if (allProjects[i].owner_id == ownerData[j].id) {
        //ownerName = ownerData[j].username;
        ownerName = ownerData[j].screen_name;
        ownerMeta = Object.values(ownerData[j]);
        //console.log('CHECK: ' + Object.values(ownerData[j]));
        break;
      } else {
        ownerName = null;
        ownerMeta = null;
      }
    }

    cardArray[i] =
      `<a href="project/${allProjects[i].id}" onClick="window.location.reload();">
        <img src="${allProjects[i].image_url}" alt="Avatar" style="width:100%">
          <div class="container">
           <h4><b>${allProjects[i].name}</b></h4>
           <p class="tooltip">${ownerName}
            <span class="tooltiptext">${ownerMeta}</span>
           </p>
           <p>${allProjects[i].summary}</p>
        </div>
       </a>`;

  }


  //const listArray = [];
  for (var i = 0; i < allProjects.length; i++) {
    listArray.push(`<div id="grid-item" onclick="window.location.reload();">${cardArray[i]}</div>`);
    projId.push(allProjects[i].id);
  }

  console.log("projIds: " + projId);


  const numberOfItems = listArray.length
  const numberPerPage = 9
  const currentPage = 1
  numberOfPages = Math.ceil(numberOfItems / numberPerPage)

  const trimStart = (currentPage - 1) * numberPerPage
  const trimEnd = trimStart + numberPerPage
  console.log("Pagination list: ")
  console.log(listArray.slice(trimStart, trimEnd))


  gridOutput = listArray.slice(trimStart, trimEnd).join(' ');


  var grid = [];

  for (var i = 0; i < numberOfPages; i++) {
    for (var j = 0; j < cardArray.length; j++) {
      grid[i] =
        `<div class="pagination">
            <div class="grid-container">
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            <div class="grid-item">${cardArray[j]}</div>
            </div>
          <a href="#">NEXT</a>
          </div>`;
    }
  }


  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        console.log("Show function finished");
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


/*const showAll = new Promise((resolve, reject)=>{
  function show(data) {
  let cardArray = [];
  for (var i = 0; i < allProjects.length; i++) {
    for (var j = 0; j < ownerData.length; j++) {
      if (allProjects[i].owner_id == ownerData[j].id) {
        //ownerName = ownerData[j].username;
        ownerName = ownerData[j].screen_name;
        ownerMeta = Object.values(ownerData[j]);
        //console.log('CHECK: ' + Object.values(ownerData[j]));
        break;
      } else {
        ownerName = null;
        ownerMeta = null;
      }
    }
    cardArray[i] =
      `<a href="project/${allProjects[i].id}">
          <img src="${allProjects[i].image_url}" alt="Avatar" style="width:100%">
            <div class="container">
              <h4><b>${allProjects[i].name}</b></h4>
              <p class="tooltip">${ownerName}
                <span class="tooltiptext">${ownerMeta}</span>
              </p>
              <p>${allProjects[i].summary}</p>
            </div>
        </a>`;
  }
  //const listArray = [];
  for (var i = 0; i < allProjects.length; i++) {
    listArray.push(`<div id="grid-item" onclick="clickHandler">${cardArray[i]}</div>`);
    projId.push(allProjects[i].id);
  }

  console.log("projIds: " + projId);

  const numberOfItems = listArray.length
  const numberPerPage = 9
  const currentPage = 1
  numberOfPages = Math.ceil(numberOfItems / numberPerPage)

  const trimStart = (currentPage - 1) * numberPerPage
  const trimEnd = trimStart + numberPerPage
  console.log("Pagination list: ")
  console.log(listArray.slice(trimStart, trimEnd))

  gridOutput = listArray.slice(trimStart, trimEnd).join(' ');
  console.log("Project Grid IDs: " + projId);
})*/
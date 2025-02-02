/*
ethan (average-kirigiri-enjoyer), WesleyHAS, Stavros Panagiotopoulos (stavrospana)
SCS Boot Camp Project 1 Group 1 - Personal Information Hub
Created 2023/08/15
Last Edited 2023/09/02
*/

//gets references to HTML elements necessary for event tracker functionality
var eventTextInput = $("#event-input");
var eventDatePicker = $("#event-date-picker");
var addEventButton = $("#add-event-button");
var monthYear = $("#month-year");
var weeklyMonthlyCalendar = $("#weekly-monthly-calendar");
var yearlyCalendar = $("#yearly-calendar");
var traverseLeft = $("#traverse-left");
var traverseRight = $("#traverse-right");
var zoomIn = $("#zoom-in");
var zoomOut = $("#zoom-out");
var eventRows = $(".event-row");
var rowOne = $("#row-1");
var rowTwo = $("#row-2");
var rowThree = $("#row-3");
var rowFour = $("#row-4");
var rowFive = $("#row-5");
var rowSix = $("#row-6");
var eventBlocks = $(".event-block");
var events = eventBlocks.children(".events");
var monthlyRows = $(".monthly-row");
var monthBlocks = $(".month-block");

//variables for event tracker functionality
var traverseDays = 0;
var eventView = "weekly";
var forLoopCycles;
var eventUpdated = false;

//function to set up event calendar
function setUpEventCalendar(firstDay)
{
  //determine how many event blocks to display based on zoom level
  if (eventView === "weekly") //displays 14 blocks across two rows if event view is set to weekly
  {
    monthlyRows.attr("style", "display: none");
    forLoopCycles = 14;
  }
  else if (eventView === "monthly") //displays 28-42 blocks if event view is set to monthly
  {
    if (dayjs(firstDay).daysInMonth() === 28 && dayjs(firstDay).startOf("month").day() === 0)
    {
      //if there are 28 days in current month & month starts on sunday, run for 28 iterations across four rows
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: none");
      rowSix.attr("style", "display: none");
      forLoopCycles = 28;
    }
    else if ((dayjs(firstDay).daysInMonth() >= 30 && dayjs(firstDay).startOf("month").day() === 6)
           ||(dayjs(firstDay).daysInMonth() === 31 && dayjs(firstDay).startOf("month").day() === 5))
    {
      //if there are at least 30 days in current month & month starts on saturday
      //OR if there are 31 days in current month & month starts on friday, run for 42 iterations across six rows
      monthlyRows.attr("style", "display: block");
      forLoopCycles = 42;
    }
    else //otherwise, run for 35 iterations across five rows
    {
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: block");
      rowSix.attr("style", "display: none");
      forLoopCycles = 35;
    }
  }
  else //hides monthly / weekly calendar & displays yearly calendar if event view is set to yearly
  {
    //displays yearly calendar & hides weekly / monthly calendar
    weeklyMonthlyCalendar.attr("style", "display: none");
    yearlyCalendar.attr("style", "display: block");

    return; //returns early such that code below hiding yearly calendar will not run
  }

  //hides yearly calendar & displays weekly / monthly calendar
  weeklyMonthlyCalendar.attr("style", "display: block");
  yearlyCalendar.attr("style", "display: none");

  //returns each individual day block in the rows of the weekly / monthly calendar packaged in an object
  var blocks = $(".event-row").children();
  return blocks;
}

//function to render and add dates to relevant blocks
function renderBlockDetails(blocks, firstDay)
{
  if (eventView === "yearly") //if event planner is set to yearly view, create elements representing each day as such
  {
    monthBlocks.children(".date-row").text(""); //clears any already-existing dates
    var dayOfWeek = firstDay.day(); //retrieves which day of the week firstDay is
    var daysPast = 0; //variable to track how many days of the current year have been added
    
    for (month = 0; month < 12; month++) //for loop to create days for each month of the year
    {
      //sets number of for loop cycles to number of days in current month
      forLoopCycles = dayjs(firstDay).add(month, "month").daysInMonth(); 

      //for every day of the week that must be passed to reach firstDay (from sunday), add an empty div to the current month
      for (div = 0; div < dayOfWeek; div++) 
      {
        var emptyDiv = $("<div></div>"); //creates empty div
        var firstWeekOfMonth = $(monthBlocks[month]).children()[1]; //gets reference to first week of current month (+1 to avoid month name div)
        emptyDiv.addClass("blank-date");
        firstWeekOfMonth.append(emptyDiv[0]) //adds empty div to first week of current month
      }

      var firstDayOfWeekAndInMonth = true; //variable to track if the day being added is the first day of the week in this month
      var lastDayOfThisMonth; //variable to hold last day of the current month
      var weekOfMonth = 0; //variable to track which week of the month new date element should be added to

      //for loop to create days of current month (beyond the first)
      for (day = 0; day < forLoopCycles; day++) 
      {
        var block = $("<div></div>"); //creates empty div
        var week = $(monthBlocks[month]).children()[weekOfMonth + 1]; //gets reference to current week of month (+1 to avoid month name div)
        var date = dayjs(firstDay).add(day + daysPast, "d").format("YYYY/MM/D"); //retrieves date of current day being added
        block.attr("id", date); //assigns current day's date as an ID
        block.text(date.slice(8)); //removes the year and month from date string and sets the block's date text to that
        
        //checks if the day currently being is the first day of the week & is in the current month
        if (firstDayOfWeekAndInMonth)
        {
          block.addClass("first-day-of-week"); //applies a style class which gives rounded edges on the left side 
          firstDayOfWeekAndInMonth = false; //mark that the first-day-of-week class has already been applied to a day in this week
        }
  
        week.append(block[0]); //adds new day to appropriate week
        lastDayOfThisMonth = block; //refers to current block as last day of current month
        dayOfWeek++; //increase dayOfWeek by 1

        //checks if there is a local storage entry for the current date, set its text colour to a light blue
        if (localStorage.getItem(date))
        {
          block.addClass("has-event");
        }

        if (dayOfWeek > 6) //if the last day that was added was saturday, reset dayOfWeek & proceed to next week row
        {
          block.addClass("last-day-of-week"); //applies a style class to current block which gives rounded edges on the right side 
          firstDayOfWeekAndInMonth = true; //resets application of first-day-of-week class
          dayOfWeek = 0 //reset day of week to 0 (sunday)
          weekOfMonth++; //proceeds to next week in current month
        }
      }

      lastDayOfThisMonth.addClass("last-day-of-week"); //marks last day created in above for loop as last day of the current month, which gives rounded edges on the right side 
      daysPast += forLoopCycles; //increase daysPast variable once for each day added
    }
  }
  else //otherwise (event planner is set to weekly / monthly view), add days to already-existing day-week structure as such
  {
    //assigns an ID to & modifies text of each block such that they will represent consecutive days of the week, starting at the most recent sunday
    for (day = 0; day < forLoopCycles; day++) 
    {
      var block = $(blocks[day]); //gets reference to current day being implemented

      //date of block is adjusted such that blocks will go from sunday -> saturday
      //shifted forward / backward based on how many times the user has clicked the traverse buttons and in which direction
      var date = dayjs().add(day + traverseDays - dayjs().day(), "d").format("YYYY/MM/D");

      block.attr("id", date) //assigns current day's date as an ID
      block.children(".date").text(date.slice(8)) //removes the year and month from date string and sets the block's date text to that
      
      //clears any pre-existing events in the current block
      var eventList = block.children(".events");
      eventList.empty();

      //checks if there is a local storage entry for the current date
      if (localStorage.getItem(date))
      {
        //if yes, retrieve it
        var localEventData = localStorage.getItem(date);
        eventData = JSON.parse(localEventData);

        //for loop which runs through each event item in local storage for current date
        for (eventItem = 0; eventItem < eventData.length; eventItem++)
        {
          var eventContainer = $("<div></div>"); //creates empty div
          var eventName = $("<li></li>").text(eventData[eventItem]); //creates list item with text of current event
          var xButton = $("<button></button>").text("X"); //creates 'X' button

          eventContainer.append(eventName); //adds list item with event name to div container
          eventContainer.append(xButton); //adds 'X' button to div container
          block.children(".events").append(eventContainer); //adds div container to current day block
        }
      }
    }

    eventRows.children().removeClass("outside-month"); //removes any already-applied outside-month classes on certain days
    var bottomRow; //variable to hold a reference to the bottom row of the month currently being viewed

    if (forLoopCycles === 14) //if forLoopCycles is 14, i.e. event calendar is in weekly view, eject from function
    {
      return; 
    }
    else if (forLoopCycles === 28) //if forLoopCycles is 28, i.e. there are four rows of weeks, set the fourth row to be the bottom row
    {
      bottomRow = rowFour;
    }
    else if (forLoopCycles === 35) //if forLoopCycles is 35, i.e. there are five rows of weeks, set the fifth row to be the bottom row
    {
      bottomRow = rowFive;
    }
    else if (forLoopCycles === 42) //if forLoopCycles is 42, i.e. there are six rows of weeks, set the sixth row to be the bottom row
    {
      bottomRow = rowSix;
    }

    var dayOfWeek = firstDay.day(); //retrieves which day of the week firstDay of the month is
    var lastDayOfMonth = firstDay.endOf("month").day(); //retrieves which day of the week last day of the month is

    //for every day of the week that must be passed to reach firstDay (from sunday), change the text of an event block in the first row to gray, going from left to right
    for (day = 0; day < dayOfWeek; day++) 
    {
      $(rowOne.children()[day]).addClass("outside-month") //change text in first row block with index equal to day to gray
    }

    //for every day of the week in the bottom row that isn't part of the current month, change its text to gray
    for (day = lastDayOfMonth + 1; day < 7; day++)
    {
      $(bottomRow.children()[day]).addClass("outside-month"); //change text in bottom row block with index equal to day to gray
    }
  }
}

//function to adjust height of all blocks in both rows of weekly view to match the tallest day in that row
function adjustRowHeight()
{
  if (eventView === "weekly") //adjust height of day blocks in weekly view to match tallest day in that row
  {
    //sets minimum height of rows one & two, allowing height to then adjust to the tallest day block
    rowOne.children().css({"height": "", "min-height": "220px"});
    rowTwo.children().css({"height": "", "min-height": "220px"});
    
    //retrieves pixel height of week one & two parent rows
    rowOneHeight = rowOne[0].offsetHeight;
    rowTwoHeight = rowTwo[0].offsetHeight;

    //sets height of day blocks in rows one & two to that of the tallest day in that row
    rowOne.children().css("min-height", rowOneHeight);
    rowTwo.children().css("min-height", rowTwoHeight);
  }
}

//function to update month / year header above calendar
function updateMonthYearHeader(firstDay)
{
  if (eventView === "yearly") //if event planner is set to yearly view, update the text with the appropriate year
  {
    monthYear.text(dayjs(firstDay).format("YYYY")); //updates month / year header above calendar based on year of firstDay
  }
  else if (eventView === "monthly") //if event planner is set to monthly view, update the text with the appropriate month & year
  {
    monthYear.text(dayjs(firstDay).format("MMMM YYYY")); //updates month / year header above calendar based on month & year of firstDay
  }
  else //otherwise (i.e. event planner is in weekly view), update the text with the appropriate month & year
  {
    var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
    monthYear.text(dayjs(lastDayOfFirstRow).format("MMMM YYYY")); //updates month / year header above calendar based on month & year of lastDayOfFirstRow
  }
}

//function render event calendar content
function renderEventPlanner(firstDay)
{
  //determines how many iterations the upcoming for loop will run for, and how many rows of event blocks will be displayed
  var blocks = setUpEventCalendar(firstDay);

  renderBlockDetails(blocks, firstDay); //renders & assigns dates to calendar
  adjustRowHeight(); //adjusts height of rows in each week
  updateMonthYearHeader(firstDay); //updates month / year header above calendar

  //if this calendar re-render was caused by an event being added or deleted, do not change the default date of the datepicker, and reset the eventUpdated variable
  if (eventUpdated)
  {
    eventUpdated = false;
    return;
  }

  //if firstDay has been defined, update default datepicker date to firstDay
  if (firstDay)
  {
    eventDatePicker.datepicker("setDate", firstDay.format("YYYY/MM/DD")); 
  }
  else //if it has not, set firstDay to first day of month currently being viewed, and set default datepicker date to firstDay
  {
    var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
    var firstDay = dayjs(lastDayOfFirstRow).startOf("month"); //sets firstDay to first day of month containing lastDayOfFirstRow
    eventDatePicker.datepicker("setDate", firstDay.format("YYYY/MM/DD"));
  }
}

//function to manage traversing event blocks using left & right buttons
function traverseBlocks(direction)
{
  var firstDay; //variable to hold first day of new month / year when traversing

  if (direction === "left") //checks if the user clicked the left button
  {
    if (eventView === "weekly") //if the event calendar is in the weekly view, shift 7 days backwards
    {
      traverseDays -= 7;
    }
    else if (eventView === "monthly") //if the event calendar is in the monthly view, shift one month backwards relative to the one currently being viewed
    {
      var sundayOfThisWeek = dayjs().startOf("week"); //retrieves this week's sunday
      var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
      var firstDayOfLastMonth = dayjs(lastDayOfFirstRow).subtract(1, "month").startOf("month"); //retrieves first day of month preceding the one currently being viewed
      var sundayOfMonthStart = dayjs(firstDayOfLastMonth).startOf("week"); //retrieves sunday of week containing firstDayOfLastMonth

      //changes traverseDays such that calendar will start at the week containing first day of the month currently being viewed
      traverseDays = sundayOfMonthStart.diff(sundayOfThisWeek, "day");

      firstDay = firstDayOfLastMonth; //sets first day variable to first day of last month
    }
    else //otherwise (calendar is in yearly view), shift one year backwards
    {
      firstDayOfYear = dayjs(monthYear.text()).startOf("year"); //retrieves first day of year currently being viewed
      firstDayOfLastYear = dayjs(firstDayOfYear).subtract(1, "year").startOf("year") //retrieves first day of the year preceding the one currently being viewed
      firstDay = firstDayOfLastYear; //sets first day to first day of year previous to the one currently being viewed
    }
  }
  else //if they did not, then they clicked the right button
  {
    if (eventView === "weekly") //if the event calendar is in the weekly view, shift 7 days forwards
    {
      traverseDays += 7;
    }
    else if (eventView === "monthly") //if the event calendar is in the monthly view, shift one month forwards relative to the one currently being viewed
    {
      var sundayOfThisWeek = dayjs().startOf("week"); //retrieves this week's sunday
      var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
      var firstDayOfNextMonth = dayjs(lastDayOfFirstRow).add(1, "month").startOf("month"); //retrieves first day of month following the one currently being viewed
      var sundayOfMonthStart = dayjs(firstDayOfNextMonth).startOf("week"); //retrieves sunday of week containing firstDayOfNextMonth

      //changes traverseDays such that calendar will start at the week containing first day of the month currently being viewed
      traverseDays = sundayOfMonthStart.diff(sundayOfThisWeek, "day");

      firstDay = firstDayOfNextMonth; //sets first day variable to first day of next month
    }
    else //otherwise (calendar is in yearly view), shift one year forwards
    {
      firstDayOfYear = dayjs(monthYear.text()).startOf("year"); //retrieves first day of year currently being viewed
      firstDayOfLastYear = dayjs(firstDayOfYear).add(1, "year").startOf("year") //retrieves first day of the year following the one currently being viewed
      firstDay = firstDayOfLastYear; //sets first day to first day of year following the one currently being viewed
    }
  }

  renderEventPlanner(firstDay); //updates event planner to reflect the changes above
}

//function to change zoom level of event view
function switchEventZoom(zoomButton)
{
  var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
  var sundayOfThisWeek = dayjs().startOf("week"); //retrieves this week's sunday
  var firstDay; //variable to hold first day of new month / year when traversing

  if (zoomButton === "out") //checks if the user clicked the zoom out button
  {
    if (eventView === "weekly") //if the planner is currently in weekly view, switch to monthly view
    {
      var monthOfLastDay = dayjs(lastDayOfFirstRow).startOf("month"); //retrieves first day of month containing lastDayOfFirstRow
      var sundayOfMonthStart = dayjs(monthOfLastDay).startOf("week"); //retrieves sunday of week containing monthOfLastDay
      
      //changes traverseDays such that calendar will start at the week containing first day of the month currently being viewed
      traverseDays = sundayOfMonthStart.diff(sundayOfThisWeek, "day");

      firstDay = monthOfLastDay; //sets firstDay to first day of month which to be zoomed out to
      eventBlocks.css({"min-height": "", "height": "140px"}); //removes min-height & sets a fixed height of 100px to all event day blocks
      events.addClass("monthly"); //adds monthly class to event lists

      eventView = "monthly"
    }
    else if (eventView === "monthly") //if the planner is currently in monthly view, switch to yearly view
    {
      var yearOfLastDay = dayjs(lastDayOfFirstRow).startOf("year"); //retrieves first day of year containing lastDayOfFirstRow
      firstDay = yearOfLastDay; //sets firstDay to first day of year
      
      eventView = "yearly"
    }
    else //otherwise (i.e. event planner is in yearly view), return early to prevent event planner from trying to re-render
    {
      return;
    }
  }
  else //if they did not, then they clicked the zoom in button
  {
    if (eventView === "yearly") //if the planner is currently in yearly view, switch to monthly view
    {
      firstDayOfYear = dayjs(monthYear.text()).startOf("year"); //retrieves first day of year currently being viewed
      var sundayOfYearStart = dayjs(firstDayOfYear).startOf("week"); //retrieves sunday of week containing firstDayOfYear

      //changes traverseDays such that calendar will start at the week containing first day of the year currently being viewed
      traverseDays = sundayOfYearStart.diff(sundayOfThisWeek, "day");

      firstDay = firstDayOfYear //sets firstDay to first day of the year currently being viewed

      eventView = "monthly"
    }
    else if (eventView === "monthly") //if the planner is currently in monthly view, switch to weekly view
    {
      events.removeClass("monthly"); //removes monthly class from event lists
      eventView = "weekly"
    }
  }

  renderEventPlanner(firstDay); //updates event calendar
}

//function to take input event data
function createEvent()
{
  //retrieves event name & date
  var eventName = eventTextInput.val();
  var eventDateInput = eventDatePicker.val();

  //if the user did not input both a name and date for the event, eject from function
  if (!(eventName && eventDateInput))
  {
    return;
  }

  //converts date input format for data processing
  let eventDate = dayjs(eventDateInput).format("YYYY/MM/D");

  //attempts to retrieve entry for input date from local storage
  var localEventList = localStorage.getItem(eventDate);

  if (localEventList) //if the above entry exists, append the new event to it, and update the local storage entry
  {
    var eventList = JSON.parse(localEventList);
    eventList.push(eventName);
    localStorage.setItem(eventDate, JSON.stringify(eventList));
  }
  else //if it does not exist, create an empty array, append the new event to it, and save the entry to local storage
  {
    var eventList = [];
    eventList.push(eventName);
    localStorage.setItem(eventDate, JSON.stringify(eventList));
  }

  //clears event name inputs
  eventTextInput.val("");

  //gets a sample firstDay value
  var firstDay = retrieveFirstDay();

  eventUpdated = true; //marks that the following calendar re-render was triggered by a change to events
  renderEventPlanner(firstDay); //updates event calendar
}

//function to delete events from the calendar
function deleteEvent()
{
  elementClicked = event.target //retrieves element that was clicked

  //if a button was not clicked, eject from function
  if (!elementClicked.matches("button"))
  {
    return;
  }
  
  var buttonClicked = $(elementClicked); //gets a jQuery object reference to the specific button that was clicked
  var eventContainer = buttonClicked.parent(); //gets parent div of buttonClicked
  var eventList = eventContainer.parent(); //gets grandparent event list of buttonClicked
  var eventDate = eventList.parent().attr("id"); //gets event date from id of great-grandparent event block
  
  var localStorageData = JSON.parse(localStorage.getItem(eventDate)); //retrieves event data of date associated with event block containing buttonClicked
  
  localStorageData.splice(eventContainer.index(), 1); //removes entry matching index of eventContainer from local storage

  if (localStorageData.length === 0) //if the local storage entry for the current date contains no events, remove the entry for that date
  {
    localStorage.removeItem(eventDate); 
  }
  else //if events still remain for that date, update the entry now that the appropriate event has been removed
  {
    localStorage.setItem(eventDate, JSON.stringify(localStorageData)); //updates local storage after removing appropriate entry
  }

  //gets a sample firstDay value
  var firstDay = retrieveFirstDay();

  eventUpdated = true; //marks that the following calendar re-render was triggered by a change to events
  renderEventPlanner(firstDay); //updates event calendar
}

//function to get a reference to a sample firstDay variable, used in other functions where firstDay is not referenced, but is followed up by functions that need it
function retrieveFirstDay()
{
  if (eventView === "yearly") //if eventView is set to yearly, set firstDay to first day of year being viewed
  {
    firstDay = dayjs(monthYear.text()).startOf("year");
  }
  else //otherwise, set it to the first day of the month currently being viewed
  {
    var lastDayOfFirstRow = rowOne.children()[6].id; //retrieves ID (date) of last day in first row of event planner
    var firstDay = dayjs(lastDayOfFirstRow).startOf("month"); //sets firstDay to first day of month containing lastDayOfFirstRow
  }

  return firstDay;
}

//adds datepicker widget to event date selection input
$(function()
{
  eventDatePicker.datepicker(
  {
    dateFormat: "yy/mm/dd",
  });
});

//initializes event calendar view on current week
renderEventPlanner();

//resets date of datepicker to start of current month when page is finished loading
window.addEventListener("load", function()
{
  eventDatePicker.datepicker("setDate", dayjs(rowOne.children()[6].id).startOf("month").format("YYYY/MM/DD"));
});

//updates row height while window is being resized
window.addEventListener("resize", adjustRowHeight);

//attempts to add an event when the add event button is clicked
addEventButton.on("click", createEvent);

//attempts to add an event if the enter key is pressed while the event text input is in focus
eventTextInput.on("keypress", function(keypressed)
{
  if (keypressed.key === "Enter")
  {
    createEvent();
  }
});

//attempts to delete an event when one is clicked
events.on("click", deleteEvent);

//moves event calendar one week backward when left arrow is clicked
traverseLeft.on("click", function()
{
  traverseBlocks("left");
});

//moves event calendar one week forward when left arrow is clicked
traverseRight.on("click", function()
{
  traverseBlocks("right");
});

//moves event calendar one week forward when left arrow is clicked
zoomIn.on("click", function()
{
  switchEventZoom("in");
});

//moves event calendar one week forward when left arrow is clicked
zoomOut.on("click", function()
{
  switchEventZoom("out");
});

/* Stavros's code here */



//added variable for the youtube API key
// the youtube API is somewhat streamline 

var ytapiKey = 'AIzaSyBCbd2zYGG1SG1qqbBwNrwanUNbLqH4OAE'; 


//added a function to save data to local storage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
//added a function to LOAD data from the local storage
function loadFromLocalStorage(key) {
  var data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data); //parses and returns the data if it exists
  }
  return null; //return null if no data is found locally
}

//function added to trigger when the Fetch Videos button is clicked on
//this will pull data from the youtube channels Channel ID
//this can be accessed by going to the specified Youtube Channel => About => Share Channel => Copy Channel ID
function fetchAndRender() {
  var channelIdInput = document.getElementById('channelIdInput');
  var channelId = channelIdInput.value; 

  if (channelId) {

    fetchVideos(channelId); //this will fetch and render videos if a valid channel ID in inputed in the box

  } else {
    console.error('Please provide a valid Youtube Channel ID.');
  }
}
//added a function to fetch videos from Youtube API when the channel ID is inputed
function fetchVideos(channelId) {

  var request = new XMLHttpRequest(); //creates a new XMLHTTP Request object
  request.open('GET', "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelId + "&order=date&maxResults=5&key=" + ytapiKey, true);

  request.onload = function () {

    if (request.status >= 200 && request.status < 400) {

      var data = JSON.parse(request.responseText);  // this will parse the response JSON data

      saveToLocalStorage('youtubeData', data); // this will save fetched data to local storage
      renderVideos(data); //calls the renderVideos function to display videos on webpage

      channelIdInput.value = ""; //empties channel id input

    } else {

      console.error('Request failed with status:', request.status); // logs an error if the request fails
    }
  };

  request.onerror = function () {
    console.error('Request failed.'); //logs an error if the request encounters an error 
  };

  request.send(); // sends the Youtube API request
}

//added a function to render videos in the UI
function renderVideos(data) {

  var videosDiv = document.getElementById('videos');
  videosDiv.setAttribute("style", "display: flex");
  videosDiv.innerHTML = '';// clears existing content

  for (var i = 0; i < data.items.length; i++) {
    var video = data.items[i]; //gets a video item from the fetched youtube data
    var videoId = video.id.videoId; //gets the video ID

    var iframe = document.createElement('iframe'); //creats an iframe element that will display video thumbnail
    iframe.src = "https://www.youtube.com/embed/" + videoId; //iframe source is attatched to embedded video
    iframe.width = '560'; //sets the iframe width
    iframe.height = '315'; //sets iframe height

    var videoDiv = document.createElement('div');
    videoDiv.className = 'video-box'; //applies a CSS class for styling the video box
    videoDiv.appendChild(iframe);

    videosDiv.appendChild(videoDiv); //appends video div to the video container
  }
}


//added an event listener to the fetch button
document.getElementById('fetchButton').addEventListener('click', fetchAndRender);


//added an event Listener when the page loads

document.addEventListener('DOMContentLoaded', function() {

  var savedData = loadFromLocalStorage('youtubeData');

  if (savedData) {
    renderVideos(savedData); //if there is saved data locally, the videos will render
  }
});


/* Wesley's code here */





//Visual Crossing API Key
var weatherApiKey = 'DWZMTC97DXDUUZ9PZMQAP64BT';

var fetchButton = document.getElementById('search-button');
var currentDayWeather = document.getElementById('current-day-weather');
var nextHoursWeather = document.getElementById('next-hours-weather');
var temp = document.getElementById('current-temp');
var humidity = document.getElementById('current-humidity');
var wind = document.getElementById('current-wind');
var nextDays = document.getElementById('five-day-forecast');
var windDirection = document.getElementById('current-wind-direction');
var inputCity = document.getElementById('city-search');
var currentDay = document.getElementById('current-date');
var clearCityInput = document.getElementById('clear-city');
var weatherContainer = document.getElementById('weather-container');
var city;

//if there is no local storage variable set for the saved city, create an empty one
if (!localStorage.getItem('savedCity'))
{
  localStorage.setItem('savedCity', '');
}

// Function to clear the saved city and hide weather container
function clearCity() {
  localStorage.setItem('savedCity', '');
  weatherContainer.style.display = "none";
}

// Attach the clearCity function to the "Clear City" button's click event
clearCityInput.addEventListener('click', clearCity);

// Function to fetch weather data from the API
async function getApi() {

  // Determine the city based on input or saved value
  if (inputCity.value === '')
  {
    var storedValue = localStorage.getItem("savedCity");
    city = storedValue;
  }
  else
  {
    city = inputCity.value; // Assuming inputCity is defined
  }

  // Build the API URL for the current day's weather
  var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=" + weatherApiKey + "&unitGroup=metric";

  var successfulRequest = false; //variable to track if request was successful

  /* checks if the current city input is a valid search, clearing input box if true */
  await fetch(queryUrl)
  .then(function (response) {
    if (response.ok) {
      successfulRequest = true;
      inputCity.value='';
    }
  })

  //if the city search was not valid & there is a city in local storage, attempt to use that to render weather data instead
  if (localStorage.getItem("savedCity") && successfulRequest === false)
  {
    var currentCity = document.querySelector(".city-name"); //attempts to retrieve name of city with weather data currently being displayed
    city = localStorage.getItem("savedCity"); //retrieves city name from local storage

    if (city === '') //if city is an empty entry, eject from function
    {
      return;
    }

    if (currentCity) //checks if there is currently weather data being displayed
    {
      if (currentCity.textContent !== city) //if the current city being displayed does not match the city held in local storage
      {
        successfulRequest = true; //approve the search to have its weather generated
      }
    }
    else //if there is currently no weather data being displayed
    {
      successfulRequest = true; //approve the search to have its weather generated
    }

    //updates search URL with city from local storage
    queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=" + weatherApiKey + "&unitGroup=metric";
  }

  if (!successfulRequest) //if search was not approved for weather generation, eject from function
  {
    return;
  }

  // Clear existing weather data on UI
  currentDayWeather.innerHTML = '';
  nextHoursWeather.innerHTML = '';
  nextDays.innerHTML = '';

  // Fetch weather data for the current day
  await fetch(queryUrl)
  .then(function (response) {
    if (!response.ok) {
      throw new Error("City not found");
    } else {
      weatherContainer.setAttribute('style', 'display: block');
    } 
    return response.json();
  })
  .then(function (data) {

    $(".weather-style-container").attr("style", ("display: block"));

    var cityName = document.createElement('div');
    var currentDayTemp = document.createElement('div');
    var currentDayHumidity = document.createElement('div');
    var currentDayWind = document.createElement('div');
    var currentDayWindDirection = document.createElement('div');

    var weatherConditions = data.currentConditions.icon;
    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('id', 'weather-icon');
    var weatherImage = document.getElementById('weather-icon');
    weatherIcon.src = './assets/images/WeatherIcons-main/SVG/2nd Set - Color/' + weatherConditions + '.svg';
    weatherIcon.style.width = '38%'; // Set the width in pixels or any other unit
    weatherIcon.style.height = '38%'; // Set the height in pixels or any other unit
    weatherIcon.classList.add("today-icon");
    cityName.textContent = city;
    currentDayTemp.textContent = 'Temp: ' + data.currentConditions.temp + '°C';
    currentDayHumidity.textContent = 'Humidity: ' + data.currentConditions.humidity + '%';
    currentDayWind.textContent = 'Wind: ' + data.currentConditions.windspeed + ' kph';
    currentDayWindDirection.textContent = 'Wind Direction: ' + data.currentConditions.winddir + '°';
    cityName.classList.add("city-name");
    currentDayWeather.appendChild(cityName);
    currentDayWeather.appendChild(weatherIcon);
    currentDayWeather.appendChild(currentDayTemp);
    currentDayWeather.appendChild(currentDayHumidity);
    currentDayWeather.appendChild(currentDayWind);
    currentDayWeather.appendChild(currentDayWindDirection);

    localStorage.setItem('savedCity', cityName.textContent); //updates city in local storage
    nextHoursForecast(data.latitude, data.longitude);

    sevenDayForecast(data.latitude, data.longitude);
  })

  .catch(function (error) {
    console.error('Error fetching data:', error);
    weatherContainer.setAttribute('style', 'display: none');
  })
}

// Function to fetch hourly forecast data
function nextHoursForecast(lat, lon){
  var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + lat + "," + lon + "?key=" + weatherApiKey + "&unitGroup=metric";

  fetch(queryUrl)
  .then(function (response)
  {
    return response.json();
  })
  .then(function (data) {

    var forecastList = data.days[0].hours;

    for (var i = 0; i < 24; i = i + 1) {
      var nextHoursForecastContent = document.createElement('div');
      nextHoursForecastContent.classList.add('hourly-forecast');
      var nextHourTime = document.createElement('div');
      var nextHoursTemp = document.createElement('div');
      var nextHoursHumidity = document.createElement('div');
      var nextHoursWind = document.createElement('div');
      var nextHoursWindDirection = document.createElement('div');
      var rawDate = forecastList[i].datetime;


      var weatherConditions = forecastList[i].icon;
      var weatherIcon = document.createElement('img');
      weatherIcon.setAttribute('id', 'weather-icon');
      var weatherImage = document.getElementById('weather-icon');
      weatherIcon.src = './assets/images/WeatherIcons-main/SVG/2nd Set - Color/' + weatherConditions + '.svg';
      weatherIcon.style.width = '38%'; // Set the width in pixels or any other unit
      weatherIcon.style.height = '38%'; // Set the height in pixels or any other unit
      weatherIcon.classList.add("today-icon");


      nextHourTime.textContent = rawDate;
      nextHourTime.classList.add("weather-time-marker");
      nextHoursTemp.textContent = 'Temp: ' + forecastList[i].temp + '°C';
      nextHoursHumidity.textContent = 'Humidity: ' + forecastList[i].humidity + '%';
      nextHoursWind.textContent = 'Wind: ' + forecastList[i].windspeed + ' kph';``
      nextHoursWindDirection.textContent = 'Direction: ' + forecastList[i].winddir + '°';
      nextHoursForecastContent.appendChild(nextHourTime);
      nextHoursForecastContent.appendChild(weatherIcon);
      nextHoursForecastContent.appendChild(nextHoursTemp);
      nextHoursForecastContent.appendChild(nextHoursHumidity);
      nextHoursForecastContent.appendChild(nextHoursWind);
      nextHoursForecastContent.appendChild(nextHoursWindDirection);
      

      nextHoursWeather.appendChild(nextHoursForecastContent);
    }
  });
}


// Function to fetch seven-day forecast data
  function sevenDayForecast(lat, lon){

    var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + lat + "," + lon + "?key=" + weatherApiKey + "&unitGroup=metric";

    fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var forecastList = data.days;

      for (var i = 1; i < 8; i = i + 1) {
        var dailyForecastContent = document.createElement('div');
        dailyForecastContent.classList.add('forecast-sections', 'daily-forecast');
        var nextDaysTemp = document.createElement('div');
        var nextDaysHumidity = document.createElement('div');
        var nextDaysWind = document.createElement('div');
        var nextDaysWindDirection = document.createElement('div');
        var nextDaysDate = document.createElement('div');
        var rawDate = forecastList[i].datetime;
        var formattedDate = new Date(rawDate).toLocaleDateString('en-US', {weekday: 'short' , month: 'long' , day: 'numeric'});


        var weatherConditions = data.days[i].icon;
        var weatherIcon = document.createElement('img');
        weatherIcon.setAttribute('id', 'weather-icon');
        var weatherImage = document.getElementById('weather-icon');

        weatherIcon.src = './assets/images/WeatherIcons-main/SVG/2nd Set - Color/' + weatherConditions + '.svg';

        weatherIcon.style.width = '30%'; // Set the width in pixels or any other unit
        weatherIcon.style.height = '30%'; // Set the height in pixels or any other unit
        weatherIcon.classList.add("weekly-icon");

        nextDaysDate.textContent = formattedDate;
        nextDaysDate.classList.add("weather-time-marker");
        nextDaysTemp.textContent = 'Temp: ' + forecastList[i].temp + '°C';
        nextDaysHumidity.textContent = 'Humidity: ' + forecastList[i].humidity + '%';
        nextDaysWind.textContent = 'Wind: ' + forecastList[i].windspeed + ' kph';``
        nextDaysWindDirection.textContent = 'Direction: ' + forecastList[i].winddir + '°';
        dailyForecastContent.appendChild(nextDaysDate);
        dailyForecastContent.appendChild(weatherIcon);
        dailyForecastContent.appendChild(nextDaysTemp);
        dailyForecastContent.appendChild(nextDaysHumidity);
        dailyForecastContent.appendChild(nextDaysWind);
        dailyForecastContent.appendChild(nextDaysWindDirection);

        nextDays.appendChild(dailyForecastContent);
      }
    });
  }

  // load weather data
  getApi();

  // Attach the getApi function to the "Search" button's click event
  fetchButton.addEventListener('click', getApi);

  // Function to update current date and time every second
  function updateDateAndTime() {
    var currentDateElement = document.getElementById('current-date');
    var currentTimeElement = document.getElementById('current-time');
    
    // Use the dayjs library to format and display date and time
    var currentDate = dayjs().format("MMMM D, YYYY");
    var currentTime = dayjs().format('HH:mm:ss');

    // Update the displayed date and time
    currentDateElement.textContent = currentDate;
    currentTimeElement.textContent = currentTime;
  }

  // Update date and time immediately and set interval to update every second
  setInterval(updateDateAndTime, 1000);
  updateDateAndTime();
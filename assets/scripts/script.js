/*
ethan (average-kirigiri-enjoyer), WesleyHAS, Stavros Panagiotopoulos (stavrospana)
SCS Boot Camp Project 1 Group 1 - Personal Information Hub
Created 2023/08/15
Last Edited 2023/08/24
*/

/* Ethan's code here */

//NEXT TO DO
//add event creation
//add event deletion
//add saving events to local storage
//add removing events from local storage
//update styles

//gets references to HTML elements necessary for event tracker functionality
var monthYear = $("#month-year");
var weeklyMonthlyCalendar = $("#weekly-monthly-calendar");
var yearlyCalendar = $("#yearly-calendar");
var traverseLeft = $("#traverse-left");
var traverseRight = $("#traverse-right");
var zoomIn = $("#zoom-in");
var zoomOut = $("#zoom-out");
var rowThree = $("#row-3")
var rowFour = $("#row-4")
var rowFive = $("#row-5")
var rowSix = $("#row-6")
var monthlyRows = $(".monthly-row");
var monthBlocks = $(".month-block");

//variables for event tracker functionality
var traverseDays = 0;
var eventView = "weekly";
var forLoopCycles;

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
    //for yearly view, have three rows with four divs each (three rows of four months)
    //each month div has six divs within (one for possible row of weeks)
    //12 for loops (one for each month) adds horizontally-aligned dates to each week-row div
      //dayjs checks if the currently viewed year is a leap year, running for 29 days instead of 28 for february
    //each for loop has an internal counter that all share the same variable to keep track of which day of the week should be added to next
    //before any of the for loops run, use dayjs().day() to retrieve which day of the week january 1st of that year is
      //the value returned by the above will be the starting value of the internal shared counter
      //counter will run from 0 -> 6 inside each for loop, transferring progress between for loops, and reset back to 0 every time it hits 6
      //e.g. 0 -> added to sunday & variable++, 3 -> added to wednesday & variable++, 6 -> added to sunday & variable = 0
      //this way, you just have to determine which day of the week january 1st is for each year + if it's a leap year
      //e.g. 2024 is a leap year, january 1st is a monday;
        //dayjs().day() returns 1 -> first day will be added to column [1], second day to column [2], etc...
        //sixth day is added to column [6] (saturday), variable is reset to 0, and seventh day is added to column [0] (sunday)
        //repeats till end of for loop for that month (31 days -> 31 iterations)
        //for loop for february immediately follows, dayjs checks that 2024 is a leap year, so loop will run for 29 iterations
        //last day of january is a wednesday, so first day of february should be a thursday
        //for last iteration of january loop, variable === 3, day is added to wednesday column, variable++, i.e. variable is now == 4
        //variable is preserved between loops, so first day of february will be added to column [4] (thursday column)
        //internal counter picks up where january loop left off, i.e. second day added to column [5], etc...
        //repeats for the remaining ten months
    //traverse buttons uses .add() method to add / subtract a year with each click in either direction

    //traverse will need to return first day of year as firstDay variable to be processed by other functions

    //when checking if a date in the yearly view should be highlighted, check if a local storage entry
    //exists for the date ID assigned to that date
    //use day numbers instead of dots for yearly view, changing the colour of the text for those with events

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
        firstWeekOfMonth.append(emptyDiv[0]) //adds empty div to first week of current month
      }

      var weekOfMonth = 0; //variable to track which week of the month new date element should be added to

      for (day = 0; day < forLoopCycles; day++) //for loop to create days of current month
      {
        var block = $("<div></div>"); //creates empty div
        var week = $(monthBlocks[month]).children()[weekOfMonth + 1]; //gets reference to current week of month (+1 to avoid month name div)
        var date = dayjs(firstDay).add(day + daysPast, "d").format("YYYY/MM/D"); //retrieves date of current day being added
        block.attr("id", date); //assigns current day's date as an ID
        block.text(date.slice(8)); //removes the year and month from date string and sets the block's date text to that
        week.append(block[0]); //adds new day to appropriate week
        dayOfWeek++; //increase dayOfWeek by 1

        if (dayOfWeek > 6) //if the last day that was added was saturday, reset dayOfWeek & proceed to next week row
        {
          dayOfWeek = 0 //reset day of week to 0 (sunday)
          weekOfMonth++; //proceeds to next week in current month
        }   
      }

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
    }
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
    var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner
    monthYear.text(dayjs(lastDayOfFirstRow).format("MMMM YYYY")); //updates month / year header above calendar based on month & year of lastDayOfFirstRow
  }
}

//function render event calendar content
function renderEventPlanner(firstDay)
{
  //determines how many iterations the upcoming for loop will run for, and how many rows of event blocks will be displayed
  var blocks = setUpEventCalendar(firstDay);

  //renders & assigns dates to calendar
  renderBlockDetails(blocks, firstDay);

  /* var lastDayOfFirstRow = $("#row-1").children()[6].id;
    var sundayOfThisWeek = dayjs().startOf("week"); //retrieves this week's sunday

  var yearOfLastDay = dayjs(lastDayOfFirstRow).startOf("year");
        var sundayOfYearStart = dayjs(yearOfLastDay).startOf("week");

  traverseDays = sundayOfYearStart.diff(sundayOfThisWeek, "day");

  dayjs().add(traverseDays - dayjs().day(), "d");*/

  //dayjs(dayjs().date(1)).format("ddd") -> day of week for first day of month

  //https://jqueryui.com/datepicker/ -> datepicker widget

  
  
  //change all text colour of days not in current month in monthly view to gray
  //e.g. month starts on tuesday, ends on thursday
    //sunday & monday of first week + friday & saturday of last week are gray
    //use two for loops which which run for up to 6 iterations, one to check every day of first week in monthly view (other than saturday), the other for every day of final week (other than sunday)
      //get reference to lastDayOfFirstRow / firstDayOfNewMonth
      //for each iteration, check if dayjs().month() of day being checked equals that of the above
        //if yes, for loop returns to end early
        //if not, colour the day being checked gray, and repeat until all reaches the start of the month being viewed, or all 6 days are grey
      //counts up from 0 for first week checks (sunday -> friday), counts down from 6 for final week checks (saturday -> monday)

  //when creating dates for yearly view check if there is a local storage entry for its date
    //if yes, change the text colour of that date
    //otherwise, do nothing
    //it would probably be more efficient to get the length of the local storage event list
      //use a for loop running for iterations equal to the length of the list
      //.find() days which have an ID matching

  //updates month / year header above calendar
  updateMonthYearHeader(firstDay);
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
      var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner
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
      var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner
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
  var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner
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
      eventView = "weekly"
    }
  }

  renderEventPlanner(firstDay);
}

//initializes event calendar view on current week
renderEventPlanner();

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

//purgeOldEvents function runs once, and deletes local storage data for events that passed over a month ago
//you would probably have to put all events into a single object and name all sub-objects based on their date
  //when a new event is created, the object is appended to the current list
//function would perform a for loop which attempts to run through every event in the local storage list
//if it finds a date > 30 days past, it is deleted
//continues until it finds a date < 30 days past or a date ahead of today, at which point the loop returns to end early

/* Stavros's code here */



// adding the variables for the Youtube API as well as the channel ID 
//the youtube api is very straight forward when fetching videos

var channelId = 'UCuFFtHWoLl5fauMMD5Ww2jA';
var ytapiKey = 'AIzaSyBoyiJ4FMEcXbXXRVnFQFMIEH2ljt85RhU';

//adding a function to save data to local storage

//function to save data to local storage
function saveToLocalStorage(key, data) {
  
  localStorage.setItem(key, JSON.stringify(data));
}
// Add a function to load the data from the local storage
function loadFromLocalStorage(key) {

  var data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}


//I will now write the function to fetch the videos from the CBC news Youtube channel to recieve their most recent videos and embed it in the webpage

function fetchVideos() {
    var videosDiv = document.getElementById('videos');

//A Check to see if the data is available in the local storage
var storedData = loadFromLocalStorage('youtubeData');
if (storedData){

  renderVideos(storedData);
} else {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&key=${ytapiKey}`)
  .then (response => response.json())
  .then(data => {
     saveToLocalStorage('youtubeData', data);
    renderVideos(data);
  })
  .catch(error => console.error(error));
            }
}
function renderVideos(data) {
  var videosDiv = document.getElementById('videos');
  videosDiv.innerHTML = '';

  data.items.forEach(video => {
      var videoId = video.id.videoId;

      var iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.width = '560';
      iframe.height = '315';

      var videoDiv = document.createElement('div');
      videoDiv.className = 'video-box';
      videoDiv.appendChild(iframe);

      videosDiv.appendChild(videoDiv);
  });
}

// Fetch videos on page load
fetchVideos();


/* Wesley's code here */





//Visual Crossing API Key
var weatherApiKey = '5949XGHGML2VDMYSFYV8PCKVY';

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


function clearCity() {
  localStorage.removeItem('savedCity');
  weatherContainer.style.display = "none";
}

clearCityInput.addEventListener('click', clearCity);

if (localStorage === null) {

} else {
  getApi();
}

function getApi() {

  currentDayWeather.innerHTML = '';
  // nextHoursWeather = '';
  nextDays.innerHTML = '';

  console.log(inputCity);
  if (inputCity.value === "") {
    var storedValue = localStorage.getItem("savedCity");
    city = storedValue;
  } else if (inputCity.value !== undefined){
    city = inputCity.value; // Assuming inputCity is defined
    localStorage.setItem('savedCity', inputCity.value);
  }

  var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + city + "?key=" + weatherApiKey + "&unitGroup=metric";
  // var queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${weatherApiKey}&unitGroup=metric`
  console.log(queryUrl);

  if (weatherContainer.style.display === "none") {
    weatherContainer.style.display = "block";
  }


  if (city === null) {

    return false;
  }

  fetch(queryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log('Fetch Response \n-------------');
    console.log(data);


    //trying to add current day dinamically

    // var currentForecastContent = document.createElement('div');
    // currentForecastContent.classList.add('current-forecast');
    var currentDayTemp = document.createElement('div');
    var currentDayHumidity = document.createElement('div');
    var currentDayWind = document.createElement('div');
    var currentDayWindDirection = document.createElement('div');

    var weatherConditions = data.currentConditions.icon;
    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('id', 'weather-icon');
    var weatherImage = document.getElementById('weather-icon');
    weatherIcon.src = './assets/images/WeatherIcons-main/SVG/2nd Set - Color/' + weatherConditions + '.svg';
    // weatherIcon.src = `./assets/images/WeatherIcons-main/SVG/2nd Set - Color/${weatherConditions}` + ".svg";
    weatherIcon.style.width = '30px'; // Set the width in pixels or any other unit
    weatherIcon.style.height = '30px'; // Set the height in pixels or any other unit
    currentDayTemp.textContent = 'Temp: ' + data.currentConditions.temp + '°C';
    currentDayHumidity.textContent = 'Humidity: ' + data.currentConditions.humidity + '%';
    currentDayWind.textContent = 'Wind: ' + data.currentConditions.windspeed + 'kph';
    currentDayWindDirection.textContent = 'Wind Direction: ' + data.currentConditions.winddir + 'degrees';
    // weatherContainer.appendChild(currentForecastContent);
    currentDayWeather.appendChild(currentDayTemp);
    currentDayWeather.appendChild(currentDayHumidity);
    currentDayWeather.appendChild(currentDayWind);
    currentDayWeather.appendChild(currentDayWindDirection);
    currentDayWeather.appendChild(weatherIcon);


    //end of current day dinamically

/*     // Get the current weather icon element if it exists
    var existingWeatherIcon = document.getElementById('weather-icon');

    // If the existing icon element exists, remove it
    if (existingWeatherIcon) {
        existingWeatherIcon.parentNode.removeChild(existingWeatherIcon);
    } */

/*     var weatherConditions = data.currentConditions.icon;
    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute('id', 'weather-icon');
    var weatherImage = document.getElementById('weather-icon');
    weatherIcon.src = `./assets/images/WeatherIcons-main/SVG/2nd Set - Color/${weatherConditions}` + ".svg";
    currentDayWeather.appendChild(weatherIcon);
    weatherIcon.style.width = '30px'; // Set the width in pixels or any other unit
    weatherIcon.style.height = '30px'; // Set the height in pixels or any other unit
    temp.textContent = 'Temp: ' + data.currentConditions.temp + '°C';
    humidity.textContent = 'Humidity: ' + data.currentConditions.humidity + '%';
    wind.textContent = 'Wind: ' + data.currentConditions.windspeed + 'kph';
    windDirection.textContent = 'Wind Direction: ' + data.currentConditions.winddir + 'degrees'; */
    inputCity.value='';
    nextHoursForecast(data.latitude, data.longitude);
    sevenDayForecast(data.latitude, data.longitude);
  });

}


function nextHoursForecast(lat, lon){
  console.log(lat, lon);
  var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + lat + "," + lon + "?key=" + weatherApiKey + "&unitGroup=metric";
  // var queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${weatherApiKey}&unitGroup=metric`;

  console.log(queryUrl);
  fetch(queryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    var forecastList = data.days[0].hours;
    console.log(forecastList);

    for (var i = 0; i < 23; i = i + 1) {
      var nextHoursForecastContent = document.createElement('div');
      nextHoursForecastContent.classList.add('hourly-forecast');
      var nextHourTime = document.createElement('div');
      var nextHoursTemp = document.createElement('div');
      var nextHoursHumidity = document.createElement('div');
      var nextHoursWind = document.createElement('div');
      var nextHoursWindDirection = document.createElement('div');
      var rawDate = forecastList[i].datetime;
      var formattedDate = new Date(rawDate).toLocaleDateString('en-US', {hour: 'numeric', minute: 'numeric'}); //change to actual hours rather than date


      var weatherConditions = forecastList[i].icon;
      var weatherIcon = document.createElement('img');
      weatherIcon.setAttribute('id', 'weather-icon');
      var weatherImage = document.getElementById('weather-icon');
      weatherIcon.src = './assets/images/WeatherIcons-main/SVG/2nd Set - Color/' + weatherConditions + '.svg';
      // weatherIcon.src = `./assets/images/WeatherIcons-main/SVG/2nd Set - Color/${weatherConditions}` + ".svg";
      weatherIcon.style.width = '30px'; // Set the width in pixels or any other unit
      weatherIcon.style.height = '30px'; // Set the height in pixels or any other unit


      nextHourTime.textContent = formattedDate;
      nextHoursTemp.textContent = 'Temp: ' + forecastList[i].temp + '°C';
      nextHoursHumidity.textContent = 'Humidity: ' + forecastList[i].humidity + '%';
      nextHoursWind.textContent = 'Wind: ' + forecastList[i].windspeed + 'kph';``
      nextHoursWindDirection.textContent = 'Wind Direction ' + forecastList[i].winddir + 'degrees';
      nextHoursForecastContent.appendChild(nextHourTime);
      nextHoursForecastContent.appendChild(nextHoursTemp);
      nextHoursForecastContent.appendChild(nextHoursHumidity);
      nextHoursForecastContent.appendChild(nextHoursWind);
      nextHoursForecastContent.appendChild(nextHoursWindDirection);
      nextHoursForecastContent.appendChild(weatherIcon);

      nextHoursWeather.appendChild(nextHoursForecastContent);
      console.log(data.length);
    }
  });
}



  function sevenDayForecast(lat, lon){
    console.log(lat, lon);
    var queryUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + lat + "," + lon + "?key=" + weatherApiKey + "&unitGroup=metric";
    // var queryUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${weatherApiKey}&unitGroup=metric`;

    console.log(queryUrl);
    fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

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
        // weatherIcon.src = `./assets/images/WeatherIcons-main/SVG/2nd Set - Color/${weatherConditions}` + ".svg";
        weatherIcon.style.width = '30px'; // Set the width in pixels or any other unit
        weatherIcon.style.height = '30px'; // Set the height in pixels or any other unit


        nextDaysDate.textContent = formattedDate;
        nextDaysTemp.textContent = 'Temp: ' + forecastList[i].temp + '°C';
        nextDaysHumidity.textContent = 'Humidity: ' + forecastList[i].humidity + '%';
        nextDaysWind.textContent = 'Wind: ' + forecastList[i].windspeed + 'kph';``
        nextDaysWindDirection.textContent = 'Wind Direction ' + forecastList[i].winddir + 'degrees';
        dailyForecastContent.appendChild(nextDaysDate);
        dailyForecastContent.appendChild(nextDaysTemp);
        dailyForecastContent.appendChild(nextDaysHumidity);
        dailyForecastContent.appendChild(nextDaysWind);
        dailyForecastContent.appendChild(nextDaysWindDirection);
        dailyForecastContent.appendChild(weatherIcon);

        nextDays.appendChild(dailyForecastContent);
        // console.log(data.length);
      }
    });
  }

  fetchButton.addEventListener('click', getApi);
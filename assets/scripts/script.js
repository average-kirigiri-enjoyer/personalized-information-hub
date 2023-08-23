/*
ethan (average-kirigiri-enjoyer), WesleyHAS, Stavros Panagiotopoulos (stavrospana)
SCS Boot Camp Project 1 Group 1 - Personal Information Hub
Created 2023/08/15
Last Edited 2023/08/23
*/

/* Ethan's code here */

//NEXT TO DO
//add traversing between months
//add zooming between months & years
//add traversing between years
//add event creation
//add event deletion
//add saving events to local storage
//add removing events from local storage

//gets references to HTML elements necessary for event tracker functionality
var traverseLeft = $("#traverse-left");
var traverseRight = $("#traverse-right");
var zoomIn = $("#zoom-in");
var zoomOut = $("#zoom-out");
var rowThree = $("#row-3")
var rowFour = $("#row-4")
var rowFive = $("#row-5")
var rowSix = $("#row-6")
var monthlyRows = $(".monthly-row");
var nonYearlyRows = $(".non-yearly-row");

//variables for event tracker functionality
var traverseDays = 0;
var eventView = "weekly";
var forLoopCycles;

//function to determine how many iterations the for loop will run for
function setUpEventCalendar()
{
  //determine how many event blocks to display based on zoom level
  if (eventView === "weekly") //displays 14 blocks across two rows if event view is set to weekly
  {
    monthlyRows.attr("style", "display: none");
    forLoopCycles = 14;
  }
  else if (eventView === "monthly") //displays 28-42 blocks if event view is set to monthly
  {
    var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner

    if (dayjs(lastDayOfFirstRow).daysInMonth() === 28 && dayjs(lastDayOfFirstRow).startOf("month").day() === 0)
    {
      //if there are 28 days in current month & month starts on sunday, run for 28 iterations across four rows
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: none");
      rowSix.attr("style", "display: none");
      forLoopCycles = 28;
    }
    else if ((dayjs(lastDayOfFirstRow).daysInMonth() >= 30 && dayjs(lastDayOfFirstRow).startOf("month").day() === 6)
           ||(dayjs(lastDayOfFirstRow).daysInMonth() === 31 && dayjs(lastDayOfFirstRow).startOf("month").day() === 5))
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
  else //displays 365 event blocks (366 on a leap year) if event view is set to yearly
  {
    //for yearly view, have three rows with four divs each (three rows of four months)
    //each month div has seven divs within composed of equally-sized columns (one for each day of the week)
    //12 for loops (one for each month) adds vertically-stacking dates to each day-of-the-week div sequentially
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

    //https://day.js.org/docs/en/plugin/day-of-year -> DAY OF YEAR PLUGIN

    //when checking if a date in the yearly view should be highlighted, check if a local storage entry
    //exists for the date ID assigned to that date
    //use day numbers instead of dots for yearly view, changing the colour of the text for those with events

    //HIDE NON-YEARLY ROWS
    //DISPLAY ROW 3
    
  }
}

//SPLIT CALCULATE LOOP & RENDER ROW FUNCTIONS BELOW
/*
//function to determine how many iterations the for loop will run for
function calculateLoopLength()
{
  //determine how many event blocks to display based on zoom level
  if (eventView === "weekly") //displays 14 blocks across two rows if event view is set to weekly
  {
    monthlyRows.attr("style", "display: none");
    forLoopCycles = 14;
  }
  else if (eventView === "monthly") //displays 28-42 blocks if event view is set to monthly
  {
    var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner

    if (dayjs(lastDayOfFirstRow).daysInMonth() === 28 && dayjs(lastDayOfFirstRow).startOf("month").day() === 0)
    {
      //if there are 28 days in current month & month starts on sunday, run for 28 iterations across four rows
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: none");
      rowSix.attr("style", "display: none");
      forLoopCycles = 28;
    }
    else if ((dayjs(lastDayOfFirstRow).daysInMonth() >= 30 && dayjs(lastDayOfFirstRow).startOf("month").day() === 6)
           ||(dayjs(lastDayOfFirstRow).daysInMonth() === 31 && dayjs(lastDayOfFirstRow).startOf("month").day() === 5))
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
  else //displays 365 event blocks (366 on a leap year) if event view is set to yearly
  {
    //for yearly view, have three rows with four divs each (three rows of four months)
    //each month div has seven divs within composed of equally-sized columns (one for each day of the week)
    //12 for loops (one for each month) adds vertically-stacking dates to each day-of-the-week div sequentially
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

    //https://day.js.org/docs/en/plugin/day-of-year -> DAY OF YEAR PLUGIN

    //when checking if a date in the yearly view should be highlighted, check if a local storage entry
    //exists for the date ID assigned to that date
    //use day numbers instead of dots for yearly view, changing the colour of the text for those with events

    //HIDE NON-YEARLY ROWS
    //DISPLAY ROW 3
    
  }
}

//function to determine how many rows of events to display
function updateRowVisibility()
{
  if (eventView === "weekly") //displays two rows if event view is set to weekly
  {
    monthlyRows.attr("style", "display: none");
    forLoopCycles = 14;
  }
  else if (eventView === "monthly") //displays four to six rows if event view is set to monthly
  {
    var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner

    if (dayjs(lastDayOfFirstRow).daysInMonth() === 28 && dayjs(lastDayOfFirstRow).startOf("month").day() === 0)
    {
      //if there are 28 days in current month & month starts on sunday, display four rows
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: none");
      rowSix.attr("style", "display: none");
    }
    else if ((dayjs(lastDayOfFirstRow).daysInMonth() >= 30 && dayjs(lastDayOfFirstRow).startOf("month").day() === 6)
           ||(dayjs(lastDayOfFirstRow).daysInMonth() === 31 && dayjs(lastDayOfFirstRow).startOf("month").day() === 5))
    {
      //if there are at least 30 days in current month & month starts on saturday
      //OR if there are 31 days in current month & month starts on friday, display six rows
      monthlyRows.attr("style", "display: block");
    }
    else //otherwise, display five rows
    {
      rowThree.attr("style", "display: block");
      rowFour.attr("style", "display: block");
      rowFive.attr("style", "display: block");
      rowSix.attr("style", "display: none");
    }
  }
}*/

//function render event calendar content
function renderEventPlanner()
{
  //HEY ETHAN, YOU WILL PROBABLY PUT AN IF STATEMENT HERE TO CHANGE HOW EVENTBLOCKS IS DEFINED IN THE YEARLY VIEW, AS YOU'LL HAVE TO GET THE CHILDREN OF EACH MONTH
  //CONSIDER HAVING ALL THE BLOCKS IN PLACE IN HTML, AND INSTEAD OF USING EVENTBLOCKS.LENGTH IN THE FOR LOOP,
  //YOU DO DAY < 14 FOR THE (BI)-WEEKLY VIEW, ETC... FOR MONTHS & YEARS
  var eventBlocks = $(".event-row").children();

  //determines how many iterations the upcoming for loop will run for, and how many rows of event blocks will be displayed
  setUpEventCalendar();

  //dayjs(dayjs().date(1)).format("ddd") -> day of week for first day of month

  //https://jqueryui.com/datepicker/ -> datepicker widget

  //THIS SECTION BELOW SHOULD ONLY APPLY TO 
  //assigns an ID to each block such that they will represent consecutive days of the week, starting at the most recent sunday
  for (day = 0; day < forLoopCycles; day++)
  {
    var block = $(eventBlocks[day]);

    //date of block is adjusted such that blocks will go from sunday -> saturday
    //shifted forward / backward based on how many times the user has clicked the traverse buttons and in which direction
    var date = dayjs().add(day + traverseDays - dayjs().day(), "d").format("YYYY/MM/D");
    block.attr("id", date)

    //removes the year and month from date string and sets the block's date text to that
    block.children(".date").text(date.slice(8))
  }
}

//function to manage traversing event blocks using left & right buttons
function traverseBlocks(direction)
{
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
    }
  }

  renderEventPlanner();
}

//function to change zoom level of event view
function switchEventZoom(zoomButton)
{
  //preserve how far the user has traversed when zooming in / out
    //convert variable based on factor of time difference between weeks / months / years (e.g. x / 12 when going months -> years)(?)
    //get dayJS of any visible day and use it as an anchor point(?)
    //check to see if you can use get + set methods in dayJS or some sort of extension for this
  //try dividing traverseDays by factor difference between weeks -> months / months -> years & then truncating
  
  if (zoomButton === "out") //checks if the user clicked the zoom out button
  {
    if (eventView === "weekly") //if the planner is currently in weekly view, switch to monthly view
    {
      var sundayOfThisWeek = dayjs().startOf("week"); //retrieves this week's sunday
      var lastDayOfFirstRow = $("#row-1").children()[6].id; //retrieves ID (date) of last day in first row of event planner
      var monthOfLastDay = dayjs(lastDayOfFirstRow).startOf("month"); //retrieves first day of month containing lastDayOfFirstRow
      var sundayOfMonthStart = dayjs(monthOfLastDay).startOf("week"); //retrieves sunday of week containing monthOfLastDay
      
      //changes traverseDays such that calendar will start at the week containing first day of the month currently being viewed
      traverseDays = sundayOfMonthStart.diff(sundayOfThisWeek, "day");

      eventView = "monthly"
    }
    else if (eventView === "monthly") //if the planner is currently in monthly view, switch to yearly view
    {
      eventView = "yearly"
    }
  }
  else //if they did not, then they clicked the zoom in button
  {
    if (eventView === "yearly") //if the planner is currently in yearly view, switch to monthly view
    {
      eventView = "monthly"
    }
    else if (eventView === "monthly") //if the planner is currently in monthly view, switch to weekly view
    {
      eventView = "weekly"
    }
  }

  renderEventPlanner();
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

console.log('HELLO HELLO HELLO HELLO HELLO!!?!??!')
/* Wesley's code here */

console.log('YAYYYYYYY!');
console.log('Next line');
console.log('Stavros');

/*
GLOBAL VARIABLES
*/
var bikes = new Array();
var showLargeIcons = false;
var timer = 1800000;
var upperButtonStatus = 'scan';
var lowerButtonStatus = 'reserve';
var countUpActive = false;



/*
BIKES
*/
for (let i = 0; i < BikesPos.length; i++)
{
    let bike = new Bike(i);

    // pick random name
    let name = BikeNames[Math.floor(Math.random() * BikeNames.length)];
    bike.name = name;

    // pick random image
    let image = BikeImagesUrls[Math.floor(Math.random() * BikeImagesUrls.length)];
    bike.image = image;

    // pick random battery value from low, medium & full
    let batteryStatus = BatteryClasses[Math.floor(Math.random() * BatteryClasses.length)];
    bike.classList.push(batteryStatus);

    bike.generate();
    bikes.push(bike);
}

function updateBikeIcons()
{
    // determine if icon update is needed
    let iconUpdateNeeded = (map.getZoom() > 17) != showLargeIcons;

    if (iconUpdateNeeded)
    {
        showLargeIcons = !showLargeIcons;

        // change icon for every bike except focus
        bikes.filter(bike => bike.iconStyle != IconStyle.focus).forEach(bike =>
        { 
            bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small)
            bike.updateIcon();
        });
    }
}



/*
EVENTS
*/
map.on('click', closeDetailpanel);

// update icons depending on zoom level
map.on('zoomend', updateBikeIcons);



/*
DETAILS PANEL
*/
function modifyDetailpanel()
{
    // bike title
    document.getElementById("title").innerHTML = getFocusedBike().name;

    // bike image
    document.getElementById("image").src = getFocusedBike().image;    
}

function openDetailpanel()
{
    // zoom in on detailed bike if too far out
    let bikePos = getFocusedBike().pos;
    if (map.getZoom() <= 17)
    {
        map.flyTo(bikePos, 19, {
            animate: true,
            duration: 1
        });
    }
    
    // change text on upper button
    if (upperButtonStatus == 'scan')
    {
        document.getElementById('upperButton').innerHTML = '<i class="fa fa-qrcode"></i><span> Scan to ride</span>';
    }
    
    // make details panel visible
    setClassVisibility("bottombar", true)
}

function closeDetailpanel()
{
    setClassVisibility("bottombar", false)
    
    // change icon for previous focus bike
    bikes.filter(bike => bike.iconStyle == IconStyle.focus && lowerButtonStatus == 'reserve').forEach(bike =>
        { 
            bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small)
            bike.updateIcon();
        });

    switch (upperButtonStatus) {
        case 'ride':
            // change back to scan button on ride window
            upperButtonStatus = 'scan';
            updateUpperButton()    
            break;

        case 'scan':
            // change text on upper button
            document.getElementById('upperButton').innerHTML = '<i class="fa fa-qrcode"></i><span> Scan</span>';        
    
        default:
            break;
    }
}



/*
SIDE PANEL
*/
function openUserpanel()
{
    setClassVisibility("sidebar", true);
    setClassVisibility("map-blur", true);
}

function closeUserpanel()
{
    setClassVisibility("sidebar", false);
    setClassVisibility("map-blur", false);
}

function setClassVisibility(className, visible)
{
    let classToAdd = visible ? `${className}-visible` : `${className}-hidden`;
    let classToRemove = !visible ? `${className}-visible` : `${className}-hidden`;
    
    Array.from(document.getElementsByClassName(className)).forEach((element) => {
        element.classList.add(classToAdd);
        element.classList.remove(classToRemove);
    });
}



/*
UPPER BUTTON
*/

function upperButtonClick()
{
    switch (upperButtonStatus) {
        case 'scan':
            openCamera();
            break;
        case 'ride':
            alert("google payment");
            upperButtonStatus = 'unlock';
            lowerButtonStatus = 'release';
            updateButtons();
            break;
        case 'unlock':
            upperButtonStatus = 'lock';
            updateUpperButton();
            break;
        case 'lock':
            upperButtonStatus = 'unlock';
            updateUpperButton();
            break;
        default:
            break;
    }
}

function updateUpperButton()
{
    let upperButton = document.getElementById('upperButton');

    // change appearance
    ['scan', 'ride', 'unlock', 'lock'].forEach(classToRemove => upperButton.classList.remove(classToRemove));
    upperButton.classList.add(upperButtonStatus);

    // change text
    switch (upperButtonStatus) {
        case 'scan':
            upperButton.innerHTML = '<i class="fa fa-qrcode"></i><span> Scan</span>';
            break;
        case 'ride':
            upperButton.innerHTML = '<span>Ride<span>'
            break;
        case 'unlock':
            upperButton.innerHTML = '<i class="fa fa-unlock-alt"></i><span> Unlocked</span>';
            break;
        case 'lock':
            upperButton.innerHTML = '<i class="fa fa-lock"></i><span> Locked</span>'
            break;
        default:
            break;
    }
}

function openCamera()
{
    // open camera panel
    Array.from(document.getElementsByClassName('camera')).forEach((element) => {
        element.style.visibility = "visible";
    });
}

function closeCamera()
{
    // close camera panel
    Array.from(document.getElementsByClassName('camera')).forEach((element) => {
        element.style.visibility = "hidden";
    });

    // fly to focused bike
    let bike = getFocusedBike();
    if (bike == null)
    {
        bike = bikes[Math.floor(Math.random() * bikes.length)];
        bike.setFocus();
    }
    map.flyTo(bike.pos, 19, { animate: true });

    // transform upper button to ride button
    console.log(upperButtonStatus);
    upperButtonStatus = 'ride';
    updateUpperButton();
}



/*
LOWER BUTTON
*/
function lowerButtonClick()
{
    switch (lowerButtonStatus) {
        case 'reserve':
            lowerButtonStatus = 'cancel';
            updateLowerButton();
            break;
        case 'cancel':
            lowerButtonStatus = 'reserve';
            updateLowerButton();
            break;
        case 'release':
            upperButtonStatus = 'scan'
            lowerButtonStatus = 'reserve';
            updateButtons();
            alert("payment info");
            break;
        default:
            break;
    }
}

function updateLowerButton()
{
    let lowerButton = document.getElementById('lowerButton');
    ['reserve', 'cancel', 'release'].forEach(classToRemove => lowerButton.classList.remove(classToRemove));
    lowerButton.classList.add(lowerButtonStatus);

    switch (lowerButtonStatus) {
        case 'reserve':
            lowerButton.innerHTML = '<div class="title">Reserve</div><div class="description">Free for 30 minutes</div>';
            countUpActive = false;
            mins = 0;
            secs = 0;
            break;
            
        case 'cancel':
            lowerButton.innerHTML = '<div class="title"><div class="title">Reserved for <span id="timer"></span></div><div class="description">Click to cancel</div></div>';
            el = document.getElementById("timer"),
            countUpActive = false;
            mins = 30;
            secs = 0;
            countDown();
            break;
            
        case 'release':
            lowerButton.innerHTML = '<div class="title">Release</div><div class="description"><span id="timer"></span></div>';
            el = document.getElementById("timer"),
            countUpActive = true;
            mins = 0;
            secs = 1;
            countUp();
            break;
        
        default:
            break;
    }
}



/*
TIMER
*/
var el, mins, secs;

function countDown()
{
    if (countUpActive) return;

    if (secs || mins) {
      setTimeout(countDown, 1000);
    }
    el.innerHTML = mins + ":" + (secs.toString().length < 2 ? "0" + secs : secs); // Pad number

    secs -= 1;
    if (secs < 0) {
      mins -= 1;
      secs = 59;
    }
}

function countUp()
{
    if (secs || mins) {
      setTimeout(countUp, 1000);
    }
    el.innerHTML = mins + ":" + (secs.toString().length < 2 ? "0" + secs : secs); // Pad number

    secs += 1;
    if (secs > 59) {
      mins += 1;
      secs = 0;
    }
}



/*
HELPER FUNCTIONS
*/
function bikeReservedOrRidden()
{
    return lowerButtonStatus != 'reserve';
}

function getFocusedBike()
{
    return bikes.filter(bike => bike.iconStyle == IconStyle.focus)[0];
}

function updateButtons()
{
    updateUpperButton();
    updateLowerButton();
}



/*
SWIPE FUNCTIONALITY
*/
let touchstartY = 0;
let touchendY = 0;
const bottombar = document.getElementById('bottombar');

function handleGesture()
{
    if (touchendY < touchstartY
        && bikeReservedOrRidden())
        {
            openDetailpanel();
        }
    if (touchendY > touchstartY)
    {
        closeDetailpanel();    
    }
};

bottombar.addEventListener('touchstart', e => {
    touchstartY = e.changedTouches[0].screenY;
});

bottombar.addEventListener('touchend', e => {
  touchendY = e.changedTouches[0].screenY;
  handleGesture();
});
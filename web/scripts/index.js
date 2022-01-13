/*
GLOBAL VARIABLES
*/
var bikes = new Array();
var showLargeIcons = false;
var timer = 1800000;
var bikeReserved = false;
var bikeLocked = false;



/*
ICONS
*/
// bikes
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



/*
EVENTS
*/
// update icons depending on zoom level
map.on('zoomend', updateBikeIcons);

map.on('click', closeDetailpanel);



/*
HELPER FUNCTIONS
*/
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

function modifyDetailpanel()
{
    // bike title
    document.getElementById("title").innerHTML =
        bikes.filter(bike => bike.iconStyle == IconStyle.focus)[0].name;

    // bike image
    document.getElementById("image").src =
        bikes.filter(bike => bike.iconStyle == IconStyle.focus)[0].image;

    // reserve timer
    // do something...
    
}
function countTimer()
{

}

window.setInterval(countTimer, 1800000);

function openDetailpanel()
{
    // make details panel visible
    setClassVisibility("bottombar", true)

    // zoom in on detailed bike if too far out
    let bikePos = bikes.filter(bike => bike.iconStyle == IconStyle.focus)[0].pos;

    if (map.getZoom() <= 17)
    {
        map.flyTo(bikePos, 19, {
            animate: true,
            duration: 1
        });
    }

}

function closeDetailpanel()
{
    setClassVisibility("bottombar", false)
    
    // change icon for previous focus bike
    bikes.filter(bike => bike.iconStyle == IconStyle.focus && !bikeReserved).forEach(bike =>
        { 
            bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small)
            bike.updateIcon();
        });
}

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

function upperButtonClick()
{
    if (bikeReserved)
    {
        bikeLocked = !bikeLocked;

        let upperButton = document.getElementById('upperButton');
        upperButton.innerHTML = bikeLocked
            ? '<i class="fa fa-lock"></i><span> Locked</span>'
            : '<i class="fa fa-unlock-alt"></i><span> Unlocked</span>'
    }
    else
    {
        openCamera();
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

    // focus random bike
    let bike = bikes[Math.floor(Math.random() * bikes.length)];
    
    bike.setFocus();
    map.flyTo(bike.pos, 19, {
        animate: true,
        duration: 1
    });
}

function lowerButtonClick()
{
    bikeReserved = !bikeReserved;
    if (!bikeReserved)
    {
        // money pay
        alert('test');
    }

    // change button appearence
    changeLowerButton();
    changeUpperButton();
}

function changeLowerButton()
{
    let classToAdd = bikeReserved ? 'release' : 'reserve';
    let classToRemove = !bikeReserved ? 'release' : 'reserve';

    let upperButton = document.getElementById('lowerButton');
    upperButton.classList.add(classToAdd);
    upperButton.classList.remove(classToRemove);

    upperButton.innerHTML = bikeReserved
        ? '<div class="title">Release</div>'
        : '<div class="title">Reserve</div><div class="description">Free for 30 minutes</div>';
}

function changeUpperButton()
{
    let classToAdd = bikeReserved ? 'lock' : 'scan';
    let classToRemove = !bikeReserved ? 'lock' : 'scan';

    let upperButton = document.getElementById('upperButton');
    upperButton.classList.add(classToAdd);
    upperButton.classList.remove(classToRemove);

    upperButton.innerHTML = bikeReserved
        ? '<i class="fa fa-unlock-alt"></i><span> Unlocked</span>'
        : '<i class="fa fa-qrcode"></i><span> Scan</span>';
}
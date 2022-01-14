/*
CONSTANTS
*/
const IconStyle = Object.freeze({
    small: 0,
    large: 1,
    focus: 2
});
const BikeNames = [
    'BABBOE',
    'BROMPTON ELECTRIC',
    'CARQON',
    'cannondale',
    'corratec',
    'Electra BICYCLE',
    'FOCUS',
    'Gazelle',
    'GIANT',
    'Gocycle',
    'HAIBIKE',
    'HASE BIKES',
    'hercules',
    'Husqvarna',
    'Liv',
    'M1',
    'pfautec',
    'RIESE & MÜLLER',
    'STROMER',
    'TrioBike',
    'XCYC bikes',
    'CHRISSON',
    'Zündapp',
    'Vivi',
];
const BikeImagesUrls = [
    'https://cdn.shopify.com/s/files/1/0255/9528/1483/products/himiway-escape1_1800x1800.jpg?v=1612082030',
    'https://www.geekmaxi.com/img/p/1/1/4/5/6/11456-large_default.jpg',
    'https://www.ubuy.co.it/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNjE1QkV1VDFzOVMuX0FDX1NMMTAwMF8uanBn.jpg',
    'https://www.ubuy.com.jo/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNzF1dXpuLVJ1TUwuX0FDX1NMMTUwMF8uanBn.jpg',
    'https://www.agogs.com/uploads/products/6/big/cityliner-easy.png',
    'https://media.istockphoto.com/photos/electric-bicycle-isolated-on-white-picture-id1298430084?b=1&k=20&m=1298430084&s=170667a&w=0&h=uZvKJ80c9m0hsuJoozTdSksyjlLVGprNowXougse-bc=',
    'https://m.media-amazon.com/images/I/81UuPi0JjYL._AC_SX425_.jpg',
];
const BatteryClasses = ['fullBattery', 'mediumBattery', 'lowBattery'];
const BikeIconFocusUrl = 'src/bike_icon_focus.png';
const BikeIconLargeUrl = 'src/bike_icon_default.png';
const BikeIconSmallUrl = 'src/white.png';



class Bike {
    constructor(id)
    {
        this.id = id;
        this.pos = BikesPos[this.id];
        this.name;
        this.url;
        this.classList = ['bikeIcon', 'bikeIconSmall']
        this.marker;
        this.iconStyle;
    }

    setIconStyle(iconStyle)
    {
        // set icon style
        this.iconStyle = iconStyle;

        // remove every icon style from classlist
        ['bikeIconSmall', 'bikeIconLarge', 'bikeIconFocus'].forEach(style =>
        {
            const index = this.classList.indexOf(style);
            if (index > -1)
            {
                this.classList.splice(index, 1);
            }
        })
        
        // add icon style to classlist
        switch (this.iconStyle)
        {
            case IconStyle.small:
                this.classList.push('bikeIconSmall')
                break;
            case IconStyle.large:
                this.classList.push('bikeIconLarge')
                break;
            case IconStyle.focus:
                this.classList.push('bikeIconFocus')
                break;
            default:
                break;
        }
    }

    updateIcon()
    {
        // set icon (destroyes classlist)
        switch (this.iconStyle) {
            case IconStyle.small:
                this.marker.setIcon(new BikeIconSmall());
                break;
            case IconStyle.large:
                this.marker.setIcon(new BikeIconLarge());
                break;
            case IconStyle.focus:
                    this.marker.setIcon(new BikeIconFocus());
                    break;
            default:
                break;
        }

        // restore classlist
        this.classList.forEach(className => { this.marker._icon.classList.add(className) });
    }
    
    setFocus()
    {
        if (this.iconStyle != IconStyle.focus && bikeReservedOrRidden())
        {
            return;
        }

        let otherBikes = bikes.filter(bike => bike != this);

        // move marker to front (all others to back)
        this.marker.setZIndexOffset(1000);
        otherBikes.forEach(bike => bike.marker.setZIndexOffset(0));

        // set icon styles
        this.setIconStyle(IconStyle.focus);
        otherBikes.forEach(bike => bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small))
        bikes.forEach(bike => bike.updateIcon());

        modifyDetailpanel();
        openDetailpanel();
    }
    
    generate()
    {
        // create marker with the custom classlist
        this.marker = L.marker(this.pos, { icon: new BikeIconSmall({ className: this.classList.join(' ') }) });
        
        // add markers to map
        this.marker
            .addTo(map)
            .on('click', this.setFocus.bind(this));
    }
}



/*
ICONS
*/
var BikeIconFocus = L.Icon.extend({
    options: {
        iconUrl: BikeIconFocusUrl,
        iconSize:     [40, 40],
        iconAnchor:   [20, 20]
    }
});
var BikeIconLarge = L.Icon.extend({
    options: {
        iconUrl: BikeIconLargeUrl,
        iconSize:     [40, 40],
        iconAnchor:   [20, 20]
    }
});

var BikeIconSmall = L.Icon.extend({
    options: {
        iconUrl: BikeIconSmallUrl,
        iconSize:     [10, 10],
        iconAnchor:   [5, 5]
    }
});
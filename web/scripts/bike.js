const IconStyle = Object.freeze({
    small: 0,
    large: 1,
    focus: 2
});

class Bike {
    constructor(id)
    {
        this.id = id;
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
        let otherBikes = bikes.filter(bike => bike != this);

        // move marker to front (all others to back)
        this.marker.setZIndexOffset(1000);
        otherBikes.forEach(bike => bike.marker.setZIndexOffset(0));

        // set icon styles
        this.setIconStyle(IconStyle.focus);
        otherBikes.forEach(bike => bike.setIconStyle(showLargeIcons ? IconStyle.large : IconStyle.small))

        bikes.forEach(bike => bike.updateIcon());
        openDetailpanel();
    }
    
    generate()
    {
        // create marker with the custom classlist
        this.marker = L.marker(BikesPos[this.id], { icon: new BikeIconSmall({ className: this.classList.join(' ') }) });
        
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
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Circle-icons-bike.svg/2048px-Circle-icons-bike.svg.png',
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

var AvatarIcon = L.Icon.extend({
    options: {
        className: 'avatar',
        iconUrl: AvatarIconUrl,
        iconSize:     [10, 10],
        iconAnchor:   [5, 5]
    }
});
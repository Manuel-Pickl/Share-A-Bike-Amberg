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
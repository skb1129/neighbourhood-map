var locations = [{
        title: 'Fortis Hospital Mohali',
        position: {
            lat: 30.694489,
            lng: 76.730804
        }
    },
    {
        title: 'P.C.A. Stadium',
        position: {
            lat: 30.690889,
            lng: 76.737531
        }
    },
    {
        title: 'Domino\'s Pizza',
        position: {
            lat: 30.687413,
            lng: 76.737783
        }
    },
    {
        title: 'Gurudwara Sri Amb Sahib',
        position: {
            lat: 30.699110,
            lng: 76.732414
        }
    },
    {
        title: 'Forest Complex',
        position: {
            lat: 30.690370,
            lng: 76.728193
        }
    },
    {
        title: 'Model Jail Chandigarh',
        position: {
            lat: 30.702056,
            lng: 76.741982
        }
    }
];

// This function sets off the map and applies knockout bindings.
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.6961978,
            lng: 76.7380951
        },
        zoom: 15
    });
    var infowindow = new google.maps.InfoWindow();
    ko.applyBindings(new controller(map, infowindow));
}

// Controller or ViewModel of Knockout JS.
function controller(map, infowindow) {
    var self = this;

	// Loop Control variable.
	var index, marker;
    self.search_val = ko.observable();
    self.markers = ko.observableArray([]);

    // Loop to create markers for data in locations model.
    for (index = 0; index < locations.length; index++) {
        marker = new google.maps.Marker({
            map: map,
            position: locations[index].position,
            title: locations[index].title,
            animation: google.maps.Animation.DROP,
            show: ko.observable(true)
        });

        self.markers.push(marker);
    }

    // This function filters for searches.
    self.search = function() {
        var filter = self.search_val().toLowerCase();
        for (index = 0; index < locations.length; index++) {
            marker = self.markers()[index];
            if (marker.getTitle().toLowerCase().indexOf(filter) > -1) {
                marker.setVisible(true);
                marker.show(true);
            } else {
                marker.setVisible(false);
                marker.show(false);
            }
        }
    };

    // This function triggers the marker click event.
    self.openWindow = function(marker) {
        google.maps.event.trigger(marker, 'click');
    };

    // This function adds click listener to the markers and opens an info window.
    for (index = 0; index < self.markers().length; index++) {
        marker = self.markers()[index];

        // Creates a click event listener to open infowindow.
        marker.addListener('click', setInfoWindow(map, marker, infowindow));
    }
}

// This function sets the content inside the infowindow.
function setInfoWindow(map, marker, infowindow) {
	return function() {
		// NYT API custom url.
		var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.getTitle() + '&sort=newest&api-key=6635ce8912434e2fb186f8ffc49b8335';

		// Accessing NYT's API to fetch articles as JSON and set infowindow content.
		$.getJSON(nytimesUrl, function(data) {
			var articles = data.response.docs;
			var content = '<p><b>' + marker.getTitle() + '</b></p><ul>';
			for (var i = 0; i < articles.length; i++) {
				content += '<li><a href="' + articles[i].web_url + '" target="_blank">NYT-Article ' + (i + 1) + '</a></li>';
			}
			if (!(articles.length)) {
				content += '<li>No Articles Found</li>';
			}
			content += '</ul>';
			infowindow.setContent(content);
		}).fail(function(e) {
			var content = '<p><b>' + marker.getTitle() + '</b></p><p>New York Times Articles Could Not Be Loaded</p>';
			infowindow.setContent(content);
		});
		infowindow.open(map, marker);

		// Create one bounce Animation on click.
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
			marker.setAnimation(null);
		}, 700);
	};
}

function mapError() {
	window.alert('Unable to Load Google Maps API.');
}

// jQuery sidebar toggle event listener.
$('#menu-toggle').click(function(e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
    $(this).toggleClass('fa-angle-right fa-angle-left');
});

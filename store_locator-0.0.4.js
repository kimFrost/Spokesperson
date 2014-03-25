/**-------------------------
 Store locator v0.0.4
-------------------------**/
;(function ( $, window, document, undefined ) {
	// Load the map API
	//google.load("maps","3.9", {"other_params":"client=gme-222&sensor=false"});
/**---------------------------------------
	Widget 
---------------------------------------**/
    $.widget( "loyalitetsbureauet.storeLocator" , {
    	//Parameter map for functions
    	default_options : {
			complete: null,
			e: null,
			obj: null,
			json: null,
			array: null,
			boolean: null,
			string: null,
			index: null,
			special: null
		},
        //Default Options which can be overriden.
        options: {
			'apiKey' : null,
			'width' : '100%',
			'height': 400,
			'dataPoints' : [
				{lang:null,long:null,storeName:null, storeInfo:null, storeReg:null, storeWebsite:null, storeDealer:null ,storeHtmlContent:null, },
			],
			'storeZoomLevel' : null,
			'iconImage' : null,
			'zoomStartLevel' : 6
        },
/**---------------------------------------
	Create & Init
---------------------------------------**/
        _create: function () {
        	var base = this;
        	
        	//create element data
        	base.element.data('storeLocator',{
        		options: $.extend(true,[],base.options),
        		map: null,
        		mapData: null,
        		width: 0,
        		height: 0,
        		infoWindow: new google.maps.InfoWindow(),
        		mapOptions: {
        			zoom: base.options.zoomStartLevel,
					center: new google.maps.LatLng(56.2, 10.327148),
					mapTypeId: google.maps.MapTypeId.ROADMAP    
        		}
        	});
        	
            base._setup({complete:function(){
            	//run this on complete setup	
            }});
        },
        _init: function () {
		 	
		},
/**---------------------------------------
	_setup
---------------------------------------**/			
		_setup: function(options) {
			var base = this;
			var baseData = base.element.data('storeLocator');
			var o = jQuery.extend({}, base.default_options, options || {});

			base.resize();
			
			//Add base class
			base.element.addClass('storeLocator');
			
			//Create map
			baseData.map = new google.maps.Map(base.element[0], baseData.mapOptions);

			//read data and set markers
			base._setMarkers();
			
			base._callback(options);
		},
/**---------------------------------------
	_setMarkers
---------------------------------------**/			
		_setMarkers: function(options) {
			var base = this;
			var baseData = base.element.data('storeLocator');
			var o = jQuery.extend({}, base.default_options, options || {});

			//Set markers
			for (i=0;i<baseData.options.dataPoints.length;i++) {
				var ArrayMarker = baseData.options.dataPoints[i];
				var Latlng = new google.maps.LatLng(ArrayMarker.lang,ArrayMarker.long);
				var marker = new google.maps.Marker({
					position: Latlng,
					map: baseData.map,
					storeName: ArrayMarker.storeName,
					storeInfo: ArrayMarker.storeInfo,
					storeReg: ArrayMarker.storeReg,
					storeWebsite: ArrayMarker.storeWebsite,
					storeDealer: ArrayMarker.storeDealer,
					storeHtmlContent: ArrayMarker.storeHtmlContent,
					title: ArrayMarker.storeName,
					icon: baseData.options.iconImage
				});
				google.maps.event.addListener(marker, 'click', function(){
					base._activateMarker(this);
				});
			}
			
			base._callback(options);
		},		
		_activateMarker: function(marker) {
			var base = this;
			var baseData = base.element.data('storeLocator');
			
			//zoom to marker position
			if (baseData.options.storeZoomLevel != null) {
				base.zoomTo(marker.position.lat(),marker.position.lng(),baseData.options.storeZoomLevel);
			}
			else {
				base.zoomTo(marker.position.lat(),marker.position.lng(),null);
			}
			//Update content of infowindow
			baseData.infoWindow.content = marker.storeName;
			if (marker.storeInfo != null) baseData.infoWindow.content += marker.storeInfo;
			if (marker.storeReg != null && marker.storeReg != '') baseData.infoWindow.content += '<p>Reg. nr.:'+marker.storeReg+'</p>';
			if (marker.storeWebsite != null && marker.storeWebsite != '') {
				if (marker.storeWebsite.indexOf('http://') != -1) {
					baseData.infoWindow.content += '<p><a href="'+marker.storeWebsite+'" target="_blank">Website</a></p>';
				}
				else {
					baseData.infoWindow.content += '<p><a href="http://'+marker.storeWebsite+'" target="_blank">Website</a></p>';
				}
			} 
			if (marker.storeDealer != null) baseData.infoWindow.content += '<br /><p><b>Forhandler: </b><br />'+marker.storeDealer+'</p>';
			if (marker.storeHtmlContent != null) baseData.infoWindow.content += marker.storeHtmlContent;
			
			baseData.infoWindow.setContent(baseData.infoWindow.content);
			//Show marker information
			baseData.infoWindow.open(baseData.map,marker);
			//baseData.infoWindow.open(baseData.map,marker);
		},
/**---------------------------------------
	resize
---------------------------------------**/			
		resize: function(options) {
			var base = this;
			var baseData = base.element.data('storeLocator');
			var o = jQuery.extend({}, base.default_options, options || {});
			
			var width = baseData.options.width;
			var height = baseData.options.height;
			
			base.element.width(width);
			base.element.height(height);
			baseData.width = base.element.width();
			baseData.height = base.element.height();
			
			base._callback(options);
		},
/**---------------------------------------
	zoomTo
---------------------------------------**/			
		zoomTo: function(lang,long,zoom) {
			var base = this;
			var baseData = base.element.data('storeLocator');
			
			if (lang != undefined && long != undefined) {
				if (zoom != undefined) baseData.map.setZoom(parseInt(zoom));
				var pointToMoveTo = new google.maps.LatLng(lang,long);
				baseData.map.panTo(pointToMoveTo);
				base._trigger( "zoomStart", null, { lang:lang,long:long,zoom:zoom } );
				
				//Close info window
				baseData.infoWindow.close(baseData.map);
				
				google.maps.event.addListenerOnce(baseData.map, 'idle', function(){
				   base._trigger( "zoomComplete", null, { lang:lang,long:long,zoom:zoom } );
				});
			}
			else {
				base._trigger( "zoomError", null, { lang:lang,long:long,zoom:zoom } );
			}
		},
/**---------------------------------------
	Handle Callback
---------------------------------------**/			
		_callback: function(options) {
			var base = this;
			var o = jQuery.extend({}, base.default_options, options || {});
  			//base.consoleLog(o.complete);
  			if (o.complete && typeof(o.complete) === 'function') {  
      			o.complete();
 			}  
		},
/**---------------------------------------
	Console Log
---------------------------------------**/			
		consoleLog: function(msg) {
			try {
				console.log(msg);
			}
			catch(err) {
				//send error to developer platform
			}
		},
/**---------------------------------------
	Destroy
---------------------------------------**/		
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        },
/**---------------------------------------
	Set option
---------------------------------------**/	
        // Respond to any changes the user makes to the 
        // option method
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }
            
			//this.options[ key ] = value;

            // For UI 1.8, _setOption must be manually invoked 
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );
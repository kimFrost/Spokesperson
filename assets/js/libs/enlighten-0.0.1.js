window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame 		||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
	};
})();
/**---------------------------------------
	Enlighten v0.0.1
---------------------------------------**/
;(function($, window, document, requestAnimFrame, undefined) {
	var _Enlighten= function(optionArg) {
		var private = {};
		var public = this;
		private.default_options = {
			complete: null,
			e: null,
			obj: null,
			json: null,
			array: null,
			boolean: null,
			string: null,
			index: null,
			special: null
		};
		public.options = {

		};
		private.data = {
			rootElem: null
		};
		private.internal = {
			asignedIds: [],
			fixedUpdateTimer: null,
			logCount: 0,
			userAgent: "",
			lastFrameOptions: null,
			devices: {
				ios: false,
				android: false,
				ie8: false
			},
			states: {
				initialized: false,
				error: false
			}
	};
/**---------------------------------------
	Create & Init
---------------------------------------**/
		// Parse plugin create options
		private.create = function() {

			// Parse plugin arguments
			if (optionArg != undefined) {
				for (var key in optionArg) {
					for (var option in private.data) {
						if (option === key) {
							private.data[option] = optionArg[key];
						}
					}
					for (var option in public.options) {
						if (option === key) {
							public.options[option] = optionArg[key];
						}
					}
				}
			}

			if (private.data.rootElm === null) {
				// Create container
				private.data.rootElem = $('<div class="enlighten"></div>').appendTo('body');
			}
			else {
				private.data.rootElem.addClass('enlighten');
			}

			private.init();
		};
		// Initiate part of the plugin
		private.init = function() {
			public.resize();
			$(window).on('resize',function() {
				// use smart resize instead
				// If responsive only
				public.resize();
			});
			setInterval(function() {
				//$('#fps').html('fps: '+private.data.fps);
				private.data.fps = 0;
			},1000);
		};
/**---------------------------------------
	Setup Bindings
---------------------------------------**/
		private.setupBindings = function() {

		};
/**---------------------------------------
 	Construct
 ---------------------------------------**/
		private.addPlane = function() {

		};
/**---------------------------------------
	Resize
---------------------------------------**/
		public.resize = function() {

		};
/**---------------------------------------
	Parse option
---------------------------------------**/
		private.parseOptions = function(option, value) {
			if (option != undefined && value != undefined) {
				if (option == "volume") {
					// Set volume of all videos
					for (var i=0;i<private.data.movies.length;i++) {
						var movie = private.data.movies[i];
						movie.elem[0].volume = value;
					}
				}
				else if (option == "size") {

				}
				else if (option == "crossfade") {

				}
			}
		};
/**---------------------------------------
	Update options values
---------------------------------------**/
		public.updateOptionValues = function() {
			// Dirty check options
			if (private.internal.lastFrameOptions != null) {
				for (var option in public.options) {
					var lastFrameOption = private.internal.lastFrameOptions[option];
					// Detect options change between frames
					if (public.options[option] != lastFrameOption) {
						// Options has change in public options
						private.parseOptions(option, public.options[option]);
						private.internal.lastFrameOptions[option] = public.options[option];
					}
				}
			}
			else {
				// Clone public options to last frame options and parse options
				private.internal.lastFrameOptions = {};
				for (var option in public.options) {
					private.parseOptions(option, public.options[option]);
					private.internal.lastFrameOptions[option] = public.options[option];
				}
			}
		};
/**---------------------------------------
	 Update
---------------------------------------**/
		public.update = function() {
			requestAnimFrame(public.update);
			public.updateOptionValues();
		};
/**---------------------------------------
	 Fixed update
---------------------------------------**/
		private.fixedUpdate = function() {

		};
/**---------------------------------------
	 Get Data Object (High performance by direct reference)
---------------------------------------**/
		private.getObj = function(objId) {
			if (objId != undefined && objId != "") {
				for (var i=0;i<private.internal.asignedIds.length;i++) {
					var idObj = private.internal.asignedIds[i];
					if (objId === idObj.id) {
						return idObj.data;
					}
				}
			}
		};
/**---------------------------------------
	 Log
---------------------------------------**/
		// Console log
		private.log = function(msg) {
			try {
				if (private.internal.logCount > 200) {
					console.clear();
					private.internal.logCount = 0;
				}
				console.log(msg);
				private.internal.logCount++;
			}
			catch(err) {
				//send error to developer platform
			}
		};
/**---------------------------------------
	 Asign Id
---------------------------------------**/
		private.asignId = function(id, dataObj) {
			id = (id === undefined) ? null : id;
			dataObj = (dataObj === undefined) ? null : dataObj;
			var idFree = false,
				count = 0;
			while (!idFree) {
				if (id === null || count > 0) {
					id = private.returnRandomId();
				}
				idFree = private.validateId(id);
				count++;
			}
			private.internal.asignedIds.push({
				id: id,
				data: dataObj
			});
			return id.toString();
		};
		private.returnRandomId = function() {
			var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var id = "";
			for (var i=0;i<5;i++) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		};
		private.validateId = function(id) {
			var found = false;
			for (var i=0;i<private.internal.asignedIds.length;i++) {
				var asignedId = private.internal.asignedIds[i];
				if (id === asignedId.id) found = true;
				break;
			}
			return !found;
		};
/**---------------------------------------
	 Callback
---------------------------------------**/
		private.callback = function(options) {
			var o = jQuery.extend({}, private.default_options, options || {});
			if (o.complete && typeof(o.complete) === 'function') {
				o.complete();
			}
		};

		// Create
		private.create();
	};
	// Expose to window scope
	window.Enlighten = _Enlighten;
})(jQuery, window, window.document, window.requestAnimFrame);
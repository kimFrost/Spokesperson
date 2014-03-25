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
	TimeString v0.0.6
---------------------------------------**/
;(function($, window, document, requestAnimFrame, undefined) {
	var _Timestring = function(optionArg) {
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
			crossfade: false,
			volume: 100,
			fixedUpdateInterval: 1000,
			size: {
				width: 800,
				height: 500
			}
		};
		private.data = {
			fps: 0,
			rootElem: null,
			videoContainer: null,
			sceneContainer: null,
			renderView: null,
			renderViewCtx: null,
			scenes: [],
			movies: [],
			states: {
				playing: false,
				paused: false,
				seeking: false,
				error: false
			}
		};
		private.internal = {
			asignedIds: [],
			fixedUpdateTimer: null,
			triggerQueue: [],
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
			// Create containers for movies and canvases
			private.data.rootElem.addClass('timestring');
			private.data.videoContainer = $('<div class="timestring-videos"></div>').appendTo(private.data.rootElem);
			private.data.sceneContainer = $('<div class="timestring-scenes"></div>').appendTo(private.data.rootElem);
			private.data.renderView = $('<canvas width="'+public.options.size.width+'" height="'+public.options.size.height+'" class="timestring-view"></canvas>').appendTo(private.data.rootElem);
			private.data.renderViewCtx = private.data.renderView[0].getContext('2d');

			private.init();
		};
		// Initiate part of the plugin
		private.init = function() {
			public.resize();
			$(window).on('resize',function() {
				//use smart resize instead
				public.resize();
			});
			setInterval(function() {
				$('#fps').html('fps: '+private.data.fps);
				private.data.fps = 0;
			},1000);
		};
		// Initiate the runtime update of the plugin
		public.init = function() {
			if (!private.internal.states.initialized) {
				private.construct();
				public.update();

				// Fixed Update
				private.internal.fixedUpdateTimer = setInterval(function() {
					private.fixedUpdate();
				}, public.options.fixedUpdateInterval);
				// Setup trigger event listeners
				//private.setupTriggerEvents();

				private.internal.states.initialized = true;
			}
		};
/**---------------------------------------
 	Construct
 ---------------------------------------**/
		private.construct = function() {
			// Construct scenes
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];

				// buffer canvas for movies to be drawn onto;
				var sceneHtml = '<canvas id="'+scene.id+'" width="'+public.options.size.width+'" height="'+public.options.size.height+'">';
				sceneHtml += '</canvas>';
				scene.elem = $(sceneHtml).appendTo(private.data.sceneContainer);
				scene.ctx = scene.elem[0].getContext('2d');

				// Store movies relation in data list
				for (var m=0;m<private.data.movies.length;m++) {
					var movie = private.data.movies[m];
					if (movie.scene === scene.id)  {
						scene.movies.push(movie);
					}
				}
			}

			// Construct movies
			for (var i=0;i<private.data.movies.length;i++) {
				var movie = private.data.movies[i];

				// video tag to render native movies
				var movieHtml = '<video id="'+movie.id+'" poster="" controls width="'+public.options.size.width+'" height="'+public.options.size.height+'">';
					movie.formats.forEach(function(format) {
						movieHtml += '<source src="'+format.path+'" type="'+format.type+'" />';
					});
				movieHtml += '</video>';
				movie.elem = $(movieHtml).appendTo(private.data.videoContainer);

				// Bind data object to dom elem
				movie.elem.data("timestring",movie);

				// Bind current time
				movie.elem.on("timeupdate", function(event) {
					//console.log("timeupdate");
					//console.log(this.currentTime);
					//console.log(event);
					var dataObj =  $(this).data("timestring");
					dataObj.time.current = this.currentTime;
					//console.log(this.duration);
				});

				// Bind pause
				movie.elem.on("pause", function(event) {
					console.log("pause");
				});

				// Bind play
				movie.elem.on("play", function(event) {
					console.log("play");
				});

				// Bind ended
				movie.elem.on("ended", function(event) {
					console.log("ended");
					public.trigger("__ended", $(this).data('timestring').id);
				});

				// Bind movie length
				movie.elem.on("loadedmetadata", function(event) {
					var dataObj =  $(this).data("timestring");
					dataObj.time.length = this.duration;
				});

			}
		};
/**---------------------------------------
 	Add Scene
 ---------------------------------------**/
		public.addScene = function(arg) {
			arg = (arg === undefined) ? {} : arg;
			var id = null;
			if (arg.id != undefined) id = arg.id;

			var triggers = [];
			if (arg.triggers != undefined && arg.triggers.length > 0) triggers = arg.triggers;

			var scene = {
				movies: [],
				elem: null,
				ctx: null,
				triggers: triggers,
				time: {
					length: -1,
					current: -1
				},
				effects: {
					alpha: 100
				},
				states: {
					draw: false,
					sleep: false
				}
			};
			scene.id = private.asignId(id, scene);

			private.log(scene);

			private.data.scenes.push(scene);
		};
/**---------------------------------------
 	Add Movie
 ---------------------------------------**/
		public.addMovie = function(arg) {
			arg = (arg === undefined) ? {} : arg;
			var id = null;
			if (arg.id != undefined) id = arg.id;

			var triggers = [];
			if (arg.triggers != undefined && arg.triggers.length > 0) triggers = arg.triggers;

			var formats = [];
			if (arg.ogg != undefined) {
				formats.push({
					type: "video/ogg",
					path: arg.ogg
				});
			}
			if (arg.webm != undefined) {
				formats.push({
					type: "video/webm",
					path: arg.webm
				});
			}
			if (arg.mp4 != undefined) {
				formats.push({
					type: "video/mp4",
					path: arg.mp4
				});
			}

			var movie = {
				formats: formats,
				scene: arg.scene,
				elem: null,
				triggers: triggers,
				time: {
					current: -1,
					length: -1
				},
				effects: {
					alpha: 100
				},
				states: {
					draw: false,
					sleep: false
				}
			};
			movie.id = private.asignId(id, movie);

			// Movie methods
			movie.play = function() {
				this.states.draw = true;
				this.elem[0].play();
				var sceneObj = private.getObj(this.scene);
				sceneObj.states.draw = true;
			};
			movie.stop = function() {
				this.states.draw = false;
				this.elem[0].stop();
				var sceneObj = private.getObj(this.scene);
				sceneObj.states.draw = false;
			};
			movie.goto = function(time) {
				this.elem[0].currentTime = time;
			};


			private.data.movies.push(movie);
		};
/**---------------------------------------
	Add Trigger
---------------------------------------**/
		public.addTrigger = function(arg) {
			arg = (arg === undefined) ? {} : arg;
			var id = null;
			if (arg.id != undefined) id = arg.id;

			var trigger = {
				id: private.asignId(id)
			};

			private.data.triggers.push(trigger);
		};
/**---------------------------------------
	Play
---------------------------------------**/
		public.play = function(id) {
			id = (id === undefined) ? null : id;

			// Activate first trigger __init
			public.trigger("__init");


			// Find the right scene and movies to play?

		};
/**---------------------------------------
	Pause
---------------------------------------**/
		public.pause = function(id) {
			id = (id === undefined) ? null : id;

			// Find all movies playing and pause them


		};
/**---------------------------------------
	Resize
---------------------------------------**/
		public.resize = function() {
			//windowWidth = $(window).width();
			//windowHeight = $(window).height();
			//canvasWidth = canvas.width;
			//canvasHeight = canvas.height;
			//ctx = canvas.getContext('2d');
			//this.draw();
		};
/**---------------------------------------
	 Update
---------------------------------------**/
		public.update = function() {
			requestAnimFrame(public.update);
			public.drawScenes();
			public.draw();
		};
/**---------------------------------------
	 Fixed update
---------------------------------------**/
		private.fixedUpdate = function() {
			//private.log("fixedUpdate");

			private.checkTriggers();

		};
/**---------------------------------------
	Trigger a trigger event
---------------------------------------**/
		public.trigger = function(trigger, keyId) {
			keyId = (keyId === undefined) ? null : keyId;
			private.internal.triggerQueue.push({
				name: trigger,
				keyId: keyId,
				triggered: false,
				timesMovieLooped: 0,
				timesSceneLooped: 0
			});
		};
/**---------------------------------------
	Parse Trigger
---------------------------------------**/
		private.parseTrigger = function(trigger, data) {
			// Has action and target
			if (trigger.action != undefined && trigger.target != undefined) {
				var targetData = private.getObj(trigger.target);
				if ($.isFunction(trigger.action)) {
					trigger.action(targetData);
				}
				else {

				}
			}
			// Only has action
			else if (trigger.action != undefined) {
				if ($.isFunction(trigger.action)) {
					trigger.action();
				}
				else {

				}
			}
			// Only has target
			else if (trigger.target != undefined) {
				var targetData = private.getObj(trigger.target);

			}
		};
/**---------------------------------------
	 Check Triggers (trigger listeners)
---------------------------------------**/
		private.checkTriggers = function() {
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (!scene.states.sleep) {
					if (scene.triggers.length > 0) {
						for (var m=0;m<scene.triggers.length;m++) {
							var trigger = scene.triggers[m];
							for (var mm=0;mm<private.internal.triggerQueue.length;mm++) {
								var queuedTrigger = private.internal.triggerQueue[mm];
								console.log("queuedTrigger S", queuedTrigger);
								if (queuedTrigger.name === trigger.trigger) {
									if (queuedTrigger.keyId != null) {
										if (queuedTrigger.keyId === scene.id) {
											// Trigger the trigger
											private.parseTrigger(trigger, scene);
											// Remove trigger from queue at end
											queuedTrigger.triggered = true;
										}
									}
									else {
										// Trigger the trigger
										private.parseTrigger(trigger, scene);
										// Remove trigger from queue at end
										queuedTrigger.triggered = true;
									}
									queuedTrigger.timesSceneLooped++;
								}
							}
						}
					}
					for (var ii=0;ii<scene.movies.length;ii++) {
						var movie = scene.movies[ii];
						if (!movie.states.sleep) {
							if (movie.triggers.length > 0) {
								for (var m=0;m<movie.triggers.length;m++) {
									var trigger = movie.triggers[m];
									for (var mm=0;mm<private.internal.triggerQueue.length;mm++) {
										var queuedTrigger = private.internal.triggerQueue[mm];
										console.log("queuedTrigger M", queuedTrigger);
											if (queuedTrigger.name === trigger.trigger) {
											if (queuedTrigger.keyId != null) {
												if (queuedTrigger.keyId === movie.id) {
													// Trigger the trigger
													private.parseTrigger(trigger, movie);
													// Remove trigger from queue at end
													queuedTrigger.triggered = true;
												}
											}
											else {
												// Trigger the trigger
												private.parseTrigger(trigger, movie);
												// Remove trigger from queue at end
												queuedTrigger.triggered = true;
											}
											queuedTrigger.timesMovieLooped++;
										}
									}
								}
							}
						}
					}
				}
			}
			// Remove triggered triggers
			for (var i=0;i<private.internal.triggerQueue.length;i++) {
				var trigger = private.internal.triggerQueue[i];
				if (trigger.triggered) {
					private.internal.triggerQueue.splice(i,1);
				}
				else if (trigger.timesMovieLooped > 0) {
					private.internal.triggerQueue.splice(i,1);
				}
			}
		};
/**---------------------------------------
	 Draw scene
---------------------------------------**/
		public.drawScenes = function() {
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (!scene.states.sleep) {
					for (var m=0;m<private.data.movies.length;m++) {
						var movie = private.data.movies[m];
						if (movie.scene === scene.id && movie.states.draw) {
							// Render movie to scene
							scene.ctx.drawImage(movie.elem[0], 0, 0, movie.elem.width(), movie.elem.height());
						}
					}
				}
			}

			/*
			private.log(sceneid, movieid);
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (scene.id === sceneid) {
					// Draw movie to scene at spec pos and size + clear area first
					for (var m=0;m<private.data.movies.length;m++) {
						var movie = private.data.movies[m]
						if (movie.id === movieid) {

							private.log("draw movie frame");

							scene.ctx.drawImage(movie.elem[0], 0, 0, movie.elem.width(), movie.elem.height());

							break;
						}
					}
					break;
				}
			}
			*/
		};
/**---------------------------------------
	 Draw
---------------------------------------**/
		public.draw = function() {

			private.data.renderViewCtx.clearRect(0, 0, private.data.renderView.width(), private.data.renderView.height());
			private.data.renderViewCtx.save();

			// Draw active scenes to view
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (scene.states.draw) {
					private.data.renderViewCtx.drawImage(scene.elem[0], 0, 0, private.data.renderView.width(), private.data.renderView.height());
				}
			}

			private.data.fps++;
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
				console.log(msg);
			}
			catch(err) {
				//send error to developer platform
			}
		};
/**---------------------------------------
	 Asign Id
---------------------------------------**/
		// Console log
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
			//return Math.floor((Math.random()*10000)+1);
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
	window.Timestring = _Timestring;
})(jQuery, window, window.document, window.requestAnimFrame);
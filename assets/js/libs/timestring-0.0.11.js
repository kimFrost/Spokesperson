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
	TimeString v0.0.10
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
			volume: 1.0,
			fixedUpdateInterval: 1000,
			responsive: false,
			size: {
				width: 960,
				height: 540
			}
		};
		private.data = {
			fps: 0,
			rootElem: null,
			videoContainer: null,
			bufferContainer: null,
			sceneContainer: null,
			renderView: null,
			renderViewCtx: null,
			scenes: [],
			movies: [],
			states: {
				playing: false,
				paused: false,
				error: false
			}
		};
		private.internal = {
			asignedIds: [],
			fixedUpdateTimer: null,
			triggerQueue: [],
			logCount: 0,
			lastFrameOptions: null,
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
			private.data.videoContainer = $('<div class="timestring__videos"></div>').appendTo(private.data.rootElem);
			private.data.bufferContainer = $('<div class="timestring__buffers"></div>').appendTo(private.data.rootElem);
			private.data.sceneContainer = $('<div class="timestring__scenes"></div>').appendTo(private.data.rootElem);
			private.data.renderView = $('<canvas width="'+public.options.size.width+'" height="'+public.options.size.height+'" class="timestring-view"></canvas>').appendTo(private.data.rootElem);
			private.data.renderViewCtx = private.data.renderView[0].getContext('2d');

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


				var movieBufferHtml = '<canvas id="buffer'+movie.id+'" width="'+public.options.size.width+'" height="'+public.options.size.height+'"></canvas>';
				movie.buffer.elem = $(movieBufferHtml).appendTo(private.data.bufferContainer);
				movie.buffer.ctx = movie.buffer.elem[0].getContext('2d');


				// Bind data object to dom elem
				movie.elem.data("timestring",movie);

				// Bind current time
				movie.elem.on("timeupdate", function(event) {
					//private.log("timeupdate");
					//private.log(this.currentTime);
					//private.log(event);
					var dataObj =  $(this).data("timestring");
					dataObj.time.current = this.currentTime;
					dataObj.time.currentLastUpdated = (Date.now || new Date().getTime)();
					//private.log(this.duration);
				});

				// Bind pause
				movie.elem.on("pause", function(event) {
					//private.log("pause");

				});

				// Bind play
				movie.elem.on("play", function(event) {
					//private.log("play");

				});

				// Bind ended
				movie.elem.on("ended", function(event) {
					//private.log("ended");
					public.trigger("__ended", $(this).data('timestring').id);
				});

				// Bind movie length
				movie.elem.on("loadedmetadata", function(event) {
					var dataObj =  $(this).data("timestring");
					dataObj.time.length = this.duration;
				});

				movie.elem.on("ratechange", function(event) {
					var dataObj =  $(this).data("timestring");
					dataObj.time.playbackRate = this.playbackRate;
				});

				movie.temp = null;

				movie.elem.on("seeking", function(event) {
					//private.log("seeking");
					var dataObj =  $(this).data("timestring");
					dataObj.states.seeking = true;
					dataObj.temp = event.timeStamp;


				});
				movie.elem.on("seeked", function(event) {
					//private.log("seeked");
					var dataObj =  $(this).data("timestring");
					dataObj.states.seeking = false;
					//private.log(event.timeStamp - dataObj.temp + "ms");
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
					alpha: 1.0
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
				buffer: {
					elem: null,
					ctx: null
				},
				size: {
					width: public.options.size.width,
					height: public.options.size.height
				},
				triggers: triggers,
				time: {
					current: -1,
					playbackRate: 0,
					length: -1,
					currentLastUpdated: -1
				},
				effects: {
					alpha: 0.05
				},
				states: {
					draw: false,
					sleep: false,
					seeking: false
				}
			};
			movie.id = private.asignId(id, movie);

			// Movie methods
			movie.play = function() {
				this.states.draw = true;
				this.elem[0].play();
				this.time.playbackRate = this.elem[0].playbackRate;
				var sceneObj = private.getObj(this.scene);
				sceneObj.states.draw = true;
			};
			movie.pause = function() {
				this.states.draw = false;
				this.elem[0].pause();
				var sceneObj = private.getObj(this.scene);
				sceneObj.states.draw = false;
			};
			movie.goto = function(time) {
				// Make sceenshot for buffer
				if (this.states.draw && !this.states.sleep) {
					private.drawBuffer(this.id);
				}

				// Set time in movie
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
			//public.drawScenes();
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
					trigger.action(targetData, data);
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
								//private.log("queuedTrigger S", queuedTrigger);
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
								else if (typeof queuedTrigger.name == "number") {

									private.log(queuedTrigger);

								}
							}
						}
					}
					for (var ii=0;ii<scene.movies.length;ii++) {
						var movie = scene.movies[ii];
						if (!movie.states.sleep) {
							if (movie.triggers.length > 0) {
								var timeSinceMovieTimeUpdated = (Date.now || new Date().getTime)() - movie.time.currentLastUpdated;
								//private.log(timeSinceMovieTimeUpdated.toString() + " Ms movie updated time");
								for (var m=0;m<movie.triggers.length;m++) {
									var trigger = movie.triggers[m];
									for (var mm=0;mm<private.internal.triggerQueue.length;mm++) {
										var queuedTrigger = private.internal.triggerQueue[mm];
										//private.log("queuedTrigger M", queuedTrigger);
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
									// Check movie current time if trigger is a number
									if (typeof trigger.trigger == "number") {
										var maxDiff = (movie.time.playbackRate * timeSinceMovieTimeUpdated);
										var diff = movie.time.current - trigger.trigger;
										var triggerType = (trigger.type === undefined) ? "on" : trigger.type;

										if (triggerType === "adjacent") {
											/*
											//Not supported anymore
											if (diff <= maxDiff && diff >= -maxDiff) {
												private.log(movie.time.current);
												private.parseTrigger(trigger, movie);
											}
											*/
										}
										else if (triggerType === "on") {
											if (movie.time.playbackRate > 0) {
												if (diff <= maxDiff && movie.time.current >= trigger.trigger) {
													private.parseTrigger(trigger, movie);
												}
											}
											else if (movie.time.playbackRate < 0) {
												if (diff >= maxDiff && movie.time.current <= trigger.trigger) {
													private.log(movie.time.current);
													private.parseTrigger(trigger, movie);
												}
											}
										}
										else if (triggerType === "after") {
											if (movie.time.playbackRate > 0) {
												if (diff >= 0) {
													private.parseTrigger(trigger, movie);
												}
											}
											else if (movie.time.playbackRate < 0) {
												if (diff <= 0) {
													private.parseTrigger(trigger, movie);
												}
											}

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
					//private.log(private.internal.triggerQueue[i]);
					private.internal.triggerQueue.splice(i,1);
				}
				else if (trigger.timesMovieLooped > 0) {
					//private.log(private.internal.triggerQueue[i]);
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
		};
/**---------------------------------------
	 Draw
---------------------------------------**/
		public.draw = function() {
			//private.data.renderViewCtx.clearRect(0, 0, public.options.size.width, public.options.size.height);

			//private.data.renderViewCtx.save();

			//private.data.renderViewCtx.globalAlpha = 1.0;
			//private.data.renderViewCtx.fillStyle = "#dc0f0f";
			//private.data.renderViewCtx.fillRect(0,0, public.options.size.width, public.options.size.height);

			private.data.renderViewCtx.globalAlpha = 1;

			// Draw active scenes to view
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (scene.states.draw) {
					//private.data.renderViewCtx.drawImage(scene.elem[0], 0, 0, public.options.size.width, public.options.size.height);
					for (var m=0;m<private.data.movies.length;m++) {
						var movie = private.data.movies[m];
						if (movie.scene === scene.id && movie.states.draw) {
							// Render movie to view
							private.data.renderViewCtx.globalAlpha = movie.effects.alpha;
							if (movie.states.seeking) {
								private.data.renderViewCtx.drawImage(movie.buffer.elem[0], 0, 0, movie.size.width, movie.size.height);
							}
							else {
								private.data.renderViewCtx.drawImage(movie.elem[0], 0, 0, movie.size.width, movie.size.height);
							}
						}
					}
				}
			}

			private.data.fps++;
		};
		private.drawBuffer = function(id) {
			var obj = private.getObj(id);
			if (obj.buffer != undefined) {
				if (obj.buffer.elem != null && obj.buffer.ctx != null && obj.elem != null) {
					obj.buffer.ctx.drawImage(obj.elem[0], 0, 0, obj.size.width, obj.size.height);
				}
			}
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
	window.Timestring = _Timestring;
})(jQuery, window, window.document, window.requestAnimFrame);
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
	TimeRuler v0.0.3
---------------------------------------**/
;(function($, window, document, requestAnimFrame, undefined) {
	var _Timeruler = function(optionArg) {
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
			fixedUpdateInterval: 1000
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
				}
			}
			// Create containers for movies and canvases
			private.data.videoContainer = $('<div class="timeruler-videos"></div>').appendTo(private.data.rootElem);
			private.data.sceneContainer = $('<div class="timeruler-scenes"></div>').appendTo(private.data.rootElem);
			private.data.renderView = $('<canvas width="400" height="250" class="timeruler-view"></canvas>').appendTo(private.data.rootElem);
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
				var sceneHtml = '<canvas id="'+scene.id+'">';
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
				var movieHtml = '<video id="'+movie.id+'" poster="" controls>';
					movie.formats.forEach(function(format) {
						movieHtml += '<source src="'+format.path+'" type="'+format.type+'" />';
					});
				movieHtml += '</video>';
				movie.elem = $(movieHtml).appendTo(private.data.videoContainer);

				// Bind data object to dom elem
				movie.elem.data("timeruler",movie);

				// Bind current time
				movie.elem.on("timeupdate", function(event) {
					//console.log("timeupdate");
					//console.log(this.currentTime);
					//console.log(event);
					//console.log($(this).data("timeruler"));
					var dataObj =  $(this).data("timeruler");
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
				});

				// Bind movie length
				movie.elem.on("loadedmetadata", function(event) {
					var dataObj =  $(this).data("timeruler");
					dataObj.time.length = this.duration;
				});

			}


/*
			// Construct triggers on scenes if none is present
			console.log("construct triggers");
			for (var i=0;i<private.data.scenes.length;i++) {
				var scene = private.data.scenes[i];
				if (i === 0) {
					scene.states.draw = true;
				}
				console.log(scene);
				if (scene.triggers.length === 0) {
					for (var m=0;m<scene.movies.length;m++) {
						var movie = scene.movies[m];
						if (m === 0) {
							movie.states.draw = true;
						}
					}
				}
			}
*/


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
				id: private.asignId(id),
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
				id: private.asignId(id),
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

			private.log(movie);

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
			//private.data.rootElem.trigger("timeruler.__init");
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
	Restart
---------------------------------------**/
		public.restart = function(id) {
			id = (id === undefined) ? null : id;


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
		public.trigger = function(trigger) {
			private.internal.triggerQueue.push(trigger);
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
							for (var mm=0;m<private.internal.triggerQueue.length;mm++) {
								var queuedTrigger = private.internal.triggerQueue[m];
								if (queuedTrigger === trigger.trigger) {
									// Trigger the trigger
									console.log(trigger);

									// Remove trigger from queue
									private.internal.triggerQueue.splice(m,1);
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
									for (var mm=0;m<private.internal.triggerQueue.length;mm++) {
										var queuedTrigger = private.internal.triggerQueue[m];
										if (queuedTrigger === trigger.trigger) {
											// Trigger the trigger
											console.log(trigger);

											// Remove trigger from queue
											private.internal.triggerQueue.splice(m,1);
										}
									}
								}
							}
						}
					}
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
		private.asignId = function(id) {
			id = (id === undefined) ? null : id;
			var idFree = false,
				count = 0;
			while (!idFree) {
				if (id === null || count > 0) {
					id = private.returnRandomId();
				}
				idFree = private.validateId(id);
				count++;
			}
			private.internal.asignedIds.push(id);
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
				if (id === asignedId) found = true;
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
	window.Timeruler = _Timeruler;
})(jQuery, window, window.document, window.requestAnimFrame);
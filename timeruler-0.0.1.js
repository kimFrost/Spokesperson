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
	TimeRuler v0.0.1
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
			volume: 100
		};
		private.data = {
			fps: 0,
			rootElem: null,
			time: {
				current: -1
			},
			scenes: [],
			movies: [],
			triggers: [],
			states: {
				created: false,
				playing: false,
				paused: false,
				seeking: false,
				error: false
			}
		};
		private.internal = {
			asignedIds: []
		};
/**---------------------------------------
	Create & Init
---------------------------------------**/
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
			// Initiate plugin
			private.init();
		};
		private.init = function() {
			//private.log(private.data);
			public.resize();
			$(window).on('resize',function() {
				//use smart resize instead
				public.resize();
			});
			public.update();
			setInterval(function() {
				$('#fps').html('fps: '+private.data.fps);
				private.data.fps = 0;
			},1000);
		};
/**---------------------------------------
 	Add Scene
 ---------------------------------------**/
		public.addScene = function(arg) {
			arg = (arg === undefined) ? {} : arg;
			var id = null;
			if (arg.id != undefined) id = arg.id;

			var scene = {
				id: private.asignId(id),
				movies: [],
				effects: {
					alpha: 100
				},
				states: {
					draw: false,
					sleep: false,
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

			var movie = {
				id: private.asignId(id),
				effects: {
					alpha: 100
				},
				states: {
					draw: true,
					sleep: false,
					hidden: false
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
	Trigger
---------------------------------------**/
		public.trigger = function(trigger) {
			//private.log(trigger);


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
			//private.log("update");
			requestAnimFrame(public.update);
			//this.updateObjects();
			public.draw();
		};
/**---------------------------------------
	 Draw
---------------------------------------**/
		public.draw = function() {
			//ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			//ctx.save();

			//ctx.drawImage(currentVid, 0, 0, canvasWidth, canvasHeight);



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













$(document).ready(function() {
;(function($){
/**---------------------------------------
	Global variables
---------------------------------------**/
		var base = this;
		var canvas = document.getElementById('playerCanvas');
		var ctx = canvas.getContext('2d');
		var canvasWidth;
		var canvasHeight;
		var windowWidth;
		var windowHeight;

		var vid1 = document.getElementById('video1');
		var vid2 = document.getElementById('video2');

		var _temp = 1;
		var currentVid = vid1;

		$('.toggleVid').on('click', function() {
			if (_temp === 1) {
				currentVid = vid2;
				_temp = 2;
			}
			else if (_temp === 2) {
				currentVid = vid1;
				_temp = 1;
			}
		});

/**---------------------------------------
	Init
---------------------------------------**/
		base.init = function() {
			base.resize();
			$(window).on('resize',function() {
				//use smart resize instead
				base.resize();
			});
			update();
			setInterval(function() {
				$('#fps').html('fps: '+fps);
				fps = 0;
			},1000);
	}
/**---------------------------------------
	Resize
---------------------------------------**/
		base.resize = function() {
			windowWidth = $(window).width();
			windowHeight = $(window).height();
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			ctx = canvas.getContext('2d');
		}
/**---------------------------------------
	Game loop
---------------------------------------**/
		function update() {
			requestAnimFrame(update);
			//base.updateObjects();
			base.draw();
			//$('#devStats').html('<p>'+stageX+'</p><p>'+stageY+'</p><p>'+stageScale+'</p>');
		}
		base.updateObjects = function() {


		}
		base.draw = function() {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			ctx.save();

			ctx.drawImage(currentVid, 0, 0, canvasWidth, canvasHeight);



			fps++;
		}
/**---------------------------------------
	Console log
---------------------------------------**/
		base.consoleLog = function(msg) {
			try {
				console.log(msg);
			} catch(err) {
				//send error to developer platform
			}
		}
		base.init();

})(jQuery);
});
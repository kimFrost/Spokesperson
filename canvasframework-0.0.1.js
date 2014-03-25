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
	Canvas Framework v0.0.1
---------------------------------------**/
;(function($, window, document, undefined) {
	var _Timeruler = function() {
		var private = {};
		var public = this;
		public.default_options = {
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
			fps: 0
		};
/**---------------------------------------
	Create & Init
---------------------------------------**/
		private.create = function() {

			private.init();
		};
		private.init = function() {
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
	 Callback
---------------------------------------**/
		private.callback = function(options) {
			var base = this;
			var o = jQuery.extend({}, base.default_options, options || {});
			if (o.complete && typeof(o.complete) === 'function') {
				o.complete();
			}
		};
		private.create();
	};

	window.Timeruler = _Timeruler;
})(jQuery, window, window.document);













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
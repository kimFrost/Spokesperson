$(function() {

	var timestring = new Timestring({
		rootElem: $("#spokesperson"),
		size: {
			width: 960,
			height: 540
		},
		volume: 0,
		fixedUpdateInterval: 500
	});

	timestring.addScene({
		id: "scene01",
		triggers: [
			{
				id: "trigger01", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "omos",
				action: function(target) {
					//target.play();
					target.triggers.push({
						trigger: "__ended",
						target: "omos",
						action: function(target) {
							target.goto(0);
							target.play();
						}
					});
				}
			},
			{
				id: "trigger02", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "viden",
				action: function(target) {
					//target.play();
					target.triggers.push({
						trigger: "__ended",
						target: "viden",
						action: function(target) {
							target.goto(0);
							target.play();
						}
					});
				}
			},
			{
				id: "trigger03", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "buck",
				action: function(target) {
					//target.play();
					target.triggers.push(
						{
							trigger: 5.5,
							type: "on",
							target: "buck",
							action: function(target) {
								target.goto(4.2);
							}
						},
						{
							trigger: 7.00000,
							type: "after",
							target: "buck",
							action: function(target) {
								target.goto(2);
							}
						},
						{
							trigger: "__ended",
							target: "buck",
							action: function(target) {
								target.play();
								target.goto(3);
								//target.pause();
							}
						}
					);
				}
			}
		]
	});
	timestring.addScene({
		id: "scene02"
	});


	timestring.addMovie({
		id: "omos",
		scene: "scene01",
		//ogg: "video/envision/omos.ogv",
		webm: "video/envision/omos.webm",
		mp4: "video/envision/omos.mp4"
	});

	timestring.addMovie({
		id: "viden",
		scene: "scene01",
		//ogg: "video/envision/viden.ogv",
		webm: "video/envision/viden.webm",
		mp4: "video/envision/viden.mp4"
	});


	timestring.addMovie({
		id: "buck",
		scene: "scene01",
		ogg: "video/bigbuck/ogg/mov_bbb.ogg",
		mp4: "video/bigbuck/mp4/mov_bbb.mp4",
		triggers: [
			{
				id: "buckTrigger01",
				trigger: "__ended",
				target: "buck",
				action: function(target) {
					//console.log("buck trigger");
					//target.goto(3);

				}
			}
		]
	});

	timestring.addMovie({
		id: "cat",
		scene: "scene02",
		ogg: "video/cat/ogg/dizzy.ogv",
		mp4: "video/cat/mp4/dizzy.mp4",
		webm: "video/cat/webm/dizzy.webm"
	});

	timestring.init();
	timestring.play();

	/*
	 setTimeout(function() {
	 console.log("change volume");
	 timestring.options.volume = 0.1;
	 },3000);
	 */

});
/*
 document.addEventListener( "DOMContentLoaded", function() {

 var popcorn = Popcorn( "#ourvideo" );

 popcorn.footnote({
 start: 2,
 end: 3,
 target: "footnote",
 text: "Pop!"
 });

 // play the video right away
 popcorn.play();

 }, false );
 */
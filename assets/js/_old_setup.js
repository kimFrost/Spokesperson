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
				trigger: "__init",
				target: "b",
				action: function(api) {
					api.target.play();
					api.target.triggers.push({
						trigger: "__ended",
						target: "c",
						action: function(api) {
							//console.log("-->", self);
							api.self.pause();
							api.target.goto(0);
							api.target.play();
							api.target.triggers.push({
								trigger: "__ended",
								target: "d",
								action: function(api) {
									//console.log("-->", self);
									api.self.pause();
									api.target.goto(0);
									api.target.play();
									api.target.triggers.push({
										trigger: "__ended",
										target: "b",
										action: function(api) {
											api.self.pause();
											api.target.goto(0);
											api.target.play();
										}
									});
								}
							});
						}
					});
				}
			},
			{
				id: "trigger01", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "omos",
				action: function(api) {
					//target.play();
					api.target.triggers.push({
						trigger: "__ended",
						target: "omos",
						action: function(api) {
							api.target.goto(0);
							api.target.play();
						}
					});
				}
			},
			{
				id: "trigger02", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "viden",
				action: function(api) {
					//api.target.play();
					api.target.triggers.push({
						trigger: "__ended",
						target: "viden",
						action: function(api) {
							api.target.goto(0);
							api.target.play();
						}
					});
				}
			},
			{
				id: "trigger03", // id on triggers are not required (will be generated)
				trigger: "__init",
				target: "buck",
				action: function(api) {
					//api.target.play();
					api.target.triggers.push(
						{
							trigger: 5.5,
							type: "on",
							target: "buck",
							action: function(api) {
								api.target.goto(4.2);
							}
						},
						{
							trigger: 7.00000,
							type: "after",
							target: "buck",
							action: function(api) {
								api.target.goto(2);
							}
						},
						{
							trigger: "__ended",
							target: "buck",
							action: function(api) {
								api.target.play();
								api.target.goto(3);
								//api.target.pause();
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
		id: "b",
		scene: "scene01",
		ogg: "video/jafilm/ogv/B.ogg",
		webm: "video/jafilm/webm/B.webm",
		mp4: "video/jafilm/mp4/B.mp4"
	});

	timestring.addMovie({
		id: "c",
		scene: "scene01",
		ogg: "video/jafilm/ogv/C.ogg",
		webm: "video/jafilm/webm/C.webm",
		mp4: "video/jafilm/mp4/C.mp4",
		triggers: [
			{
				trigger: 3,
				action: function(api){
					console.log("------- c movie trigger at 3.0000");
					api.showGroup("groupMenu2");
				}
			}
		]
	});

	timestring.addMovie({
		id: "d",
		scene: "scene01",
		ogg: "video/jafilm/ogv/D.ogg",
		webm: "video/jafilm/webm/D.webm",
		mp4: "video/jafilm/mp4/D.mp4",
		triggers: [
			{
				trigger: 4,
				action: function(api) {
					console.log("------- d movie trigger at 4.0000");
					api.hideGroup("groupMenu2");
				}
			}
		]
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
				action: function(api) {
					//console.log("buck trigger");
					//api.target.goto(3);

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
$(function() {

	var spokesperson = {};

	var timestring = new Timestring({
		rootElem: $("#spokesperson"),
		size: {
			width: 960,
			height: 540
		},
		volume: 0.0,
		fixedUpdateInterval: 500
	});

	timestring.addScene({
		id: "SpokesPerson",
		triggers: [
			{
				trigger: "__init",
				target: "FILM_01",
				action: function(api) {
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_01",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_01.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_01.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_01.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_kokken",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_02_generel_outro_kokken",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_02_generel_outro_kokken.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_02_generel_outro_kokken.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_02_generel_outro_kokken.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_02_generel_outro_TV",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_02_generel_outro_TV.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_02_generel_outro_TV.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_02_generel_outro_TV.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_TV_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_03_loop_kokken_(closeup)",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_03_loop_kokken_(closeup).oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_03_loop_kokken_(closeup).webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_03_loop_kokken_(closeup).mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_03_loop_kokken_(total)",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_03_loop_kokken_(total).oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_03_loop_kokken_(total).webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_03_loop_kokken_(total).mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_03_loop_TV_(closeup)",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_03_loop_TV_(closeup).oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_03_loop_TV_(closeup).webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_03_loop_TV_(closeup).mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_04",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_04.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_04.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_04.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_TV_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_05",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_05.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_05.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_05.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_06",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_06.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_06.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_06.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_07",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_07.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_07.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_07.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_08",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_08.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_08.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_08.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_09",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_09.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_09.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_09.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_10",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_10.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_10.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_10.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_11",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_11.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_11.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_11.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_kokken",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_12",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_12.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_12.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_12.mp4.mp4",
		triggers: []
	});

	timestring.addMovie({
		id: "FILM_13",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_13.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_13.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_13.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(total)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_14",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_14.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_14.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_14.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_18",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_15",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_15.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_15.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_15.mp4.mp4",
		triggers: []
	});

	timestring.addMovie({
		id: "FILM_16",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_16.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_16.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_16.mp4.mp4",
		triggers: []
	});

	timestring.addMovie({
		id: "FILM_17",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_17.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_17.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_17.mp4.mp4",
		triggers: []
	});

	timestring.addMovie({
		id: "FILM_18",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_18.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_18.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_18.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});

	timestring.addMovie({
		id: "FILM_19",
		scene: "SpokesPerson",
		//ogg: "video/unaproved/ogv/FILM_19.oggtheora.ogv",
		webm: "video/unaproved/webm/FILM_19.webmhd.webm",
		mp4: "video/unaproved/mp4/FILM_19.mp4.mp4",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(total)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			}
		]
	});


	timestring.init();
	timestring.play();

});

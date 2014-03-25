$(function() {


	// Detech devices
	var drawOnCanvas = true,
		showOnlyVideo = false,
		drawInFlash = false,
		isTouch = false;

	var device = navigator.appVersion;

	if (device.indexOf("MSIE 8") != -1) {
		drawOnCanvas = false;
		showOnlyVideo = false;
		drawInFlash = true;
	}
	else if (device.indexOf("Android") != -1) {
		drawOnCanvas = false;
		showOnlyVideo = true;
		drawInFlash = false;
		isTouch = true;
	}
	else if (device.indexOf("iPad") != -1) {
		drawOnCanvas = false;
		showOnlyVideo = true;
		drawInFlash = false;
		isTouch = true;
	}
	else if (device.indexOf("iPhone") != -1) {
		drawOnCanvas = false;
		showOnlyVideo = true;
		drawInFlash = false;
		isTouch = true;
	}
	else {
		drawOnCanvas = true;
		showOnlyVideo = false;
		drawInFlash = false;
		isTouch = false;
	}



	/*
	var enlighten = new Enlighten({
		rootElem: $('.enlighten')
	});
	*/


	var spokesperson = {};

	// All the ugly listners and class modifiers
	spokesperson.data = {
		isTouch: 'ontouchstart' in document.documentElement,
		rootElem: $("#spokesperson"),
		menu: {
			elem: null,
			list: []
		}
	};

	spokesperson.api = {
		allowAllShowSubItems: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.addClass('spokesperson__itemlv1--allowShowSubItems');
			}
		},
		disableAllAllowShowSubItems: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.removeClass('spokesperson__itemlv1--allowShowSubItems');
			}
		},
		forceAllShowSubItems: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.addClass('spokesperson__itemlv1--forceShowSubItems');
			}
		},
		disableAllForceShowSubItems: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.removeClass('spokesperson__itemlv1--forceShowSubItems');
			}
		},
		disableAllTitle: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.addClass('spokesperson__itemlv1--disableTitle');
			}
		},
		enableAllTitle: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.removeClass('spokesperson__itemlv1--disableTitle');
			}
		},
		disableAllForceShowTitle: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.removeClass('spokesperson__itemlv1--forceShowTitle');
			}
		},
		disableAllOverrideTonedout: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.removeClass('spokesperson__itemlv1--overrideTonedOut');
			}
		},
		enableAllOverrideTonedout: function() {
			for (var i=0;i<spokesperson.data.menu.list.length;i++) {
				var item = spokesperson.data.menu.list[i];
				item.elem.addClass('spokesperson__itemlv1--overrideTonedOut');
			}
		},
		enableToneOutMenu: function() {
			spokesperson.data.menu.elem.addClass('spokesperson__menu--tonedOut');
		},
		disableToneOutMenu: function() {
			spokesperson.data.menu.elem.removeClass('spokesperson__menu--tonedOut');
		}
	};

	// Store DOM and DATA references
	spokesperson.data.menu.elem = spokesperson.data.rootElem.find('.spokesperson__menu');
	spokesperson.data.menu.elem.find('.spokesperson__itemlv1').each(function() {
		var $this = $(this);
		var item = {
			elem: $this,
			icon: {
				elem: $this.find('.spokesperson__itemIcon')
			},
			title: {
				elem: $this.find('.spokesperson__itemTitle')
			},
			menu: {
				elem: $this.find('.spokesperson__listlv2'),
				list: []
			}
		};

		//---- Methods

		// Toggle sub items
		item.allowShowSubItems = function() {
			this.elem.addClass('spokesperson__itemlv1--allowShowSubItems');
		};
		item.disableAllowShowSubItems = function() {
			this.elem.removeClass('spokesperson__itemlv1--allowShowSubItems');
		};

		// Force Toggle sub items
		item.forceShowSubItems = function() {
			this.elem.addClass('spokesperson__itemlv1--forceShowSubItems');
		};
		item.disableForceShowSubItems = function() {
			this.elem.removeClass('spokesperson__itemlv1--forceShowSubItems');
		};

		// Toggle title
		item.showTitle = function() {
			this.elem.addClass('spokesperson__itemlv1--showTitle');
		};
		item.hideTitle = function() {
			this.elem.removeClass('spokesperson__itemlv1--showTitle');
		};
		item.enableForceShowTitle = function() {
			this.elem.addClass('spokesperson__itemlv1--forceShowTitle');
		};
		item.disableForceShowTitle = function() {
			this.elem.removeClass('spokesperson__itemlv1--forceShowTitle');
		};

		// Toggle diable title
		item.disableTitle = function() {
			this.elem.addClass('spokesperson__itemlv1--disableTitle');
		};
		item.enableTitle = function() {
			this.elem.removeClass('spokesperson__itemlv1--disableTitle');
		};

		// Toggle toned out
		item.enableOverrideTonedout = function() {
			this.elem.addClass('spokesperson__itemlv1--overrideTonedOut');
		};
		item.disableOverrideTonedout = function() {
			this.elem.removeClass('spokesperson__itemlv1--overrideTonedOut');
		};


		// Subitems
		item.menu.elem.find('.spokesperson__itemlv2').each(function(){
			var $this = $(this);
			var subItem = {
				elem: $this
			}
			// Store DATA reference
			subItem.elem.data("spokesperson",item);
			// Store in list
			item.menu.list.push(subItem);
		});
		// Store DATA reference
		item.elem.data("spokesperson",item);
		item.icon.elem.data("spokesperson",item);
		item.title.elem.data("spokesperson",item);
		item.menu.elem.data("spokesperson",item);
		// Store in list
		spokesperson.data.menu.list.push(item);
	});


	//--- Setup Bindings
	for (var i=0;i<spokesperson.data.menu.list.length;i++) {
		var item = spokesperson.data.menu.list[i];


		//-- Touch Bindings
		if (isTouch) {
			// Menu toned out state and reset
			item.icon.elem.on('click hover', function(event){
				//alert("icon touchstart");
				var e = event.originalEvent;
				//event.preventDefault();
				//e.preventDefault();
				var dataObj = $(this).data("spokesperson");

				var filmId = $(this).attr('data-spokesperson');

				if (dataObj.elem.hasClass('spokesperson__itemlv1--allowShowSubItems')) {
					dataObj.forceShowSubItems();
				}
				else {
					spokesperson.api.disableAllAllowShowSubItems();
					spokesperson.api.disableAllForceShowSubItems();
					spokesperson.api.enableAllTitle();
					spokesperson.api.disableAllForceShowTitle();
					spokesperson.api.enableToneOutMenu();
					spokesperson.api.disableAllOverrideTonedout();

					dataObj.enableOverrideTonedout();
					dataObj.enableForceShowTitle();

					spokesperson.timestring.play(filmId, true);
				}
				spokesperson.timestring.hideGroup();
			});
		}
		//-- Mouse Bindings
		else {
			// Icon hover state
			item.elem.on('mouseenter', function(event){
				//alert("mouseenter");
				var dataObj = $(this).data("spokesperson");
				dataObj.showTitle();
			});
			item.elem.on('mouseleave', function(event){
				//alert("mouseleave");
				var dataObj = $(this).data("spokesperson");
				dataObj.hideTitle();
			});
			// Menu toned out state and reset
			item.icon.elem.on('mousedown', function(event){
				//alert("mousedown");

				var e = event.originalEvent;
				//event.preventDefault();
				//e.preventDefault();

				var dataObj = $(this).data("spokesperson");

				var filmId = $(this).attr('data-spokesperson');

				spokesperson.api.disableAllAllowShowSubItems();
				spokesperson.api.disableAllForceShowSubItems();
				spokesperson.api.enableAllTitle();
				spokesperson.api.disableAllForceShowTitle();
				spokesperson.api.enableToneOutMenu();
				spokesperson.api.disableAllOverrideTonedout();

				dataObj.enableOverrideTonedout();
				dataObj.enableForceShowTitle();

				spokesperson.timestring.hideGroup();

				spokesperson.timestring.play(filmId, true);

			});
		}

		for (var ii=0;ii<item.menu.list.length;ii++) {
			var subItem = item.menu.list[ii];
			//-- Touch Bindings
			if (isTouch) {
				subItem.elem.on('click hover', function(event) {
					var e = event.originalEvent;
					//event.preventDefault();
					//e.preventDefault();

					//alert("subElem touchstart");

					var filmId = $(this).attr('data-spokesperson');
					spokesperson.timestring.play(filmId, true);

					$(this).addClass('is-played');
					var dataObj = $(this).data("spokesperson");
					setTimeout(function() {
						dataObj.disableForceShowSubItems();
						dataObj.allowShowSubItems();
						spokesperson.timestring.hideGroup();
					},1000);
				});
			}
			//-- Mouse Bindings
			else {
				// Movie played state
				subItem.elem.on('mousedown', function(event) {
					$(this).addClass('is-played');
					var dataObj = $(this).data("spokesperson");

					var filmId = $(this).attr('data-spokesperson');
					spokesperson.timestring.play(filmId, true);

					setTimeout(function() {
						dataObj.disableForceShowSubItems();
						dataObj.allowShowSubItems();
						spokesperson.timestring.hideGroup();
					},1000);
				});
			}
		}
	}

	// Timestring web
	spokesperson.timestring = new Timestring({
		rootElem: $("#spokesperson"),
		size: {
			width: 960,
			height: 540
		},
		drawingType: {
			canvas: drawOnCanvas,
			video: showOnlyVideo,
			flash: drawInFlash
		},
		volume: 0.0,
		fixedUpdateInterval: 500
	});

	spokesperson.timestring.addScene({
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

	spokesperson.timestring.addMovie({
		id: "FILM_01",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_01.ogv",
		webm: "video/spokesperson/webm/FILM_01.webm",
		mp4: "video/spokesperson/mp4/FILM_01.m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_02_generel_outro_kokken",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_02_generel_outro_kokken_ny.ogv",
		webm: "video/spokesperson/webm/FILM_02_generel_outro_kokken_ny.webm",
		mp4: "video/spokesperson/mp4/FILM_02_generel_outro_kokken_ny.m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_02_generel_outro_TV",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_02_generel_outro_TV_ny.ogv",
		webm: "video/spokesperson/webm/FILM_02_generel_outro_TV_ny.webm",
		mp4: "video/spokesperson/mp4/FILM_02_generel_outro_TV_ny.m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_03_loop_kokken_(closeup)",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_03_loop_kokken_(closeup).ogv",
		webm: "video/spokesperson/webm/FILM_03_loop_kokken_(closeup).webm",
		mp4: "video/spokesperson/mp4/FILM_03_loop_kokken_(closeup).m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_03_loop_kokken_(total)",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_03_loop_kokken_(total).ogv",
		webm: "video/spokesperson/webm/FILM_03_loop_kokken_(total).webm",
		mp4: "video/spokesperson/mp4/FILM_03_loop_kokken_(total).m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_03_loop_TV_(closeup)",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_03_loop_TV_(closeup).ogv",
		webm: "video/spokesperson/webm/FILM_03_loop_TV_(closeup).webm",
		mp4: "video/spokesperson/mp4/FILM_03_loop_TV_(closeup).m4v",
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

	spokesperson.timestring.addMovie({
		id: "FILM_04",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_04.ogv",
		webm: "video/spokesperson/webm/FILM_04.webm",
		mp4: "video/spokesperson/mp4/FILM_04.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_TV_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: 18,
				action: function(api) {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
					dataObj.disableTitle();
					//spokesperson.lv1ShowSubItems($menuElem);
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_05",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_05.ogv",
		webm: "video/spokesperson/webm/FILM_05.webm",
		mp4: "video/spokesperson/mp4/FILM_05.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_06",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_06.ogv",
		webm: "video/spokesperson/webm/FILM_06.webm",
		mp4: "video/spokesperson/mp4/FILM_06.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_07",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_07.ogv",
		webm: "video/spokesperson/webm/FILM_07.webm",
		mp4: "video/spokesperson/mp4/FILM_07.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_08",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_08.ogv",
		webm: "video/spokesperson/webm/FILM_08.webm",
		mp4: "video/spokesperson/mp4/FILM_08.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_09",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_09.ogv",
		webm: "video/spokesperson/webm/FILM_09.webm",
		mp4: "video/spokesperson/mp4/FILM_09.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_TV",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--holdbarhed');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_10",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_10.ogv",
		webm: "video/spokesperson/webm/FILM_10.webm",
		mp4: "video/spokesperson/mp4/FILM_10.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: 7,
				action: function(api) {
					var $menuElem = $('.spokesperson__itemlv1--energi');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
					dataObj.disableTitle();
					//spokesperson.lv1ShowSubItems($menuElem);
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_11",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_11.ogv",
		webm: "video/spokesperson/webm/FILM_11.webm",
		mp4: "video/spokesperson/mp4/FILM_11.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_kokken",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--energi');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_12",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_12.ogv",
		webm: "video/spokesperson/webm/FILM_12.webm",
		mp4: "video/spokesperson/mp4/FILM_12.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_02_generel_outro_kokken",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--energi');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_13",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_13.ogv",
		webm: "video/spokesperson/webm/FILM_13.webm",
		mp4: "video/spokesperson/mp4/FILM_13.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(total)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: 43,
				action: function(api) {
					var $menuElem = $('.spokesperson__itemlv1--vindue');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
					dataObj.disableTitle();
					//spokesperson.lv1ShowSubItems($menuElem);
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_14",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_14.ogv",
		webm: "video/spokesperson/webm/FILM_14.webm",
		mp4: "video/spokesperson/mp4/FILM_14.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_18",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--vindue');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_15",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_15.ogv",
		webm: "video/spokesperson/webm/FILM_15.webm",
		mp4: "video/spokesperson/mp4/FILM_15.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_18",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--vindue');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_16",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_16.ogv",
		webm: "video/spokesperson/webm/FILM_16.webm",
		mp4: "video/spokesperson/mp4/FILM_16.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_18",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--vindue');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_17",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_17.ogv",
		webm: "video/spokesperson/webm/FILM_17.webm",
		mp4: "video/spokesperson/mp4/FILM_17.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_18",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: "__ended",
				action: function() {
					var $menuElem = $('.spokesperson__itemlv1--vindue');
					var dataObj = $menuElem.data("spokesperson");
					dataObj.forceShowSubItems();
				}
			}
		]
	});

	spokesperson.timestring.addMovie({
		id: "FILM_18",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_18.ogv",
		webm: "video/spokesperson/webm/FILM_18.webm",
		mp4: "video/spokesperson/mp4/FILM_18.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(closeup)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: 3,
				action: function(api) {
					//show group
					api.showGroup("vindueLinksGroup");
				}
			}
		]
	});

	// 18 --> Åbne/lukke menu overlay

	spokesperson.timestring.addMovie({
		id: "FILM_19",
		scene: "SpokesPerson",
		//ogg: "video/spokesperson/ogv/FILM_19.ogv",
		webm: "video/spokesperson/webm/FILM_19.webm",
		mp4: "video/spokesperson/mp4/FILM_19.m4v",
		triggers: [
			{
				trigger: "__ended",
				target: "FILM_03_loop_kokken_(total)",
				action: function(api) {
					api.target.goto(0);
					api.target.play();
				}
			},
			{
				trigger: 3,
				action: function(api) {
					//show group
					console.log("show indhentTilbudGroup");
					api.showGroup("indhentTilbudGroup");
				}
			}
		]
	});

	// 19 --> Gå til... diverse ting



	spokesperson.timestring.init();






});

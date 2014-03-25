package  {
	
	import flash.display.MovieClip;
	import fl.video.*;
	import flash.external.*;
	import flash.events.Event;
	
	public class timestring_playerscript extends MovieClip {
		
		public function timestring_playerscript() {
			// constructor cod
			var parameters=this.loaderInfo.parameters;
      		timestring_player.source=parameters.src;
      		timestring_player.addEventListener(VideoEvent.COMPLETE, this.completeHandler);
			
			
			
			if (ExternalInterface.available) {
				
				ExternalInterface.addCallback("setSrc", setSrc);
			
				
				
				
			}
			
		}
		
		function completeHandler(event:VideoEvent):void {
			//comFlvplayer.seek(0);
		  	//comFlvplayer.play();
			ExternalInterface.call("", event)
		}
		function registerEvent(eventName:String) {
			
		}
		function goto(time:int) {
			timestring_player.seek(time);
		}
		function setSrc():void {
			//setSrc
			ExternalInterface.call('console.log', "It works");
		}
	
	
		
		
	
		
		
		//xternalInterface.addCallback("myFlashMethod", myFlashMethod);
		//ExternalInterface.call("myJavascriptFunction");
		
	}
	
}

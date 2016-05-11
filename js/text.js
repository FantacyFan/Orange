(function(){
		window.onload=function(){

			var c = document.getElementById('c'),
				ctx =  c.getContext('2d');

			var c2 = document.createElement('canvas'),
				ctx2 = c2.getContext('2d');		

            var landpage =document.getElementById('landpage');			

			c.width = landpage.clientWidth;
			c.height =  landpage.clientHeight;

			var W = c.width,
				H = c.height;

			var colors=['#1EFEC5','#F2CE62','#A7F272','#81CFFB','#F76661'];
			var particles=[];
			var offset=5;
			var fontBase = W,                   
   				fontSize = 70;

			function getPosition(){
				c2.width = landpage.clientWidth;
				c2.height =  landpage.clientHeight;

				ctx2.fillStyle = "#000000";
                ctx2.textAlign='center';
				ctx2.font=getFont();
				ctx2.fillText("创投行业关系及布局分析", W/2, H/2.5);

				imageData = ctx2.getImageData(0, 0, W, H);
				
				particles=[];			

				for(var i= 0; i < c2.height; i += offset){
	            	for(j = 0; j <c2.width; j += offset){   
	               		var pixel = imageData.data[((j + (i * c2.width)) * 4) - 1];
	                  	if(pixel == 255) {
	                    	particles.push(new Particle(j,i));
	                  	}
	            	}
	        	}
      	  	}

      	  	function getFont(){
      	  		var ratio = fontSize/fontBase;
      	  		var size =  W*ratio;
      	  		return (size|0)+'px impact';
      	  	}
     
        	function draw(){
        		ctx.globalCompositeOperation = "source-over";
        		ctx.globalAlpha = 0.5;
        		ctx.fillStyle="#202B33";
        		ctx.fillRect(0,0,W,H);
	        	for(var i = 0; i<particles.length;i++){
	        		var p =particles[i];

	        		p.display();
	        		p.update();
	        	}
        	}

        	function Particle(_x,_y){
        		this.x=_x;
        		this.y=_y;
        		this.speed=Math.random()*2+0.3;
        		this.angle=Math.random()*360;
        		this.color =  colors[Math.floor(Math.random()*5)];
        		this.radius=Math.random()*3+1;
        		//this.life=100;
        		this.flag=Math.floor(Math.random()*2);

        		this.display = function(){
        			ctx.fillStyle=this.color;
        			ctx.strokeStyle=this.color;	
                  	ctx.beginPath();
                    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
                    ctx.closePath();
                   // ctx.stroke();
                    ctx.fill();
        		}

        		this.update = function(){
        			this.speed=Math.random()*2+0.3;	
        			
        			if(this.flag===1){
        				this.radius+=0.05;
        				if(this.radius>5){
        					this.flag=0;
        				}
        			}
        			if(this.flag==0){
        				this.radius-=0.05;
        				if(this.radius<2){
        					this.flag=1;
        				}
        			}
        			// this.life--;
        			// if(this.life<0){
        			// 	this.restart();
        			// }
        		}
        		// this.restart=function(){
        		// 	this.x=_x;
	        	// 	this.y=_y;
	
	        	// 	this.radius=Math.random()*3+1;
	        	// 	this.life=100;
        		// }
        	}

        	getPosition();
        	setInterval(draw,30);

			window.addEventListener('resize',function(){
				W = c.width = landpage.clientWidth;
				H = c.height = landpage.clientHeight;
				getPosition();
			},false)
		}
}());
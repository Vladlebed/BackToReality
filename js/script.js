function startGame(){
	document.querySelector('.starts').style.display = 'none';
	let start = false;
	let cnv = document.createElement('CANVAS');
	let ctx = cnv.getContext('2d');

	let w = cnv.width = innerWidth;
	let h = cnv.height = innerHeight;
	let frame = 0;
	let killCount = 0; 

	document.body.appendChild(cnv);

	let backgroundGame = new Image();
	backgroundGame.src = './img/bgArt.jpg';


	let birdImg = new Image();
	birdImg.src = './img/n1.png';
	let bird2Img = new Image();
	bird2Img.src = './img/n2.png';

	let bloodImg = new Image();
	bloodImg.src = 'img/blood.png';

	let config = {
		bird : {
			width: 120,
			height: 120,
		},
		group: [],
		blood: []
	}

	let audio1 = new Audio();
	let audio2 = new Audio();
	audio1.src = 'audio/sterva.mp3';
	audio2.src = 'audio/yasher.mp3';

	let music = new Audio();
	music.src = 'audio/musicBird.mp3';
	music.volume = 0.5;

	sound();

	document.querySelectorAll('.kill')[0].style.opacity = '1';
	document.querySelectorAll('.kill')[1].style.opacity = '1';

	function voice(){
		if(Math.round(Math.random() * 10) > 4){
			audio1.play()
		}
		else {
			audio2.play()
		}
	}

	let clickCount = 0;

	function clickAdd(){
		clickCount++;
		clickBox.innerHTML = clickCount;
	}

	function bloodRender(x,y){
		config.blood.push([x,y])
	}


	window.onresize = function(){
		w = cnv.width = innerWidth;
		h = cnv.height = innerHeight;
		init()
	}

	function game(){
		frame++;
		if(frame <= 20) {updateBrid()}
			if(config.group.length <= 0){
				music.pause();
				alert('WIN!!!')
				document.location.reload();
			}
			update()
			init()
			requestAnimationFrame(game)
		}

		function update(){

			for(i in config.group){
				//физика

				if(config.group[i][3].speed > 0){
					config.group[i][2] = true;
				}
				config.group[i][0] = config.group[i][0] + config.group[i][3].speed;			

				config.group[i][1] = config.group[i][1] + config.group[i][3].directionChange;
				
				if(config.group[i][0] >= w - config.bird.width || config.group[i][0]<=0){
					config.group[i][3].speed = -config.group[i][3].speed;
					config.group[i][2] = false;
				}
				if(config.group[i][1] >= h - config.bird.height || config.group[i][1]<=0){
					config.group[i][3].directionChange = -config.group[i][3].directionChange;
				}

			}
		}

		let clickBox = document.querySelector('#click');

		function addBird (event) {
			if(event.clientX > 75 && event.clientX < w - 75 && event.clientY > 75 && event.clientY < h - 75){
				config.group.push([event.clientX - config.bird.width / 2,event.clientY - config.bird.width / 2,true,{speed: Math.round(Math.random(2) * 15),directionChange: Math.round(Math.random(1) * 10)}])
			}
		};

		function killBird (event) {
			clickAdd();
			for(i in config.group){
				if(event.clientX <= config.group[i][0] + config.bird.width && event.clientX >= config.group[i][0]
					&& event.clientY <= config.group[i][1] + config.bird.height && event.clientY >= config.group[i][1]){
					config.group.splice([i],1);
				killCount++;
				kill.innerHTML = killCount;
				voice();
				bloodRender(event.clientX,event.clientY);
			}
		}
	}

	function updateBrid(){
		let x = Math.round(Math.random() * w - config.bird.width)
		let y = Math.round(Math.random() * h - config.bird.height)
		let speed = Math.round(Math.random(2) * 15)
		let dir =  Math.round(Math.random(1) * 10)
		config.group.push([x,y,true,{speed: speed,directionChange: dir}])
	}

	function drawBird(direction) {
		if(direction) return birdImg
			else return bird2Img
		}

	function init () {
		ctx.drawImage(backgroundGame,0,0,w,h)
		for(i in config.group){
			ctx.drawImage(drawBird(config.group[i][2]),config.group[i][0],config.group[i][1],config.bird.width,config.bird.height)
		}
		for(i in config.blood){
			ctx.drawImage(bloodImg,config.blood[i][0],config.blood[i][1],100,100);
			setTimeout(()=>{
				config.blood.splice(i,1);
			}, 1000)
		}
	}

	backgroundGame.onload = ()=> {
		game()
	}

	function sound(){
		if(!start){
			music.play();
			start = true;
		}
	}

	cnv.addEventListener('click',killBird);
}
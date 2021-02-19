window.addEventListener('load', ()=>{
    let screen = document.querySelector('.game-screen');
    let screenRect = screen.getBoundingClientRect();
    console.log(screenRect); // bottom: 793.5 height: 650 left: 308 right: 1508 top: 143.5 width: 1200 x: 308 y: 143.5

    let canvas = screen.querySelector('.canvas');

    canvas.width = screenRect.width;
    canvas.hidth= screenRect.height;
    
    console.log(screenRect.width)
    let ctx = canvas.getContext('2d');
    ctx.font = '400 25px MaplestoryOTFBold';


    //상속할 클래스
    class Obj {
        #x; #y; //위치
        #width; #height;

        constructor(x=0, y=0, width=0, height=0){
            this.#x = x;
            this.#y = y;
            this.#width = width;
            this.#height = height;
        }
        get x(){
            return this.#x;
        }

        get y(){
            return this.#y;
        }

        get width(){
            return this.#width;
        }

        get height(){
            return this.#height;
        }

        set x(value){
            this.#x = value;
        }

        set y(value){
            let minY = 0;
            let maxY = screenRect.height - (this.#height);
            if (value < minY){
                this.#y = minY;
            }else if(value > maxY){
                this.#y = maxY;
            }else {
                this.#y = value;
            }
        }
    }

    //램덤값 만들기
    function random(max){
        return Math.floor(Math.random()*max); //0 max-1;

    }
    //램덤값 만들기2
    function random2(){
        return Math.random()*2;
    }

    //타이머
    class Timer {
        #time;
        constructor(time = 0){
            this.#time = time;
        }

        get time(){
            return this.#time;
        }

        set time(value){
            this.#time = value;
        }
    }

    //정보
    class Info {
        #score;
        #life;
        constructor(score = 0, life=3){
            this.#score = score;
            this.#life = life;
        }


        get score(){
            return this.#score;
        }

        set score(value){
            this.#score = value;
        }


        get life(){
            return this.#life;
        }

        set life(value){
            this.#life= value;
        }

    }


    //상황판
    class Board extends Obj{
        #time;
        #score;

        constructor(x, y, time = 0, score = 0){
            super(x, y)
            this.#time = time;
            this.#score = score;
           
        }

        get score(){
            return this.#score;
        }

        set score(value){
            this.#score = value;
        }

        get time(){
            return this.#time;
        }

        set time(value){
            this.#time = value;
        }

        
        draw(){
            ctx.fillText( '점수 : '+ this.#score +'   시간 : ' + this.#time , this.x, this.y)
        }
    }
   

    //미사일    
    class Missile extends Obj {
        #x2; //도착지점
        #speed; //속도
        #missileImg;
        constructor(x, y, width, height, x2=0){
            super(x, y, width=75, height=28);
            
            //시작지점
            this.x = screenRect.width;
            this.y = random(screenRect.height)-this.height;


            this.#x2 = (-this.width);
            this.#speed = random(5) + 5; 
            //console.log(`미사일 클래스  생성, 스피드는? ${this.#speed}, y지점? ${this.y}`);

            this.#missileImg = new Image();
            this.#missileImg.src = 'images/missile.png';    
        }

        get x2(){
            return this.#x2;
        }

        draw(){
            ctx.drawImage(this.#missileImg, 0, 0, this.width, this.height,
                        this.x, this.y,  this.width, this.height);
        }

        update(){
            if(this.x > this.#x2){
                this.x -=this.#speed;  
            }
            this.draw();
        }
    }


    //생명
    class Life extends Obj{
        #lifeImg;

        constructor(x, y, width, height){
            super(x, y, width=25, height=23);
            this.#lifeImg = new Image;
            this.#lifeImg.src  = 'images/life.png';   
        }

        draw(){
            ctx.drawImage(this.#lifeImg, 0, 0, this.width, this.height,
                        this.x, this.y,  this.width, this.height);
        }

    }

    //Ufo
    class Ufo extends Obj {
        #ufoImg;
        #index;
        #changeIndex;
        constructor(x, y, width, height, keyCount=0){
            super(x, y, width, height);
            this.#ufoImg = new Image();
            this.#ufoImg.src = 'images/ufo.png';  

            this.#index =1;
            this.#changeIndex = 1;
        }
        
        draw(){
            this.#changeIndex++
            if( this.#changeIndex%30 == 0){
                this.#index = (++this.#index)%4  //0 1 2 3 
                console.log(this.#index)
            }
            ctx.drawImage(this.#ufoImg, 
                this.width * this.#index, 0,
                this.width , this.height,
                this.x, this.y,  this.width, this.height);
        }
        update(){
        }
    }

    //게임종료 점수
    class EndBox extends Obj {
        #time;
        #score;
        #sum
        constructor(x, y, time = 0, score = 0){
            super(x, y)
            this.#time = time;
            this.#score = score;
            this.#sum = time * score;  
        }

        get score(){
            return this.#score;
        }

        set score(value){
            this.#score = value;
        }

        get time(){
            return this.#time;
        }

        set time(value){
            this.#time = value;
        }
   
        draw(){
            ctx.font = '400 32px MaplestoryOTFBold';
            ctx.textAlign='center';
            ctx.fillText( '점수 : '+ this.#score +'(점)   시간 : ' + this.#time +'(초)' , this.x, this.y);
            ctx.textAlign='center';
            ctx.font = '400 58px MaplestoryOTFBold';
            ctx.fillText('총점 : ' + this.#sum  +'점입니다.....' , this.x, this.y + 85)
        }
    }

    
   
    let endBox;

    //게임시작함수
    function gameStart(){
        let board = new Board(970, 35);
        let timer = new Timer();
        let info = new Info();

       

        //타이머 (비동기)
        (async function(){
             setInterval(() => {
                timer.time = (timer.time+1);
                board.time = timer.time;
                board.score = (board.score+1);
            },1000);
        })()

       
        let ufo = new Ufo(200, 250, 110, 100);
        let lifeArr = [];
        for(let i = 0; i<3; i++){
            lifeArr[i] = new Life(920 - 35*i, 16);
        }
        console.log(lifeArr)
       
        let missileCycle = 1000;
        let missiles = new Set();

        function init(){
            (async function(){
                setInterval(() => {
                    missileCycle = Math.floor(Math.random()*1000) * 10; //미사일 생성주기
                 
                    missiles.add(new Missile());
                }, missileCycle);
            }());
    
        }
    
        let animate = function(){
           // console.log(missiles);
           loopAni = window.requestAnimationFrame(animate);
           ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            for(let item of missiles){
                
    
                //충돌 확인
                if(item.x <=ufo.x+ufo.width && ufo.x <= item.x+item.width &&
                    item.y <= ufo.y + ufo.height && ufo.y <= item.y+ item.height){
                        console.log("충돌!!!!!!!!!!!");
                        missiles.delete(item);
                        info.life = info.life-1;
                        if(info.life == -1){
                           endBox= new EndBox(canvas.width/2, 240, board.time, board.score);
                           gameEnd();
                           return null;  
                        }

                        console.log("a :" + info.life)
                        if(info.life > -1){
                            delete lifeArr[info.life]
                        }
                      
                        
                }  
    
                if(item.x<= item.x2){
                    missiles.delete(item);
                }
    
                item.update();
            }

            lifeArr.forEach(item=>{
                item.draw();
            })
            ufo.draw();
            board.draw();
        }

        
        init();
        animate();


        //키보드 이벤트
        document.addEventListener('keydown',(e)=>{
            //console.log(e)
            if(e.key == 'ArrowUp') {
                ufo.y = (ufo.y- 20);
                info.score = info.score+1;
                board.score = info.score;
                
            }
            if(e.key == 'ArrowDown') {
                ufo.y = (ufo.y + 20);
                info.score = info.score+1;
                board.score = info.score;
            }
        });
       
    }
    

    //게임종료함수
    function gameEnd(){
        window.cancelAnimationFrame(loopAni);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        endBox.draw();    
    }

    //게임시작 버튼
    let startBtn = document.querySelector('.game-start-btn');
    let tit = document.querySelector('.title');

    //스토리 보기
    let closeBtn = document.querySelector('.close-btn');
    let storyBox = document.querySelector('.story-box');
    let storyBtn = document.querySelector('.story-btn');



    startBtn.addEventListener('click', (e)=>{
        e.preventDefault();

        startBtn.classList.add('hide');
        tit.classList.add('hide');
        storyBtn.classList.add('hide');
        gameStart();
    });

    storyBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        storyBtn.classList.add('hide');
        storyBox.classList.add('show');
    });

    closeBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        storyBox.classList.remove('show');
        storyBtn.classList.remove('hide');
    });

})
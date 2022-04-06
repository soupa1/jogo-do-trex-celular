var player, playerAnim, playerDeath;
var borda;
var chao, chaoSpr;
var chaoInv;
var nuvem, nuvemSpr;
var obs1, obs2, obs3, obs4, obs5, obs6;
var pontuacao;
var grupoNuvens;
var grupoObstaculos;
var JOGANDO = 1;
var ACABOU = 0;
var estado = JOGANDO;

var gameOverSpr,gameOverImg;
var restartSpr,restartImg;

//Sons
var checkPoint;
var death;
var jump;

var mensagem = "Isso é uma mensagem";


function preload(){
    playerAnim = loadAnimation("./Imagens/trex1.png","./Imagens/trex3.png", "./Imagens/trex4.png");

    chaoSpr = loadImage("./Imagens/ground2.png");

    nuvemSpr = loadImage("./Imagens/cloud.png");

    obs1 = loadImage("./Imagens/obstacle1.png");
    obs2 = loadImage("./Imagens/obstacle2.png");
    obs3 = loadImage("./Imagens/obstacle3.png");
    obs4 = loadImage("./Imagens/obstacle4.png");
    obs5 = loadImage("./Imagens/obstacle5.png");
    obs6 = loadImage("./Imagens/obstacle6.png");

    playerDeath = loadAnimation("./Imagens/trex_collided.png");

    gameOverImg = loadImage("./Imagens/gameOver.png");
    restartImg = loadImage("./Imagens/restart.png");

    checkPoint = loadSound("./Sons/checkPoint.mp3");
    death = loadSound("./Sons/die.mp3")
    jump = loadSound("./Sons/jump.mp3");
}

function setup(){
    createCanvas(windowWidth,windowHeight);
    player = createSprite(50, height-70, 20, 50);
    player.addAnimation("correndo",playerAnim);
    player.addAnimation("morto", playerDeath);
    player.frameDelay = 4;
    player.scale = 0.5;

    borda = createEdgeSprites();

    chao = createSprite(width/2,height-80,width,125);
    chao.addImage("chao",chaoSpr);
    chao.x = chao.width/2;
    chaoInv = createSprite(width/2,height-10,width,125);
    chaoInv.visible = false;

    gameOverSpr = createSprite(width/2,height/2-50);
    gameOverSpr.addImage(gameOverImg);
    restartSpr = createSprite(width/2, height/2);
    restartSpr.addImage(restartImg);
    restartSpr.scale = 0.5;

    pontuacao = 0;

    grupoNuvens =  new Group();
    grupoObstaculos = new Group();

    //var numero = Math.round(random(1,100));
    //console.log(numero);

    player.setCollider("circle",0,0,40)
    player.debug = false;
    
}

function draw(){
    background("white");
    //console.log(frameCount);
    //console.log(player.y);
    //console.log(estado);
    //console.log(mensagem);

    if(estado === JOGANDO){
        chao.velocityX = -(4+pontuacao / 100);

        if(chao.x < 0){
            chao.x = chao.width/2;
        }

        if(keyDown("space")&&player.y >= height-120 || touches.length > 0 && player.y >= height-120){
            player.velocityY = -12;
            jump.play();
            touches = [];
        }

        player.velocityY += 1;


        nuvens();
        obstaculos();
        
        if (grupoObstaculos.isTouching(player)){
            estado = ACABOU;
            death.play();
        }

        pontuacao += Math.round(frameRate()/60);


        restartSpr.visible = false;
        gameOverSpr.visible = false;

        if(pontuacao % 100 === 0 && pontuacao > 0){
            checkPoint.play();
            checkPoint.setVolume(0.1);
        }

    } else if (estado === ACABOU){
        chao.velocityX = 0;
        grupoNuvens.setVelocityXEach(0);
        grupoObstaculos.setVelocityXEach(0);
        player.changeAnimation("morto");
        grupoObstaculos.setLifetimeEach(-1);
        grupoNuvens.setLifetimeEach(-1);
        player.velocityY = 0;
        restartSpr.visible = true;
        gameOverSpr.visible = true;
        
        if(mousePressedOver(restartSpr) || touches.length > 0){
            gameReset();
            touches = [];
        }
    }
    
    player.collide(chaoInv);
    drawSprites()
    text(pontuacao,50,height/2);
}

function gameReset(){
    estado = JOGANDO;
    restartSpr.visible = false;
    gameOverSpr.visible = false;
    grupoNuvens.destroyEach();
    grupoObstaculos.destroyEach();
    player.changeAnimation("correndo",playerAnim);
    pontuacao = 0;
}

function nuvens(){
    if(frameCount % 60 === 0){
        nuvem = createSprite(width+20,height-300,40,10);
        nuvem.addImage(nuvemSpr);
        nuvem.velocityX = -3;
        nuvem.y = Math.round(random(10,height/2));
        nuvem.lifetime = 250;
        nuvem.depth = player.depth;
        player.depth += 1;
        restartSpr.depth = player.depth;
        restartSpr.depth += 1;
        grupoNuvens.add(nuvem); 
    }
}


function obstaculos(){
    if(frameCount % 60 === 0){
        var obs = createSprite(width,height-95,10,40);
        obs.velocityX = -(6+pontuacao / 100);
        var numeroAlt = Math.round(random(1,6));
        switch(numeroAlt){
            case 1: obs.addImage(obs1);
            break;
            case 2: obs.addImage(obs2);
            break;
            case 3: obs.addImage(obs3);
            break;
            case 4: obs.addImage(obs4);
            break;
            case 5: obs.addImage(obs5);
            break;
            case 6: obs.addImage(obs6);
            break;
            default:
            break;
        }

        obs.scale = 0.5;
        obs.lifetime = 250;

        grupoObstaculos.add(obs);
    }
}
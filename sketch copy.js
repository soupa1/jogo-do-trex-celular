var player, playerAnim, playerParado;

function preload(){
  playerAnim = loadAnimation("./Imagens/trex1.png","./Imagens/trex3.png", "./Imagens/trex4.png");
  playerParado = loadAnimation("./Imagens/trex1.png");
}

function setup(){
  createCanvas(600,200)
  player = createSprite(50, 160, 20, 50);
  player.addAnimation("parado",playerParado);
  player.addAnimation("correndo",playerAnim);
  
 
}

function draw(){
  background("white");
  
  if(keyWentDown("d")){
    player.changeAnimation("correndo",playerAnim);
  }
  if(keyWentUp("d")){
    player.changeAnimation("parado",playerParado);
  }

  drawSprites();
}

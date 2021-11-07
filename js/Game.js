class Game {
  constructor() {
    this.leader=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
    this.moving=false;
  }

  getState(){
    database.ref("gameState").on("value",function(data){
      gameState=data.val()
    })
  }
  updateState(value){
    database.ref("/").update({
      gameState:value
    })
  }
  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount=player.getCount();
    car1=createSprite(width/2-150,height-100)
    car1.addImage(car1img)
    car1.scale=0.07;
    car2=createSprite(width/2+150,height-100)
    car2.addImage(car2img)
    car2.scale=0.07;
    cars=[car1,car2]
    fuelg=new Group()
    coing=new Group()
    obsg =new Group()
    this.addsprite(fuelg,10,fuelimg,0.02)
    this.addsprite(coing,16,coinimg,0.09)
    this.addsprite(obsg,10,obsimg,0.04)
  }
  addsprite(group,num,img,scale){
    for(var i=0;i<num;i++){
      var obj=createSprite(random(width/2-150,width/2+150),random(-height*4.5,height-100))
      obj.addImage(img)
      obj.scale=scale
      group.add(obj)
    }

  }
  play(){
    form.hidden()
    Player.getPlayersInfo()
    player.getcarsAtEnd();
    this.leader.html("Leaderboard")
    this.leader.position(width/3-60,40)
    this.leader1.position(width/3-60,80)
    this.leader2.position(width/3-60,130)
    
    if(allPlayers!==undefined){
    background("cyan")
    image(trackimg,0,-height*5,width,height*6)
    this.showleader()
    this.showLife()
    this.showFuel()
    var index=0
    for(var i in allPlayers)
    {
      index++;
      cars[index-1].position.x=allPlayers[i].positionX;
      cars[index-1].position.y=(height-allPlayers[i].positionY)
      if(index===player.index)
{
  camera.position.y=cars[index-1].position.y
  cars[index-1].overlap(fuelg,function(a,b){
    player.fuel=200;
    b.remove();
  })
  cars[index-1].overlap(coing,function(a,b){
    player.score=player.score+10
    player.updateDistance()
    b.remove();
  })
  if(player.fuel>0&& this.moving){
    player.fuel-=0.4
  }
  if(player.fuel<=0){
    gameState=2
    swal({
      title:"OUT OF FUEL",
      text:"Better luck next time",
      imageUrl:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/SMirC-thumbsdown.svg/1024px-SMirC-thumbsdown.svg.png"
    })
  }
}
      
    }
    if(keyIsDown(UP_ARROW)){
      this.moving=true
      player.positionY+=10;
      player.updateDistance()
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      player.positionX-=5;
      player.updateDistance()
    }
    if(keyIsDown(RIGHT_ARROW)&& player.positionX<width/2+260){
      player.positionX+=5;
      player.updateDistance()
    }
    if(player.positionY>height*6-100){
      gameState=2
      player.rank+=1;
      Player.updatecarsAtEnd(player.rank)
      swal({
        title:"Finish",
        text:player.rank
      })
    }
    drawSprites()
    }
  }

  showleader(){
    var player=Object.values(allPlayers)
    var leader1 =player[0].rank+"   "+player[0].name+"   "+player[0].score;
    var leader2 =player[1].rank+"   "+player[1].name+"   "+player[1].score;
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }
  showLife(){
    fill("white")
     rect(width/2-100,height-player.positionY-200,200,20)
     
     fill("red")
     rect(width/2-100,height-player.positionY-200,player.life,20)
   } 

   showFuel(){
    fill("white")
     rect(width/2-100,height-player.positionY-150,200,20)
     
     fill("green")
     rect(width/2-100,height-player.positionY-150,player.fuel,20)
   } 
}

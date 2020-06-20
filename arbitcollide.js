
window.addEventListener('DOMContentLoaded', (event) =>{


    
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)

        }

        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.lens = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }
    }


    class Observer{
        constructor(){
            this.body = new Circle( 500, 500, 5, "white")
            this.ray = []
            this.rayrange = 220
            this.globalangle = Math.PI
            this.gapangle = Math.PI/8
            this.currentangle = 0
            this.obstacles = []
            this.raymake = 40
        }

        beam(){
            this.currentangle  = this.gapangle/2
            for(let k = 0; k<this.raymake; k++){
                this.currentangle+=(this.gapangle/Math.ceil(this.raymake/2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
                ray.collided = 0
                ray.lifespan = this.rayrange-1
                this.ray.push(ray)
            }
            for(let f = 3; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided < 1){
                        this.ray[t].move()
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.obstacles[q].isPointInside(this.ray[t])){
                            this.ray[t].collided = 1
                        }
                      }
                    }
                }
            }
        }

        draw(){
            this.beam()
            this.body.draw()
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.strokeStyle = "red"
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)
            for(let y = 0; y<this.ray.length; y++){
                    tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                        tutorial_canvas_context.lineTo(this.body.x, this.body.y)
                }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fill()
            this.ray =[]
        }

        control(){
            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }
            if(keysPressed['w']){
                this.body.y-=2
            }
            if(keysPressed['d']){
                this.body.x+=2
            }
            if(keysPressed['s']){
                this.body.y+=2
            }
            if(keysPressed['a']){
                this.body.x-=2
            }
        }
    }

    class Shape{
        constructor(){
            this.circle = new Circle(360,350, 50, "red")
            this.circle2 = new Circle(330,350, 50, "red")
            this.rectangle = new Rectangle(300,300, 70, 70, "red")
            this.triangle = new Triangle(350,350, "red", 40)

        }
        isPointInside(point){
            if(this.circle.isPointInside(point)){
                if(this.circle2.isPointInside(point)){
                if(this.rectangle.isPointInside(point)){
                    if(this.triangle.isPointInside(point)){
                        return true
                    }
                }
            }
        }
            return false
        }

    }

    let observer = new Observer()

    let shape = new Shape()

    observer.obstacles.push(shape)


    

   
    window.setInterval(function(){ 
        // tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)
        observer.draw()
        observer.control()
    }, 14) 



        
})
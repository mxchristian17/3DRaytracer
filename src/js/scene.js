const pinturaRoja = new Material({ r:255, g:0, b:0, a:255 }, 0)
const pinturaAzul = new Material({ r:0, g:0, b:255, a:255 }, 0.5)
const pinturaVerde = new Material({ r:0, g:255, b:0, a:255 }, 0.5)
const pinturaBlanca = new Material({ r:255, g:255, b:255, a:255 }, 0)

const camera = {
    position: {
        x: 5000,
        y: 500,
        z: 1500
    },
    target: {
        x: 2000,
        y: 3000,
        z: 1000
    },
    zoom: 1,
    fov: 95,   
}

let objects = []

objects.push(newInnerBox(0,0,0,6000,6000,2400,pinturaBlanca))
objects.push(newOuterBox(2500,2500,800,1600,800,100,pinturaBlanca))
objects.push(newOuterBox(2500,2500,0,100,800,800,pinturaBlanca))
objects.push(newOuterBox(4000,2500,0,100,800,800,pinturaBlanca))

objects.push(newOuterBox(20,5980,0,5960,20,120,pinturaBlanca))
objects.push(newOuterBox(5980,20,0,20,5960,120,pinturaBlanca))
objects.push(newOuterBox(20,20,0,20,6000,120,pinturaBlanca))
objects.push(newOuterBox(20,20,0,6000,20,120,pinturaBlanca))

objects.push(newOuterBox(500,3000,300,300,300,300,pinturaBlanca))

//objects.push(newOuterCube(0,0,0,1,pinturaRoja))
//objects.push(newOuterCube(3,3,1,1,pinturaAzul))
const rand = (max) => {return Math.floor(Math.random() * max)}
const randMat = () => {const mats = [pinturaBlanca, pinturaAzul, pinturaRoja, pinturaVerde]; return mats[Math.floor(Math.random() * mats.length)]}
//for(i=0;i<100;i++) objects.push(newOuterCube(rand(20),rand(20),rand(10),rand(3)/*i,i,i,1*/, randMat()))

let polygons = [
    /*
    //Outer cube
    new polygon([{x:0,y:1,z:0}, {x:1,y:1,z:0}, {x:1,y:0,z:0}], pinturaRoja),
    new polygon([{x:0,y:0,z:0}, {x:0,y:1,z:0}, {x:1,y:0,z:0}], pinturaRoja),
    new polygon([{x:0,y:0,z:1}, {x:0,y:0,z:0}, {x:1,y:0,z:0}], pinturaRoja),
    new polygon([{x:1,y:0,z:1}, {x:0,y:0,z:1}, {x:1,y:0,z:0}], pinturaRoja),
    new polygon([{x:0,y:1,z:0}, {x:0,y:0,z:0}, {x:0,y:0,z:1}], pinturaRoja),
    new polygon([{x:0,y:1,z:0}, {x:0,y:0,z:1}, {x:0,y:1,z:1}], pinturaRoja),
    new polygon([{x:0,y:1,z:1}, {x:0,y:1,z:0}, {x:1,y:1,z:0}], pinturaRoja),
    new polygon([{x:1,y:1,z:0}, {x:1,y:1,z:1}, {x:0,y:1,z:1}], pinturaRoja),
    new polygon([{x:1,y:1,z:0}, {x:1,y:0,z:0}, {x:1,y:0,z:1}], pinturaRoja),
    new polygon([{x:1,y:0,z:1}, {x:1,y:1,z:1}, {x:1,y:1,z:0}], pinturaRoja),
    new polygon([{x:0,y:0,z:1}, {x:1,y:0,z:1}, {x:1,y:1,z:1}], pinturaRoja),
    new polygon([{x:0,y:0,z:1}, {x:1,y:1,z:1}, {x:0,y:1,z:1}], pinturaRoja),

    new polygon([{x:0+5,y:1+5,z:0}, {x:1+5,y:1+5,z:0}, {x:1+5,y:0+5,z:0}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:0}, {x:0+5,y:1+5,z:0}, {x:1+5,y:0+5,z:0}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:0}, {x:0+5,y:0+5,z:1}, {x:1+5,y:0+5,z:0}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:1}, {x:1+5,y:0+5,z:1}, {x:1+5,y:0+5,z:0}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:0}, {x:0+5,y:1+5,z:0}, {x:0+5,y:0+5,z:1}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:1}, {x:0+5,y:1+5,z:0}, {x:0+5,y:1+5,z:1}], pinturaAzul),
    new polygon([{x:0+5,y:1+5,z:1}, {x:0+5,y:1+5,z:0}, {x:1+5,y:1+5,z:0}], pinturaAzul),
    new polygon([{x:1+5,y:1+5,z:0}, {x:1+5,y:1+5,z:1}, {x:0+5,y:1+5,z:1}], pinturaAzul),
    new polygon([{x:1+5,y:0+5,z:0}, {x:1+5,y:1+5,z:0}, {x:1+5,y:0+5,z:1}], pinturaAzul),
    new polygon([{x:1+5,y:0+5,z:1}, {x:1+5,y:1+5,z:1}, {x:1+5,y:1+5,z:0}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:1}, {x:1+5,y:0+5,z:1}, {x:1+5,y:1+5,z:1}], pinturaAzul),
    new polygon([{x:0+5,y:0+5,z:1}, {x:1+5,y:1+5,z:1}, {x:0+5,y:1+5,z:1}], pinturaAzul),

    new polygon([{x:0+10,y:1+10,z:0}, {x:1+10,y:1+10,z:0}, {x:1+10,y:0+10,z:0}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:0}, {x:0+10,y:1+10,z:0}, {x:1+10,y:0+10,z:0}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:0}, {x:0+10,y:0+10,z:1}, {x:1+10,y:0+10,z:0}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:1}, {x:1+10,y:0+10,z:1}, {x:1+10,y:0+10,z:0}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:0}, {x:0+10,y:1+10,z:0}, {x:0+10,y:0+10,z:1}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:1}, {x:0+10,y:1+10,z:0}, {x:0+10,y:1+10,z:1}], pinturaVerde),
    new polygon([{x:0+10,y:1+10,z:1}, {x:0+10,y:1+10,z:0}, {x:1+10,y:1+10,z:0}], pinturaVerde),
    new polygon([{x:1+10,y:1+10,z:0}, {x:1+10,y:1+10,z:1}, {x:0+10,y:1+10,z:1}], pinturaVerde),
    new polygon([{x:1+10,y:0+10,z:0}, {x:1+10,y:1+10,z:0}, {x:1+10,y:0+10,z:1}], pinturaVerde),
    new polygon([{x:1+10,y:0+10,z:1}, {x:1+10,y:1+10,z:1}, {x:1+10,y:1+10,z:0}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:1}, {x:1+10,y:0+10,z:1}, {x:1+10,y:1+10,z:1}], pinturaVerde),
    new polygon([{x:0+10,y:0+10,z:1}, {x:1+10,y:1+10,z:1}, {x:0+10,y:1+10,z:1}], pinturaVerde),

    //inner cube
    new polygon([{x:40,y:40,z:0}, {x:-20,y:40,z:0}, {x:40,y:-20,z:0}], pinturaBlanca),
    new polygon([{x:-20,y:40,z:0}, {x:-20,y:-20,z:0}, {x:40,y:-20,z:0}], pinturaBlanca),
    new polygon([{x:-20,y:-20,z:0}, {x:-20,y:-20,z:40}, {x:40,y:-20,z:0}], pinturaBlanca),
    new polygon([{x:-20,y:-20,z:40}, {x:40,y:-20,z:40}, {x:40,y:-20,z:0}], pinturaBlanca),
    new polygon([{x:-20,y:-20,z:0}, {x:-20,y:40,z:0}, {x:-20,y:-20,z:40}], pinturaBlanca),
    new polygon([{x:-20,y:-20,z:40}, {x:-20,y:40,z:0}, {x:-20,y:40,z:40}], pinturaBlanca),
    new polygon([{x:-20,y:40,z:40}, {x:-20,y:40,z:0}, {x:40,y:40,z:0}], pinturaBlanca),
    new polygon([{x:40,y:40,z:0}, {x:40,y:40,z:40}, {x:-20,y:40,z:40}], pinturaBlanca),
    new polygon([{x:40,y:40,z:0}, {x:40,y:-20,z:0}, {x:40,y:-20,z:40}], pinturaBlanca),
    new polygon([{x:40,y:-20,z:40}, {x:40,y:40,z:40}, {x:40,y:40,z:0}], pinturaBlanca),
    new polygon([{x:40,y:-20,z:40}, {x:-20,y:-20,z:40}, {x:40,y:40,z:40}], pinturaBlanca),
    new polygon([{x:40,y:40,z:40}, {x:-20,y:-20,z:40}, {x:-20,y:40,z:40}], pinturaBlanca)*/
]
let lights = [
    //new light({x:15,y:15,z:5}, new Vector(1,0,0), 80, 180, 1, { r:255, g:0, b:0 }, 1, 30),
    new light({x:3000,y:500,z:2350}, new Vector(0,0,-1), 360, 360, 1, { r:255, g:255, b:255 }, 1000, 5000)
]
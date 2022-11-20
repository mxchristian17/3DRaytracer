const pinturaRoja = new Material({ r:255, g:0, b:0, a:255 }, 0)
const pinturaAzul = new Material({ r:0, g:0, b:255, a:255 }, 0.5)
const pinturaVerde = new Material({ r:0, g:255, b:0, a:255 }, 0.5)
const pinturaBlanca = new Material({ r:255, g:255, b:255, a:255 }, 0)

let objects = []

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
    new light({x:15,y:15,z:5}, new Vector(1,0,0), 80, 180, 1, { r:255, g:0, b:0 }, 1, 30),
    new light({x:0.5,y:-0.5,z:1.5}, new Vector(0,0,-1), 120, 180, 1, { r:255, g:255, b:255 }, 1, 30)
]
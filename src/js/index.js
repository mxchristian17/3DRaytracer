const canvas = document.getElementById("canvas")
let canvasWidth = 700//window.innerWidth
let canvasHeight = 500//window.innerHeight
const context = canvas.getContext("2d") // create context

const options = {
    width: canvasWidth,
    height: canvasHeight
}

const kEpsilon = 0.00001; // value to be considered 0 at paralellism evaluation
const infinite = 99999999999999;

class Vector {

    constructor(...components) {
        this.components = components
    }

    x() { return this.components[0] }
    y() { return this.components[1] }
    z() { return this.components[2] }
  
    clone() {
        return new Vector(...this.components)
    }
    add({ components }) {
        return new Vector(
        ...components.map((component, index) => this.components[index] + component)
        )
    }
    subtract({ components }) {
        return new Vector(
        ...components.map((component, index) => this.components[index] - component)
        )
    }
    scaleBy(number) {
        return new Vector(
            ...this.components.map(component => component * number)
        )
    }
    length() {
        return Math.hypot(...this.components)
    }
    length2() {
        return (Math.pow(this.x(), 2) + Math.pow(this.y(), 2) + Math.pow(this.z(), 2))
    }
    dotProduct({ components }) {
        return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
    }
    normalize() {
        return this.scaleBy(1 / this.length())
    }
    haveSameDirectionWith(other) {
        const dotProduct = this.normalize().dotProduct(other.normalize())
        return areEqual(dotProduct, 1)
    }
    haveOppositeDirectionTo(other) {
        const dotProduct = this.normalize().dotProduct(other.normalize())
        return areEqual(dotProduct, -1)
    }
    isPerpendicularTo(other) {
        const dotProduct = this.normalize().dotProduct(other.normalize())
        return areEqual(dotProduct, 0)
    }
    // 3D vectors only
    crossProduct({ components }) {
        return new Vector(
            this.components[1] * components[2] - this.components[2] * components[1],
            this.components[2] * components[0] - this.components[0] * components[2],
            this.components[0] * components[1] - this.components[1] * components[0]
        )
    }
    angleBetween(other) {
        return radToDegree(
            Math.acos(
                this.dotProduct(other) /
                (this.length() * other.length())
            )
        )
    }
    negate() {
        return this.scaleBy(-1)
    }
    projectOn(other) {
        const normalized = other.normalize()
        return normalized.scaleBy(this.dotProduct(normalized))
    }
    withLength(newLength) {
        return this.normalize().scaleBy(newLength)
    }
    equalTo({ components }) {
        return components.every((component, index) => areEqual(component, this.components[index]))
    }

}

class ray {
    constructor(origin, direction) {
        this.orig = origin
        this.dir = direction
    }

    origin() { return new Vector(this.orig.x,this.orig.y,this.orig.z) }
    direction() { return this.dir }
    at(t) { return this.orig + t * this.dir }

}

class polygon {
    constructor(points, material) {
        this.points = points
        this.material = material
    }

    middle () {
        let x = ( this.points.reduce((tot,num) => tot+num.x, 0) ) / this.points.length
        let y = ( this.points.reduce((tot,num) => tot+num.y, 0) ) / this.points.length
        let z = ( this.points.reduce((tot,num) => tot+num.z, 0) ) / this.points.length
        return { x:x, y:y, z:z }
    }

    normal () {
        let r = new Vector(
            this.points[1].x - this.points[0].x,
            this.points[1].y - this.points[0].y,
            this.points[1].z - this.points[0].z
        )
        let s = new Vector (
            this.points[2].x - this.points[1].x,
            this.points[2].y - this.points[1].y,
            this.points[2].z - this.points[1].z
        )
        return s.crossProduct(r)
    }

    intersect (ray) {
        const NdotRayDirection = this.normal().dotProduct(ray.direction());
        if (Math.abs(NdotRayDirection) < kEpsilon ) { /*console.log("The ray is parallel");*/ return false; } // Ray is parallel to the polygon, they don´t intersect
        const d = -this.normal().dotProduct(new Vector(this.points[0].x, this.points[0].y, this.points[0].z))
        const t = -(this.normal().dotProduct(ray.origin()) + d) / NdotRayDirection;
        if (t < 0) { /*console.log("Triangle is behind");*/ return false; }  //the triangle is behind
        const P = ray.origin().add(ray.direction().scaleBy(t)) // Intersection point to the triangle

        const edge0 = new Vector(
            this.points[1].x - this.points[0].x,
            this.points[1].y - this.points[0].y,
            this.points[1].z - this.points[0].z
        )
        const vp0 = P.subtract(new Vector(this.points[0].x, this.points[0].y, this.points[0].z))
        let C = edge0.crossProduct(vp0)
        if(this.normal().dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge0");*/ return false; } //P is outside the polygon

        const edge1 = new Vector(
            this.points[2].x - this.points[1].x,
            this.points[2].y - this.points[1].y,
            this.points[2].z - this.points[1].z
        )
        const vp1 = P.subtract(new Vector(this.points[1].x, this.points[1].y, this.points[1].z))
        C = edge1.crossProduct(vp1)
        if(this.normal().dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge1");*/ return false; } //P is outside the polygon

        const edge2 = new Vector(
            this.points[0].x - this.points[2].x,
            this.points[0].y - this.points[2].y,
            this.points[0].z - this.points[2].z
        )
        const vp2 = P.subtract(new Vector(this.points[2].x, this.points[2].y, this.points[2].z))
        C = edge2.crossProduct(vp2)
        if(this.normal().dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge2");*/ return false; } //P is outside the polygon

        const distance = ray.origin().subtract(P).length() // P are coordinates of the intersection point

        return distance //This ray hits the triangle
    }

    color (ray) {
        let angle = this.normal().angleBetween(ray.direction())
        let r = Math.abs(Math.cos(degreeToRad(angle))) * 255 * (this.material.color.r / 255) 
        let g = Math.abs(Math.cos(degreeToRad(angle))) * 255 * (this.material.color.g / 255)
        let b = Math.abs(Math.cos(degreeToRad(angle))) * 255 * (this.material.color.b / 255)
        return { r:r, g:g, b:b }
    }
}

class Object {

    constructor ( polygons, material ) {
        this.polygons = polygons;
        this.material = material;
    }

    polygons () { return this.polygons }

}

class Matrix44 {
    constructor ( components ) {
        this.matrix44 = components
    }

    index(i,j) { return this.matrix44[i][j] }

    row(i) { return this.matrix44[i] }

    multiply (other) {
        let result = []
        let tmp = []
        for(let i=0; i<4; i++) {
            for(let j=0; j<4; j++) {
                tmp[j] = this.index(i,0) * other.index(0,j) + this.index(i,1) * other.index(1,j) + this.index(i,2) * other.index(2,j) + this.index(i,3) * other.index(3,j)
            }
            result[i] = [...tmp]
        }
        return result
    }

    scaleBy(number) {
        return new Matrix44(
            structuredClone(this).matrix44.map(row => row.map(val => val * number))
        )
    }

    transposed () {
        let result = []
        let tmp = []
        for(let i=0; i<4; ++i) {
            for(let j=0; j<4; ++j) {
                tmp[j] = this.index(j,i)
            }
            result[i] = [...tmp]
        }

        return new Matrix44(result)
    }

    transpose () {
        this.matrix44 = this.transposed().matrix44
        return this
    }

    multVecMatrix (vector) {
        let a
        let b
        let c
        let w
        a = vector.components[0] * this.index(0,0) + vector.components[1] * this.index(1,0) + vector.components[2] * this.index(2,0) + this.index(3,0)
        b = vector.components[0] * this.index(0,1) + vector.components[1] * this.index(1,1) + vector.components[2] * this.index(2,1) + this.index(3,1)
        c = vector.components[0] * this.index(0,2) + vector.components[1] * this.index(1,2) + vector.components[2] * this.index(2,2) + this.index(3,2)
        w = vector.components[0] * this.index(0,3) + vector.components[1] * this.index(1,3) + vector.components[2] * this.index(2,3) + this.index(3,3)
        return new Vector (a/w, b/w, c/w)
    }

    multDirMatrix (vector) {
        let a
        let b
        let c
        a = vector.components[0] * this.index(0,0) + vector.components[1] * this.index(1,0) + vector.components[2] * this.index(2,0)
        b = vector.components[0] * this.index(0,1) + vector.components[1] * this.index(1,1) + vector.components[2] * this.index(2,1)
        c = vector.components[0] * this.index(0,2) + vector.components[1] * this.index(1,2) + vector.components[2] * this.index(2,2)
        return new Vector (a, b, c)
    }

    determinant() {
        let a= this.matrix44
        let determinant = 0
        let i
        let j
        let k
        let row
        let subMatrix = []
        for (j=0; j<4; j++) {
            row = []
            for(i=1; i<4; i++) {
                row[i-1] = []
                for (k=0; k<4; k++) {
                    if(k != j) row[i-1].push(a[i][k])
                }

            }
            subMatrix[j] = row

            determinant += a[0][j] * ( (-1) ** (1+(j+1)) ) * (new Matrix33(subMatrix[j]).determinant())
        }
        
        return determinant
    }

    adj() {

        let a= structuredClone(this).matrix44
        let adj = []
        let i,j,k,l,row
        let subMatrix = []
        console.log(a)
        for(i=0;i<4;i++) {
            subMatrix[i] = []
            adj[i] = []
            for(j=0;j<4;j++) {
                subMatrix[i][j] = structuredClone(a)
                subMatrix[i][j].splice(i,1)
                subMatrix[i][j].forEach((row, index) => { subMatrix[i][j][index].splice((j),1) })
                adj[i][j] = ((-1) ** ((i+1)+(j+1))) * (new Matrix33(subMatrix[i][j]).determinant())
            }
        }
        adj = new Matrix44(adj).transposed()
        
        return adj
    }

    inverse () {

        if(this.determinant() == 0) return false //No inverse if determinant = 0
        return this.adj().scaleBy(1/this.determinant())
    }

    invert() {
        this.matrix44 = this.inverse()
        return this
    }

}

class Matrix33 {

    constructor (components) {
        this.matrix33 = components
    }

    determinant () {
        let a = this.matrix33
        let determinant = (
            a[0][0] * a[1][1] * a[2][2] +
            a[0][1] * a[1][2] * a[2][0] +
            a[0][2] * a[1][0] * a[2][1] -
            a[0][2] * a[1][1] * a[2][0] -
            a[0][0] * a[1][2] * a[2][1] -
            a[0][1] * a[1][0] * a[2][2]
        )
        return determinant
    }

}

class Camera {
    
    constructor (components) {
        this.position = components.position
        this.target = components.target
        this.zoom = components.zoom
        this.fov = components.fov
        this.cameraToWorld = []
    }

    cameraToWorld () { return this.cameraToWorld }

    origin () { return new Vector(this.position.x, this.position.y, this.position.z) }

    dir () { return new Vector((this.target.x-this.position.x), (this.target.y-this.position.y), (this.target.z-this.position.z)) }

    fov () { return this.fov }

    cameraToWorldSet () {
        let zx = this.target.x - this.position.x
        let zy = this.target.y - this.position.y
        let zz = this.target.z - this.position.z

        let xx = -zy / Math.sqrt(Math.pow(zx, 2) + Math.pow(zy, 2))
        let xy = zx / Math.sqrt(Math.pow(zx, 2) + Math.pow(zy, 2))
        let xz = 0

        let yx = zy * xz - zz * xy
        let yy = zz * xx - zx * xz
        let yz = zx * xy - zy * xx
        let v1 = new Vector(xx, xy, xz).normalize()
        let v2 = new Vector(yx, yy, yz).normalize()
        let v3 = new Vector(zx, zy, zz).normalize()
        xx = v1.x()
        xy = v1.y()
        xz = v1.z()
        yx = v2.x()
        yy = v2.y()
        yz = v2.z()
        zx = v3.x()
        zy = v3.y()
        zz = v3.z()

        let q = this.position

        this.cameraToWorld = new Matrix44([
            [xx, xy, xz, q.x],
            [yx, yy, yz, q.y],
            [zx, zy, zz, q.z],
            [0, 0, 0, 1]
        ])

        return this.cameraToWorld
    }
}

class Material {
    constructor(color) {
        this.color = color
    }
    color() { return this.color }
}

const camera = {

    position: {
        x: -4,
        y: -2,
        z: 1.5
    },
    target: {
        x: 0.5,
        y: 0.5,
        z: 0.5
    },
    zoom: 1,
    fov: 90,
    
}

const drawPixel = (canvasData, canvasWidth, canvasHeight, pixel, r,g,b,a) => {
    let index = pixel * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function render() {
    const cam = new Camera(camera)
    const pinturaRoja = new Material({ r:255, g:0, b:0, a:255 })
    const pinturaAzul = new Material({ r:0, g:0, b:255, a:255 })
    const pinturaVerde = new Material({ r:0, g:255, b:0, a:255 })
    const cameraToWorld = cam.cameraToWorldSet()
    let x,y, dir, color, dist, rayDist
    let pix = []
    let polygons = [    new polygon([{x:0,y:1,z:0}, {x:1,y:1,z:0}, {x:1,y:0,z:0}], pinturaRoja),
                        new polygon([{x:0,y:0,z:0}, {x:0,y:1,z:0}, {x:1,y:0,z:0}], pinturaRoja),
                        new polygon([{x:0,y:0,z:0}, {x:0,y:0,z:1}, {x:1,y:0,z:0}], pinturaRoja),
                        new polygon([{x:0,y:0,z:1}, {x:1,y:0,z:1}, {x:1,y:0,z:0}], pinturaRoja),
                        new polygon([{x:0,y:0,z:0}, {x:0,y:1,z:0}, {x:0,y:0,z:1}], pinturaRoja),
                        new polygon([{x:0,y:0,z:1}, {x:0,y:1,z:0}, {x:0,y:1,z:1}], pinturaRoja),
                        new polygon([{x:0,y:1,z:1}, {x:0,y:1,z:0}, {x:1,y:1,z:0}], pinturaRoja),
                        new polygon([{x:1,y:1,z:0}, {x:1,y:1,z:1}, {x:0,y:1,z:1}], pinturaRoja),
                        new polygon([{x:1,y:0,z:0}, {x:1,y:1,z:0}, {x:1,y:0,z:1}], pinturaRoja),
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
                        new polygon([{x:0+10,y:0+10,z:1}, {x:1+10,y:1+10,z:1}, {x:0+10,y:1+10,z:1}], pinturaVerde)
                    ]
    const scale = Math.tan(degreeToRad(cam.fov)*0.5)
    const imageAspectRatio = options.width / options.height;
    const orig = cam.origin()
    for(let j = options.height; j > 0; j--) {
        for (let i = 0; i < options.width; i++) {
            x = scale * imageAspectRatio * ((-options.width/2) + i) / options.width
            y = scale * ((-options.height/2) + j) / options.height
            dir = cameraToWorld.multDirMatrix(new Vector(x, y, 1))
            pix.push(new ray({x: orig.x(), y: orig.y(), z: orig.z()}, dir))
        }   
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    let canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight)
    pix.forEach( ( pixel, index ) => {
        dist = infinite
        polygons.forEach((poli) => {
            rayDist = poli.intersect(pixel)
            if(rayDist != false) {
                if(rayDist > dist) return
                dist = rayDist
                color = poli.color(pixel)
                drawPixel(canvasData, canvasWidth, canvasHeight, index, color.r,color.g,color.b,255)
                return
            }
        })
    })
    context.putImageData(canvasData, 0, 0);

}

render()

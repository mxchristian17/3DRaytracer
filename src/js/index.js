const canvas = document.getElementById("canvas")
const loading = document.getElementById("loading")
let canvasWidth = 400//window.innerWidth
let canvasHeight = 300//window.innerHeight
const pixelCount = canvasWidth * canvasHeight
canvas.width = canvasWidth
canvas.height = canvasHeight
const context = canvas.getContext("2d", {willReadFrequently: true}) // create context

var loadingValue = 0

/*const acos = (x) => {
        return (-0.69813170079773212 * x * x - 0.87266462599716477) * x + 1.5707963267948966
}*/


const options = {
    width: canvasWidth,
    height: canvasHeight,
    consoleTimes: true,
    showRenderData: true,
    globalIllumination: true
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
        return new Vector (this.components[0]+components[0], this.components[1]+components[1], this.components[2]+components[2])
        /*return new Vector(
        ...components.map((component, index) => this.components[index] + component)
        )*/
    }
    subtract({ components }) {
        return new Vector (this.components[0]-components[0], this.components[1]-components[1], this.components[2]-components[2])
        /*return new Vector(
        ...components.map((component, index) => this.components[index] - component)
        )*/
    }
    scaleBy(number) {
        return new Vector (this.components[0]*number, this.components[1]*number, this.components[2]*number)
        /*return new Vector(
            ...this.components.map(component => component * number)
        )*/
    }
    length() {
        return Math.hypot(...this.components)
    }
    length2() {
        return (Math.pow(this.x(), 2) + Math.pow(this.y(), 2) + Math.pow(this.z(), 2))
    }
    dotProduct({ components }) {
        return (this.components[0]*components[0]+this.components[1]*components[1]+this.components[2]*components[2])
        //return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
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
    constructor(origin, direction, intensity, color) {
        this.orig = origin
        this.dir = direction
        this.intensity = intensity
        this.color = color
    }

    origin() { return new Vector(this.orig.x,this.orig.y,this.orig.z) }
    direction() { return this.dir }
    at(t) { return this.orig + t * this.dir }
    distance(point) {
        return this.origin().subtract(point).length()
    }

}

class polygon {
    constructor(points, material) {
        this.points = points
        this.material = material
        this.v0 = new Vector(this.points[0].x, this.points[0].y, this.points[0].z)
        this.v1 = new Vector(this.points[1].x, this.points[1].y, this.points[1].z)
        this.v2 = new Vector(this.points[2].x, this.points[2].y, this.points[2].z)
        this.edge0 = new Vector(
            this.points[1].x - this.points[0].x,
            this.points[1].y - this.points[0].y,
            this.points[1].z - this.points[0].z
        )
        this.edge1 = new Vector(
            this.points[2].x - this.points[1].x,
            this.points[2].y - this.points[1].y,
            this.points[2].z - this.points[1].z
        )
        this.edge2 = new Vector(
            this.points[0].x - this.points[2].x,
            this.points[0].y - this.points[2].y,
            this.points[0].z - this.points[2].z
        )
    }

    middle () {
        let x = ( this.points.reduce((tot,num) => tot+num.x, 0) ) / this.points.length
        let y = ( this.points.reduce((tot,num) => tot+num.y, 0) ) / this.points.length
        let z = ( this.points.reduce((tot,num) => tot+num.z, 0) ) / this.points.length
        return { x:x, y:y, z:z }
    }

    normal () {
        /*let r = new Vector(
            this.points[1].x - this.points[0].x,
            this.points[1].y - this.points[0].y,
            this.points[1].z - this.points[0].z
        )
        let s = new Vector (
            this.points[2].x - this.points[1].x,
            this.points[2].y - this.points[1].y,
            this.points[2].z - this.points[1].z
        )
        return s.crossProduct(r)*/
        const x = this.edge1.components[1] * this.edge0.components[2] - this.edge1.components[2] * this.edge0.components[1]
        const y = this.edge1.components[2] * this.edge0.components[0] - this.edge1.components[0] * this.edge0.components[2]
        const z = this.edge1.components[0] * this.edge0.components[1] - this.edge1.components[1] * this.edge0.components[0]
        return (new Vector(x,y,z))
    }

    intersect (ray) {
        const normal = this.normal()
        const NdotRayDirection = normal.dotProduct(ray.direction())
        //const v0 = new Vector(this.points[0].x, this.points[0].y, this.points[0].z)
        if ( /*Math.abs*/(NdotRayDirection) < kEpsilon ) { /*console.log("The ray is parallel");*/ return false; } // Ray is parallel to the polygon, they don´t intersect
        const d = -normal.dotProduct(this.v0)
        const t = -(normal.dotProduct(ray.origin()) + d) / NdotRayDirection;
        if (t < 0) { /*console.log("Triangle is behind");*/ return false; }  //the triangle is behind
        const P = ray.origin().add(ray.direction().scaleBy(t)) // Intersection point to the triangle
 
        const vp0 = P.subtract(this.v0)
        let C = this.edge0.crossProduct(vp0)
        if(normal.dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge0");*/ return false; } //P is outside the polygon

        const vp1 = P.subtract(this.v1)
        C = this.edge1.crossProduct(vp1)
        if(normal.dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge1");*/ return false; } //P is outside the polygon

        const vp2 = P.subtract(this.v2)
        C = this.edge2.crossProduct(vp2)
        if(normal.dotProduct(C) > 0) { /*console.log("Ray out of triangle. Edge2");*/ return false; } //P is outside the polygon

        //const distance = ray.origin().subtract(P).length() // P are coordinates of the intersection point

        return { point: P } //This ray hits the triangle
    }

    color (rays) {
        let angleCos
        let r=0
        let g=0
        let b=0
        rays.forEach((ray) => {
            angleCos = Math.abs(Math.cos(degreeToRad(this.normal().angleBetween(ray.direction()))))
            r += angleCos * ray.intensity * (this.material.color.r * (1- this.material.ior)) * (ray.color.r / 255)
            g += angleCos * ray.intensity * (this.material.color.g * (1- this.material.ior)) * (ray.color.g / 255)
            b += angleCos * ray.intensity * (this.material.color.b * (1- this.material.ior)) * (ray.color.b / 255)
        })
        r = r >255 ? 255 : r
        g = g >255 ? 255 : g
        b = b >255 ? 255 : b
        return { r:r, g:g, b:b }
    }
}

class Object {

    constructor ( polygons, material ) {
        this.polygons = polygons;
        this.material = material;
    }

    polygons () { return this.polygons }
    material () { return this.material }
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
    constructor(color, ior) {
        this.color = color
        this.ior = ior
    }
    color() { return this.color }
    ior() { return this.ior }
}

class light {
    constructor(orig, direction, minAngle, maxAngle, intensity, color, dimmingStart, dimmingEnd) {
        this.orig = orig
        this.direction = direction
        this.minAngle = minAngle
        this.maxAngle = maxAngle
        this. intensity = intensity
        this.color = color
        this.dimmingStart = dimmingStart
        this.dimmingEnd = dimmingEnd
    }

    origin() { return new Vector(this.orig.x,this.orig.y,this.orig.z) }
    bright(distance, angle) {
        let result
        if(distance > this.dimmingEnd) return 0
        if(angle > this.maxAngle) return 0
        if(distance < this.dimmingStart) result = this.intensity
        if(distance >= this.dimmingStart && distance < this.dimmingEnd) result = this.intensity * (this.dimmingEnd - distance) / (this.dimmingEnd - this.dimmingStart)
        if(angle < this.minAngle) return result
        return result * (this.maxAngle - angle) / (this.maxAngle - this.minAngle)

    }
}

const drawPixel = (canvasData, canvasWidth, canvasHeight, pixel, r,g,b,a) => {
    let index = pixel * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

loading.style.display = "block"
//canvas.style.display = "none"


/*let acos = []
for(i = 0; i <= 2000; i++) {
    acos[i] = (radToDegree(
        Math.acos((i-1000)/1000)
    ))
}
console.log(acos)*/




class Item {
    x=0;
    y=0;
    mass=0;
    width=0;
    height=0;

    constructor(x,y,width,height,mass) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mass = mass;
    }

    calculateCenterOfMass() {
        let cX = (this.x + this.x + this.width)/2;
        let cY = (this.y + this.y - this.height)/2;
        return {x: cX, y: cY}
    }
}

const items = [
    new Item(0, 0, 200, 150, 2000),
    new Item(200, 0, 200, 150, 200),
    new Item(400, 0, 200, 150, 200),
    new Item(600, 0, 200, 150, 200),
    new Item(800, 0, 200, 150, 200),
    new Item(1000, 0, 200, 150, 200),
]

function calculateItemsCenterOfMass(items) {
    let center = {x: 0, y: 0, mass: 0}

    items.forEach(item => {
        let item_center = item.calculateCenterOfMass();
        let massProportion = item.mass / (center.mass + item.mass)

        let xDistance = item_center.x - center.x;
        let yDistance = item_center.y - center.y;
        
        center.x += xDistance * massProportion
        center.y += yDistance * massProportion

        center.mass += item.mass
    })
    return center
}

export {items, calculateItemsCenterOfMass};

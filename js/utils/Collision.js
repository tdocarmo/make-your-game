class Collision {
    static checkCollision(obj1, obj2) {
        return obj1.position.x === obj2.position.x && obj1.position.y === obj2.position.y;
    }
}

export default Collision;

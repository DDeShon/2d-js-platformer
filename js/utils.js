const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    })
}

function checkCollisions(object1, object2) {
    return (
        object1.x + object1.width >= object2.x && 
        object1.x <= object2.x + object2.width
    )
}
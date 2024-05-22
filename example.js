function rect(x, y, w, h){
    Quartz.poly([[x, y],
                [x + w, y],
                [x + w, y + h],
                [x, y + h], 
                [x, y]]);
}


let canvas = document.getElementById("canvas");
let _ctx = canvas.getContext("2d");

Quartz.setContext(_ctx);
document.addEventListener("mousemove", e => {
    console.log(e)
    Quartz.light(e.x, e.y, "white");
    // Quartz.light(400, 400, "blue");
    rect(100, 100, 200, 200);
    Quartz.poly([[500, 200], [600, 300]]);
    
    Quartz.render();
})
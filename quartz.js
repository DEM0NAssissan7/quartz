let objects = [];
let lights = [];
let ctx;
let context;
let offscreenCanvas;
let hasContext = false;
let options = {
    globalAlpha: 0.5,
    shadowBlur: 15,
    defaultLightColor: "white"
}
class Quartz{
    static setOptions(_options) {
        Object.assign(options, _options);
    }
    static createOffscreen(canvas) {
        // Create offscreen canvas & context
        offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        ctx = offscreenCanvas.getContext("2d");
        hasContext = true;
    }
    static setContext(_ctx){
        try {
            _ctx.beginPath();
            _ctx.closePath();
        } catch(e) {
            console.error(e);
            throw new Error("Invalid context")
        }
        context = _ctx;
        this.createOffscreen(_ctx.canvas);
    }
    static poly(coords) {
        /* Coords are structured as such:
            [[x1, y1], [x2, y2], ...]
        */

        if(coords.length < 2) throw new Error("Invalid number of coordinates. Must have at least two points.");
        objects.push(coords);
    }
    static light(x, y, color){
        lights.push({
            x: x,
            y: y,
            color: color ?? options.defaultLightColor
        });
    }
    static renderOffscreen(){
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        let width = ctx.canvas.width;
        let height = ctx.canvas.height;
        ctx.fillRect(0, 0, width, height);
        for(let light of lights) {
            // Set effects
            // ctx.shadowColor = light.color;
            // ctx.shadowBlur = options.shadowBlur;    
            // Create light background
            ctx.globalAlpha = options.globalAlpha;
            if(light.color) {
            ctx.fillStyle = light.color;
                ctx.fillRect(0, 0, width, height);
            }
            
            // Subtract light where a shadow is casted
            // ctx.globalAlpha = options.globalAlpha / 2;
            ctx.fillStyle = "black";
            for(let coords of objects) {
                for(let i = 0; i < coords.length - 1; i++) {
                    let x1 = coords[i][0];
                    let y1 = coords[i][1];
                    let x2 = coords[i + 1][0];
                    let y2 = coords[i + 1][1];

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x2 + (x2 - light.x) * width, y2 + (y2 - light.y) * height);
                    ctx.lineTo(x1 + (x1 - light.x) * width, y1 + (y1 - light.y) * height);
                    ctx.lineTo(x1, y1);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
        
        objects = [];
        lights = [];

        return offscreenCanvas;
    }
    static render(opacity){
        if(!hasContext) throw new Error("Quartz context has not been set. You can set it with `Quartz.setContext(ctx)`");
        // Render all graphics offscreen
        this.renderOffscreen();
        context.globalAlpha = opacity ?? 1;
        // Cast offscreen canvas onto actual canvas
        context.drawImage(offscreenCanvas, 0, 0);
        context.globalAlpha = 1;
    }
}
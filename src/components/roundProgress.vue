<template>
  <canvas id="roundProgress"></canvas>
</template>
<script type = "text/ecmascript-6">

  export default {
    props:["d",'width',"progress",'bg','bottomBg','startBg','endBg','style','textSize','textColor'],
    created() {

      var lastTime = 0;
      var vendors = ["webkit", "moz"];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
          window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      }
      if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
              var id = window.setTimeout(function() {
                  callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };
      }
      if (!window.cancelAnimationFrame) {
          window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
          };
      }


    },
    mounted(){
      let W,H,
      canvas = this.$el,
      ctx = canvas.getContext('2d'),
      d = this.d,
      r=d/2-8,
      width=this.width,
      textSize = this.textSize || 26,
      textColor = this.textColor || '#fff',
      ringBg,
      colors={ 
      '0': '#FF0000', 
      '0.3': '#ff1800', 
      '0.5': '#ff3e00',
      '0.6': '#ff6600',
      '0.8': '#ff8d00',
      '1': '#FFA600'
      },
      angle = 0*Math.PI,
      img;
      canvas.width = parseInt(d)+1;
      canvas.height = parseInt(d);

      let progress = this.progress
      let drawCircle = ({
        lineWidth,
        strokeStyle,
        fillStyle,
        arc,
        isFill = true,
        isStroke = true
      }) => {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle ;
        ctx.fillStyle = fillStyle ;
        ctx.arc(arc.x,arc.y,arc.r,arc.sAngle,arc.eAngle);
        isFill && ctx.fill();
        isStroke && ctx.stroke();
        ctx.restore(); 
      }
      let seat = (num) => {
        let angle = 2*Math.PI*num/100
        let s = Math.sin(angle);
        let c = -Math.cos(angle); 
        return {s:s,c:c}
      }
      let start = () => {
        let startBg = this.startBg || ((progress<=40 && '#ff0000') ||(progress>40 && progress<=60 && '#ffa600') ||(progress>60 && progress<=80 && '#40df5b')||'#00aafe')
        drawCircle({
          lineWidth:4,
          strokeStyle:this.bottomBg,
          fillStyle:startBg,
          arc:{
            x:r+8,
            y:width/2+8,
            r:(width-4)/2,
            sAngle:-.5*Math.PI,
            eAngle:1.499999*Math.PI,
          }
        })
      }
      let end = (num) => { 
        drawCircle({
          lineWidth:4,
          strokeStyle:'#fff',
          fillStyle:'#fff',
          arc:{
            x:d/2+(seat(num).s*(r-width/2)),
            y:d/2+(seat(num).c*(r-width/2)),
            r:(width)/2+2,
            sAngle:-.5*Math.PI,
            eAngle:1.499999*Math.PI,
          }
        })
      }
      let bg = () =>{
        drawCircle({
          lineWidth:width,
          strokeStyle:this.bottomBg,
          isFill:false,
          arc:{
            x:d/2,
            y:d/2,
            r:r-width/2,
            sAngle:-.5*Math.PI,
            eAngle:1.499999*Math.PI,
          }
        })
      }

      let text = (num) => {
        ctx.beginPath();
        ctx.font = 'bold '+textSize+'px Arial';
        ctx.fillStyle =textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num+'%', d/2, d/2);
        ctx.stroke();
      }
      let ring = (num) => {
        ringBg = ringBg || ringBgFun(num)
        drawCircle({
          lineWidth:this.style=="gradual" && width-4 ||width,
          strokeStyle:ringBg,
          isFill:false,
          arc:{
            x:d/2,
            y:d/2,
            r:r-width/2,
            sAngle:-.5*Math.PI,
            eAngle:num/100*(1.999999*Math.PI) - Math.PI/2,
          }
        })
      }


      let imgBg = (imgSrc) => {
        let into = document.createElement("canvas"),
        ctx2 = into.getContext('2d'),
        newFill = null,
        img = new Image(d,d);
        img.src = imgSrc;
        into.width = d;
        into.height = d;
        if (img.complete) {
         ctx2.drawImage(img,0,0,d,d);
         return ctx.createPattern(into, 'no-repeat');
        } else {
         ctx2.drawImage(img,0,0,d,d);
         return img.onload = ctx.createPattern(img, 'no-repeat');
        }     
      }
      let ringBgFun = () =>{
        if(progress<=40){                
          let grad  = ctx.createLinearGradient(r+8, width/2+8, d/2+(seat(40).s*(r-width/2)), d/2+(seat(40).c*(r-width/2)));
          for(let k in colors) {
            grad.addColorStop(k, colors[k]);
          }
          return grad
        }else if(progress>40 && progress<=60){
          // console.log(imgBg('../src/assets/img/three.png'))
          return imgBg('../src/assets/img/three.png')
        }else if(progress>60 && progress<=80){
          return imgBg('../src/assets/img/four.png')
        }else{
          return imgBg('../src/assets/img/five.png')
        }
      }
      let paint =(num)=>{         
          if(num<progress){
            ctx.clearRect(0,0,d+1,d);
            bg()
            num = Math.min(num ? num + 1 : 1,progress) 
            text(num)
            ring(num)
            console.log(this.style)
            if(this.style=="gradual"){
              start()
              end(num)
            }
            requestAnimationFrame(()=>{
              paint(num)
            })
          } else if (progress==0){ 
            bg()
            text(0)
           }         
        }
      paint(0)


    }
  }
</script>
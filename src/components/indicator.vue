<template>
  <canvas></canvas>
</template>
<style>
  body{
    background-color: #000
  }
</style>
<script type = "text/ecmascript-6">

  export default {
    props:["r",'width',"progress",'bg','name'],
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
      let canvas = this.$el,
      ctx = canvas.getContext('2d'),
      colors={ 
        '0': '#eeff27', 
        '0.3': '#f0f123', 
        '0.5': '#f1e61f',
        '0.75': '#f8b40f',
        '0.93': '#fc9906',
        '1': '#ff8500'
        },
      sAngle= 0,
      eAngle= 2/3*2,
      lineheight = 2/3*2/100,
      width = this.width,
      height = Math.sin(2*Math.PI / 360*30)*this.width/2+this.width/2+2,
      center = width/2;
      canvas.width = width;
      canvas.height =height;
      let sjjsX= -590*this.width/500
      let sjjsY= -159*this.width/500
      let ring = (num) =>{
        ctx.beginPath();        
        ctx.rotate(-90*Math.PI/180)
        ctx.translate(-this.width,-0)
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#89B7FF';
        ctx.arc(center,center,(center-100),0,2/3*2*Math.PI);
        ctx.stroke();
        let drawCircle = function({r,start,end,style}) {
          ctx.beginPath();
          ctx.lineWidth = 6;
          ctx.arc(center, center, r, Math.PI*start, Math.PI*end);
          ctx.strokeStyle = style;
          ctx.stroke();  
        }
        var grad  = ctx.createLinearGradient(0, 0, 360, 0);
        for(var k in colors) {
            grad.addColorStop(k, colors[k]);
        }
        let curNum = eAngle/100*num   
        drawCircle({
            r: (center-100),
            start: 0,
            end: curNum,
            style: grad
        });

        ctx.save()
        ctx.beginPath();
        let cha = Math.PI*1.5;
        let s = Math.sin(Math.PI*curNum-cha);
        let c = -Math.cos(Math.PI*curNum-cha);
        ctx.fillStyle = '#f8ffa5'
        ctx.shadowBlur = 5; 
        ctx.shadowColor = 'rgba(255,255,255,0.50)'; 
        ctx.shadowOffsetX = 2
        ctx.arc(center+s*(center-100), center+c*(center-100), 10, 0, Math.PI*2);
        ctx.fill()
        ctx.restore()
        ctx.closePath();
      }
      let indicator = () =>{
        for(var i=0;i<40;i++){
          ctx.save()
          ctx.beginPath()
          ctx.translate(center,center)
          ctx.rotate(i*6*Math.PI/180)
          ctx.strokeStyle="#387bd6"
          ctx.lineWidth=2
          ctx.moveTo(0,-center+10)
          ctx.lineTo(0,-center+30)
          ctx.stroke()
          ctx.restore()
        }

        for(var i=0;i<9;i++){
          ctx.save()
          ctx.beginPath()
          ctx.translate(center,center)
          ctx.rotate(i*30*Math.PI/180)
          ctx.strokeStyle="#5e9df8"
          ctx.lineWidth=6
          ctx.moveTo(0,-center)
          ctx.lineTo(0,-center+30)
          ctx.stroke()
          ctx.closePath()
          ctx.restore()
        }
        
        for(var i=0;i<5;i++){
          ctx.save()
          ctx.beginPath()
          ctx.translate(center,center)
          ctx.rotate(i*60*Math.PI/180)
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '22px Microsoft YaHei Arial';
          ctx.fillStyle ='#5e9df8';
          ctx.fillText(i*25,0,-center+50)
          ctx.closePath()
          ctx.restore()
        }
      }
      let textFun =() => {      
        ctx.beginPath();
        ctx.font = 'bold 65px Microsoft YaHei Arial';
        ctx.fillStyle ='#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.progress+'%', center, height/2+40);
        ctx.stroke();

        ctx.beginPath();
        ctx.font = '32px Microsoft YaHei Arial';
        ctx.fillStyle ='#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, center, height/2+120);
        ctx.stroke();
      }
      let init = (num) =>{
        if(num<this.progress){
            ctx.clearRect(0,0,this.width,this.width);
            num = Math.min(num ? num + 1 : 1,this.progress) 
            textFun()
            ctx.save()
            // ctx.translate(156,630)
            ctx.rotate(-120*Math.PI/180)
            ctx.translate(sjjsX,sjjsY)
            indicator()
            ring(num)
            ctx.restore()
            requestAnimationFrame(function(){
              init(num)
            })     

          }  
      }
      init(0)
    }

  }
</script>
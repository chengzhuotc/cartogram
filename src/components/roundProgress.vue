<template>
  <canvas id="roundProgress"></canvas>
</template>
<script type = "text/ecmascript-6">

  export default {
    props:["r",'width',"progress",'bg'],
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
      r=this.r,
      width=this.width,
      that=this,
      angle = 0*Math.PI;
      canvas.width = r;
      canvas.height = r;
      W = r,
      H = r;
      let progress = this.progress

      let bg = () =>{
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = '#89B7FF';
        ctx.arc(r/2,r/2,(r-width)/2,0,2*Math.PI);
        ctx.stroke();
        ctx.restore();
      }
      let text = (num) => {
        ctx.beginPath();
        ctx.font = 'bold 26px Microsoft YaHei Arial';
        ctx.fillStyle ='#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num+'%', r/2, r/2);
        ctx.stroke();
      }
      let paint =(num)=>{         
          if(num<progress){
            ctx.clearRect(0,0,W,W);
            bg()
            num = Math.min(num ? num + 1 : 1,progress) 
            text(num)
            let curNum = num==100 ? 0 : num
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.strokeStyle = this.bg;
            ctx.arc(r/2,r/2,(r-width)/2,0,(2-2*curNum/100)*Math.PI,true);
            ctx.stroke();
            requestAnimationFrame(()=>{

              paint(num)
            })
          }         
        }
        paint(0)
    }
  }
</script>
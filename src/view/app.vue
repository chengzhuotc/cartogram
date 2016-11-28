<template>
<div>  
  <cartogram :width='width' height='500' :val='val' maxH='100' :valX='valX' id="zhe"  name='消费趋势'></cartogram>
<!--   <cartogram :width='width' height='500' :val='val' r='300' id="xian" type="ring" ringW='100' title="" :ringstyle='ringstyle'></cartogram>
  <cartogram :width='width' height='400' :val='val' r='200' id="cz" type="ring" ringW='80' title="" :ringstyle='ringstyle'></cartogram> -->

</div>
</template>
<style>
  canvas{
    width: 100%
  }
</style>
<script type="text/ecmascript-6">
import cartogram from '../components/cartogram.vue'
//     ringstyle:[{color:'#9eb0ff',num:10,title:'加油',monny:60000},{color:'#77b2fc',num:10,title:'修车',monny:10000},{color:'#ffc184',num:30,title:'护理',monny:10000},{color:'#98e39f',num:20,title:'保养',monny:50000},{color:'#95d1ff',num:30,title:'哎哎',monny:70000}]
export default {
  data(){
    return{
      visible:false,
      setyear: new Date().getFullYear(),
      setmonth: new Date().getMonth()+1,
      setday: new Date().getDate(),
      val:[20,30,20,100,0],
      valX:['8','9','10','11','12'],
      ringstyle:[{color:'#9eb0ff',title:'加油',monny:60000},{color:'#77b2fc',title:'修车',monny:10000},{color:'#ffc184',title:'护理',monny:10000},{color:'#98e39f',title:'保养',monny:50000},{color:'#95d1ff',title:'哎哎',monny:70000}]
    }
  },
  components:{
    cartogram
  },
  created(){
    let nowTime = new Date()
    this.width = window.innerWidth;
  },
  mounted() {
    // this.$router.push({ path: 'record' });
  }
}
</script>
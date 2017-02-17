<template>
<div>  
<!-- rgba(106,183,255,0.17) -->
<!-- bg='#e8f0f8;#c6dbfb' -->
<!-- :brokenLine=true -->
<!-- DEE7FF－ECF5FE -->
  <cartogram :width='width' height='240' :val='val' maxH='100' :valX='valX' id="zhe"  name='消费趋势' bg='#DEE7FF;#ECF5FE'  borderColor='#519dff' CoordinateYType="spot"></cartogram>
  <!-- <cartogram :width='width' height='130' :val='val' maxH='100' :valX='valX' id="ccc"  name='消费趋势'  :brokenLine=true  borderColor="#ff8153" CoordinateYType="spot"></cartogram>
  <cartogram :width='width' height='100' :val='val' r='100' id="xian" type="ring" ringW='20' title="" :ringstyle='ringstyles'></cartogram> -->
  <!-- <cartogram :width='width' height='400' :val='val' r='200' id="cz" type="ring" ringW='80' title="" :ringstyle='ringstyle'></cartogram> -->
  <!-- <cartogram :width='width' height='250' type='bar' id="bar" class="bar" :val='val' maxH='100' :valX="valX"></cartogram> -->

<!--   <round-progress r="100" width="8" :progress="90" bg='#ffe35b'></round-progress>
  <round-progress r="100" width="8" :progress="50" bg='#1fecff'></round-progress>
  <indicator :progress="10" width="650"></indicator> -->

</div>
</template>
<style>
*{
  margin:0;
  padding: 0
}
  canvas{
    width: 100%;
    /*background: rgba(226, 231, 235, 0.17);*/
  }
</style>
<script type="text/ecmascript-6">
import cartogram from '../components/cartogram.vue'
import roundProgress from '../components/roundProgress.vue'
import indicator from '../components/indicator.vue'
//     ringstyle:[{color:'#9eb0ff',num:10,title:'加油',monny:60000},{color:'#77b2fc',num:10,title:'修车',monny:10000},{color:'#ffc184',num:30,title:'护理',monny:10000},{color:'#98e39f',num:20,title:'保养',monny:50000},{color:'#95d1ff',num:30,title:'哎哎',monny:70000}]
export default {
  data(){
    return{
      visible:false,
      setyear: new Date().getFullYear(),
      setmonth: new Date().getMonth()+1,
      setday: new Date().getDate(),
      val:[77,66,88,77,4.89],
      // val:[5.58,5.34,5.1,4.97,4.89],
      valX:['7','8','9','10','11'],
      ringstyle:[{color:'#9eb0ff',title:'加油',monny:60000},{color:'#77b2fc',title:'修车',monny:10000},{color:'#ffc184',title:'护理',monny:10000},{color:'#98e39f',title:'保养',monny:50000},{color:'#95d1ff',title:'哎哎',monny:70000}],
      ringstyles:[{color:'#9eb0ff',title:'加油',monny:10},{color:'#77b2fc',title:'修车',monny:0},{color:'#ffc184',title:'护理',monny:0},{color:'#98e39f',title:'保养',monny:0},{color:'#95d1ff',title:'哎哎',monny:0}]
    }
  },
  components:{
    cartogram,
    roundProgress,
    indicator
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
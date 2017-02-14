<template>
<div>  
<!-- rgba(106,183,255,0.17) -->
<!-- bg='#e8f0f8;#c6dbfb' -->
<!-- :brokenLine=true -->
<!-- DEE7FF－ECF5FE -->
  <cartogram :width='width' height='260' :val='val' maxH='100' :valX='valX' id="zhe"  name='消费趋势' bg='#DEE7FF;#ECF5FE'  borderColor='#519dff' CoordinateYType="spot"></cartogram>
  <cartogram :width='width' height='100' :val='val' maxH='100' :valX='valX' id="ccc"  name='消费趋势'  :brokenLine=true  borderColor="#ff8153" CoordinateYType="spot"></cartogram>
<!--   <cartogram :width='width' height='500' :val='val' r='300' id="xian" type="ring" ringW='100' title="" :ringstyle='ringstyles'></cartogram>
  <cartogram :width='width' height='400' :val='val' r='200' id="cz" type="ring" ringW='80' title="" :ringstyle='ringstyle'></cartogram>
  <cartogram :width='width' height='250' type='bar' id="bar" class="bar" :val='val' maxH='100' :valX="valX"></cartogram> -->

</div>
</template>
<style>
*{
  margin:0;
  padding: 0
}
  canvas{
    width: 100%;
    background: rgba(226, 231, 235, 0.17);
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
      val:[20,30,20,100,10],
      valX:['7','8','9','10','11'],
      ringstyle:[{color:'#9eb0ff',title:'加油',monny:60000},{color:'#77b2fc',title:'修车',monny:10000},{color:'#ffc184',title:'护理',monny:10000},{color:'#98e39f',title:'保养',monny:50000},{color:'#95d1ff',title:'哎哎',monny:70000}],
      ringstyles:[{color:'#9eb0ff',title:'加油',monny:10},{color:'#77b2fc',title:'修车',monny:0},{color:'#ffc184',title:'护理',monny:0},{color:'#98e39f',title:'保养',monny:0},{color:'#95d1ff',title:'哎哎',monny:0}]
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
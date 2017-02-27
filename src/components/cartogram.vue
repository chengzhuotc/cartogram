<template>
	<canvas :id="id" @click="handleChartClick($event)"></canvas>
</template>

<script type = "text/ecmascript-6">

	export default {
		data() {
			return {
				process: 0,
				nowAngle: 0,
				oldAngle: null,
				ringStyleNum: 0,
				ringStyleaAllNum: 0,
				num: 0,
				ringData: [],
				ctx: null,
				index: null,
				h: null,
				w: null,
				lineProcess: 0,
				lineStyleNum: 0,
				intervalW: 70,
				lineNum: 0,
				OldMotionH: 0,
				OldMotionW: 0,
				isDrawDashedLine:false,
				ringAmountClick:false
			}
		},
		props: ['width', 'height', 'maxH', 'maxW', 'val', 'valX', 'id', 'type', 'r', 'ringW', 'title', 'ringstyle', 'name','brokenLine','borderColor','shadowColor','bg','CoordinateYType'],
		created(){
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
		methods: {		
			coordinateX({
				ctx,
				length=5,
				w=500,
				h=500,
				color='#333',
				lineWidth=1,
				marginLeft=0,
				marginTop=0,
				drawDashedLine=false,
				drawDashedLineWidth=13,
				text
			}){
				let line = (h-marginTop)/(length-1);
				for (var i = 0; i < length; i++) {
					switch(drawDashedLine){
						case true:
							ctx.beginPath();
							ctx.strokeStyle = '#e3ecf2';
							this.drawDashedLine(ctx, marginLeft, h-line*i, w, h-line*i, drawDashedLineWidth);
							ctx.stroke();
						break;
						default:
							ctx.lineWidth = lineWidth;
							ctx.strokeStyle = color;
							ctx.moveTo(marginLeft, h-line*i);
							ctx.lineTo(w, h-line*i);
							ctx.stroke();
						break;
					}
					if(text){
						// 字
						let Text = text.isCount ? text.Text/(length-1)*i : text.fillText

						this.setText({
							ctx:ctx,
							text:Text,
							color:text.color,
							font:text.font,
							textAlign:text.textAlign || 'right',
							x:marginLeft-(text.marginright||0),
							y:h-line*i
						})
					}
				}
			},
		drawDashedLine(context, x1, y1, x2, y2, dashLength) {
			dashLength = dashLength === undefined ? 5 : dashLength;
			let deltaX = x2 - x1;
			let deltaY = y2 - y1;
			let numDashes = Math.floor(
				Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
				for (let i=0; i < numDashes; ++i) {
				context[ i % 2 === 0 ? 'moveTo' : 'lineTo' ]
				 (x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
				}
			},
			setText({
				ctx,
				text='字呢？？',
				font='1.4rem Arial',
				color='#333',
				textAlign='center',
				textBaseline='middle',
				x=10,
				y=10
			}){
				ctx.beginPath();
				ctx.font = font;
				ctx.fillStyle =color;
				ctx.textAlign = textAlign;
				ctx.save();
				ctx.textBaseline = textBaseline;
				ctx.fillText(text, x, y);
				ctx.stroke();
				ctx.restore();
			},
			LineCoordinateX(cartogram) {
				cartogram.beginPath();
				cartogram.moveTo(0, this.h);
				cartogram.lineTo(this.width * 2, this.h);
				cartogram.lineWidth = 1;
				cartogram.strokeStyle = '#d2e4ff';
				cartogram.stroke();
				this.coordinateX({
					ctx:cartogram,
					length:4,
					w:this.width * 2 - 30,
					h:this.h,
					color:'#e3ecf2',
					marginLeft:30,
					drawDashedLine:true
				})
			},
			spotCoordinateXChild(cartogram,i,lineW,level,index,len,globalAlpha){
					const curLineW = level == 'two' ? i*lineW/len + index*lineW : i*lineW
					cartogram.save()
					cartogram.beginPath();
					cartogram.lineCap="round";		
					cartogram.moveTo(this.intervalW + curLineW, this.h+19);
					cartogram.lineTo(this.intervalW + curLineW, this.h+10);
					cartogram.lineWidth = 4;
					cartogram.strokeStyle = '#809de0';
					cartogram.globalAlpha = globalAlpha && globalAlpha || 1;
					cartogram.stroke();
					cartogram.restore();

			},
			spotCoordinateX(cartogram,len=4){
				for(var i=0 ;i<this.val.length; i++){
					console.log('cz'+i)
					this.spotCoordinateXChild(cartogram,i,this.w / (this.val.length - 1))
					if(i<this.val.length-1){
						for(var j=0 ;j<len; j++){
							this.spotCoordinateXChild(cartogram,j,this.w / (this.val.length - 1),'two',i,len,0.2)
						}
					}
				}
			},
			LineCoordinateY(cartogram) {
				// let grad = cartogram.createLinearGradient(0, 0, this.width, 0),
				let intervalW = this.intervalW / 2,grad;
				cartogram.beginPath();
				cartogram.lineWidth = 6;
				if(!this.brokenLine){
					grad = cartogram.createLinearGradient(0, 0, 0, this.height)
					grad.addColorStop(1, this.bg.split(';')[1] || '#f7fcff');
					grad.addColorStop(0, this.bg.split(';')[0] || '#b7daff ');
				}
				cartogram.strokeStyle =  this.borderColor || '#d8e7ff';
				if(this.shadowColor){
					cartogram.shadowBlur = 20;
					cartogram.shadowColor = this.shadowColor;
				}
				this.lineAnimate(cartogram, grad)

			},
			lineAnimate(cartogram, grad) {
				let h = this.h;
				let w = this.w;
				let val = this.val;
				let valLen = val.length;
				let lineW = this.w / (valLen - 1);
				let lineH = this.h / this.maxH;
				let intervalW = this.intervalW
				if (this.lineNum == 0) {
					this.speedLine(cartogram, intervalW, val[this.lineNum] * lineH, h, grad)
				} else {
					this.speedLine(cartogram, this.lineNum * lineW + intervalW, val[this.lineNum] * lineH, h, grad)

				}
			},
			countH(oldW,oldH,newW,newH){
				let h=newH-oldH,w = newW-oldW
				if(h!=0){
					return 3*Math.sqrt( Math.pow(w, 2 ) + Math.pow( h, 2 ) )/w
				}else if(h==0){
					return newH-3
				}
			},
			speedLine(cartogram, motionW, motionH, h, grad) {
				motionW = motionW || 0
				motionH = motionH || 0
				requestAnimationFrame(() => {
					  cartogram.beginPath();
					let OldMotionH = this.OldMotionH,OldMotionW = this.OldMotionW, lineProcess = this.lineProcess,newH

						if(grad){
							cartogram.fillStyle = grad;
						}
					if (lineProcess == 0) {
						if(this.brokenLine){
              cartogram.save();
							cartogram.strokeStyle = '#ffd2c1';
						}
						cartogram.moveTo(0, h);
					} else if (lineProcess == this.lineStyleNum) {
						cartogram.moveTo(lineProcess,h);
						cartogram.lineTo(lineProcess,h - OldMotionH + this.countH(OldMotionW,OldMotionH,motionW,motionH));
					}else{
						cartogram.moveTo(lineProcess, h - OldMotionH);
					} 
					if (motionW > lineProcess) {
						this.lineProcess = Math.min(this.lineProcess + 40, motionW)
						if (this.lineNum == 0) {
							newH = motionH / motionW * (this.lineProcess - OldMotionW)
						} else {
							newH = (motionH - OldMotionH) / (motionW - OldMotionW) * (this.lineProcess - OldMotionW)
						}		
						cartogram.lineTo(this.lineProcess, h - OldMotionH - newH);
					
						// cartogram.save();
						// cartogram.shadowBlur = 7;
						// cartogram.shadowOffsetX = 0;
						// cartogram.shadowOffsetY = 3;
						// cartogram.shadowColor = "rgba(106,99,255,0.50)";
						
						// cartogram.restore();
							
						// 
						this.OldMotionH = OldMotionH + newH
						this.OldMotionW = this.lineProcess
						if(!this.brokenLine){
								cartogram.lineTo(this.lineProcess, h);
						    this.lineStyleNum = this.lineProcess
						}else{
							cartogram.stroke();
						}
						if(!this.brokenLine){
							cartogram.fill();
							cartogram.restore();
							cartogram.beginPath();
							cartogram.save();
							// cartogram.globalAlpha = 0.5;
							if (lineProcess == 0) {
								if(this.brokenLine){
									cartogram.save();
									cartogram.strokeStyle = '#ffd2c1';
								}
								cartogram.moveTo(0, h);
							} else if (lineProcess == this.lineStyleNum) {
								cartogram.moveTo(lineProcess, h - OldMotionH);
							}else{
								cartogram.moveTo(lineProcess, h - OldMotionH);
							}
							cartogram.lineTo(this.lineProcess, h - OldMotionH - newH);
							cartogram.stroke();
							cartogram.restore();

						}
						this.speedLine(cartogram, motionW, motionH, h, grad)
					} else {
						if(this.brokenLine && this.lineNum==0){
							cartogram.restore();
						}
						this.lineNum++;
						this.OldMotionH = motionH
						this.OldMotionW = motionW
						if (this.lineNum < this.val.length+1) {
							this.lineAnimate(cartogram)
							
						} else {
							if(this.isDrawDashedLine){
								cartogram.beginPath();
								cartogram.strokeStyle = "#fff";
								let lineW = this.w / (this.val.length - 1);
								let lineH = this.h / this.maxH;
								let dashedW = (this.lineNum-2) * lineW+this.intervalW;
								let dashedH =  h-this.val[this.lineNum-2]*lineH;
								cartogram.lineTo(dashedW,dashedH);
								cartogram.lineTo(motionW,h-motionH);
								cartogram.stroke();   
								cartogram.beginPath();
								cartogram.strokeStyle = '#e3ecf2';
								this.drawDashedLine(cartogram,dashedW,dashedH,motionW,h-motionH,13);
								cartogram.stroke();
							}
							for (var i = 0; i < this.val.length; i++) {
								// 最后加载的动态
								this.lineData(cartogram, i)
							}
						}
					}
				})
			},
			lineData(cartogram, i) {
				let h = this.height * 2 - 160;
				let w = this.width * 2 - this.intervalW * 2;
				let val = this.val;
				let valLen = val.length;
				let lineW = w / (valLen - 1);
				let lineH = h / this.maxH;
				let that = this;
				let acreage;
				let intervalW = this.intervalW
				// 线
			if(!this.brokenLine){
								
				cartogram.save()
				cartogram.beginPath();		
				cartogram.moveTo(i * lineW + intervalW, h - val[i] * lineH);
				cartogram.lineTo(i * lineW + intervalW, h );
				cartogram.lineWidth = 1;
				cartogram.strokeStyle = '#fff';
				cartogram.stroke();
				cartogram.restore();
			}

					// 圆
				cartogram.beginPath();
				if (i == valLen - 2) {
					cartogram.arc(i * lineW + intervalW, h - val[i] * lineH, 12, 0, 2 * Math.PI);
				} else if (i == valLen) {
					cartogram.arc(i * lineW + intervalW, h, 6, 0, 2 * Math.PI);
				} else {
					cartogram.arc(i * lineW + intervalW, h - val[i] * lineH, 6, 0, 2 * Math.PI);
				}
				if(this.brokenLine){
						cartogram.fillStyle = "#ff8154";
						// cartogram.lineWidth = 2;
						cartogram.fill();
				}else{
					if (i == valLen - 2) {
						// cartogram.strokeStyle = '#ffe3ad';
						cartogram.fillStyle = "#ff8154";
						// cartogram.lineWidth = 2;
						cartogram.fill();
						// cartogram.stroke();
					} else {
						// cartogram.strokeStyle = '#cae7ff';
						cartogram.fillStyle = "#fff";
						cartogram.fill();
						// cartogram.stroke();
					}
				}
				// 字

				let fillStyle
				if (i == valLen - 2) {
					fillStyle = "#ff7916";
				} else {
					fillStyle = "#a5a5a5";
				}
				let textVal = i !== valLen && this.val[i] || ''

				this.setText({
					ctx:cartogram,
					text:textVal,
					color:fillStyle,
					font:"1.2rem Arial",
					textBaseline:'middle bottom',
					x:i * lineW + intervalW,
					y:h - val[i] * lineH - 15
				})
			},
			Line(cartogram) {
				let h = this.height * 2 - 160;
				let w = this.width * 2 - this.intervalW * 2;
				let val = this.val;
				let valLen = val.length;
				let lineW = w / (valLen - 1);
				let lineH = h / this.maxH;
				let maxYear = new Date().getFullYear();
				let maxMonth = new Date().getMonth()+1;
				let that = this;
				let acreage;
				let intervalW = this.intervalW

				this.h = h;
				this.w = w;
				this.setText({
					ctx:cartogram,
					text:this.name,
					textAlign:'left',
					color:'#666',
					textBaseline:'middle bottom',
					x:35,
					y:50
				})
				cartogram.translate(0, 90);
				if(this.CoordinateYType=='spot'){
					this.spotCoordinateX(cartogram)
				}else{
					this.LineCoordinateX(cartogram)
				}
					this.LineCoordinateY(cartogram)
				for (var i = 0; i < valLen; i++) {
					this.setText({
						ctx:cartogram,
						text:this.valX[i],
						color: i == valLen - 2 && "#333" || "#afafaf",
						font:i == valLen - 2 && "1.6rem Arial" || "1.4rem Arial",
						x:i * lineW + intervalW,
						y:h + 45
					})

				}
			},
			textCenter(text, num) {
				this.setText({
					ctx:this.ctx,
					text:'￥' + num,
					color:'#95d1ff',
					x:0,
					y:-15
				})
				this.ctx.fillText(text, 0, 15);
			},
			removeAnimate(ctx,num,bg,r,ringW,isStrokeStyle){
				num = Math.min(num,100)
				this.process =  num;
				this.speedRing(ctx,r,this.oldAngle,Math.PI * (1.5 + 2 * num / 100 ),bg,false,isStrokeStyle) 
				this.insideRing(ctx,r,ringW)
				ctx.strokeStyle = isStrokeStyle ||'#fff';
				this.ringStyle(ctx,r,ringW,isStrokeStyle)
			},
			animate(ctx, num, bg, r, ringW, isStrokeStyle) {
				let that = this;
				requestAnimationFrame(function (){ 
					num = Math.min(num,100)
					that.process =  that.process < num &&  Math.min(that.process + 2,100) || that.process ;
					that.speedRing(ctx,r,that.oldAngle,Math.PI * (1.5 + 2 * that.process / 100 ),bg,false,isStrokeStyle) 
					that.insideRing(ctx,r,ringW)
					if (that.process < num) {  
						that.animate(ctx, num,bg,r,ringW,isStrokeStyle);  
					}
					else{
						ctx.strokeStyle = isStrokeStyle ||'#fff';
						that.process = that.num
						that.ringStyle(ctx,r,ringW,isStrokeStyle)
					}  
				});

			},
			insideRing(ctx, r, ringW) {
				// 画内填充圆   
				ctx.beginPath();
				ctx.arc(0, 0, r - ringW, 0, Math.PI * 2);
				ctx.fillStyle = '#fff';
				ctx.closePath();
				ctx.fill();
			},
			speedRing(ctx, r, startAngle, endAngle, color, cur, isStrokeStyle) {
				// console.log(color)
				// 画进度环 
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineWidth = 2;
				ctx.strokeStyle = (cur || isStrokeStyle!=undefined) && color || '#fff';
				ctx.fillStyle = color;
				if (cur) {
					ctx.save();
					ctx.shadowBlur = 20;
					ctx.shadowColor = "rgb(135, 135, 135)";
					ctx.arc(0, 0, r, startAngle, endAngle);
					ctx.fill();
					ctx.restore();
				}else {
					ctx.arc(0, 0, r, startAngle, endAngle);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
				}
			},
			ringStyle(cartogram, r, ringW, isStrokeStyle) {
				if (this.ringstyle[this.ringStyleNum]) {
					if (this.ringStyleNum == 0) {
						this.oldAngle = Math.PI * 1.5
					} else {
						this.oldAngle = Math.PI * (1.5 + 2 * this.process / 100)
					}
					this.num = this.num + this.ringstyle[this.ringStyleNum].monny / this.ringStyleaAllNum * 100;
					this.ringData.push({
						startAngle: this.oldAngle,
						endAngle: Math.PI * (1.5 + 2 * this.num / 100),
						color: this.ringstyle[this.ringStyleNum].color,
						r: r
					})
					this.ctx = cartogram;
					if(this.ringstyle[this.ringStyleNum].monny != 0 ){
						this.ringStyleNum++;
						this.animate(cartogram, this.num,this.ringstyle[this.ringStyleNum-1].color,r,ringW,isStrokeStyle) 
					}else{
						this.ringStyleNum++;
						this.ringStyle(cartogram,r,ringW,isStrokeStyle)
					}
				} else {
					isStrokeStyle != undefined && this.textCenter(this.ringstyle[0].title, this.ringstyle[0].monny)
				}
			},
			ring(cartogram, cavans) {
				let r = this.r;
				let ringW = this.ringW;
				let ringAmount = []
				cartogram.translate(this.width, this.height);

				for (var k = 0; k<this.ringstyle.length; k++) {
					if(this.ringstyle[k].monny!=0){
						ringAmount.push(k)
					}
					this.ringStyleaAllNum += this.ringstyle[k].monny;
				}

				if(ringAmount.length>1){
					this.ringStyle(cartogram,r,ringW);
					this.ringAmountClick = true
				}else{
					this.ringStyle(cartogram,r,ringW,ringAmount[0])
				}

				// 字
			},
			handleChartClick ( clickEvent ) {
				if(this.ringAmountClick){
					let chartRadius = this.r / 2;
					let chartRadiusMin = (this.r-this.ringW) / 2;
					let mouseX = clickEvent.pageX - clickEvent.srcElement.offsetLeft;
					let mouseY = clickEvent.pageY - clickEvent.srcElement.offsetTop;
					let xFromCentre = mouseX - this.width/2;
					let yFromCentre = mouseY - this.height/2;
					let distanceFromCentre = Math.sqrt( Math.pow( Math.abs( xFromCentre ), 2 ) + Math.pow( Math.abs( yFromCentre ), 2 ) );
					let chartStartAngle = 2* Math.PI;

					if(distanceFromCentre <= chartRadiusMin){
						return false;
					}else if ( distanceFromCentre <= chartRadius ) {
						let clickAngle; 
						if(Math.atan2( yFromCentre, xFromCentre ) < -0.5 * Math.PI && Math.atan2( yFromCentre, xFromCentre ) >-1 * Math.PI ){
							clickAngle =Math.atan2( yFromCentre, xFromCentre ) + chartStartAngle*2;   
						}else{
							clickAngle = Math.atan2( yFromCentre, xFromCentre ) + chartStartAngle; 
						}
						for ( var slice in this.ringData ) {
							if ( clickAngle >= this.ringData[slice].startAngle  && clickAngle <= this.ringData[slice].endAngle ) {
								this.changeRing(slice)
							}
						}
					}else{	
						this.changeRing()				
					} 
				} 
			},
			changeRing(index) {
				// 画进度环  
				this.ctx.clearRect(-this.width, -this.height, this.width * 2, this.height * 2);
				for (var slice in this.ringData) {
					if (slice !== index) {
						this.speedRing(this.ctx, parseInt(this.ringData[slice].r), this.ringData[slice].startAngle, this.ringData[slice].endAngle, this.ringData[slice].color)
						this.insideRing(this.ctx, this.r, this.ringW);

					}
				}
				if (index) {
					this.speedRing(this.ctx, parseInt(this.ringData[index].r) + 5, this.ringData[index].startAngle - 0.05, this.ringData[index].endAngle + 0.05, this.ringData[index].color, true)
					this.insideRing(this.ctx, this.r, this.ringW);
					this.index = index;
					this.textCenter(this.ringstyle[index].title, this.ringstyle[index].monny)
				}

			},
			// maxCoordinate(max){
//       let newMax = max.toString().split('')
//       if(parseInt(newMax[1])>4){
//       	newMax[0]=parseInt(newMax[0])+1;
//       	newMax[1]="0";
//       }else{
//       	newMax[1]="5";
//       }
//       	let zero =''
//         for(var i =0;i<newMax.length-2;i++){
//             zero=zero+'0'
//         }
//         return parseInt(newMax[0]+newMax[1]+zero)
      	
			// },
			barX(cartogram,w,h){
				let line = (h-100)/2,
				scale = this.maxH/2,
				marginLeft = 100
				this.coordinateX({
					ctx:cartogram,
					length:3,
					w:w,
					h:h,
					color:'#f1f1f1',
					marginLeft:marginLeft,
					marginTop:100,
					text:{
					Text: this.maxH,
					isCount: true,
					marginright:10,
					font: "bold 1.4rem Arial"
					}
				})
			},
			barY(cartogram,w,h){
				let intervalX = (w-120)/6,
				showHeight = (h-100)/this.maxH
				for (var i = 1; i < 6; i++) {
					if(i==4){
						this.barStyle(cartogram,120+i*intervalX, h, this.val[i-1]*showHeight,true)
					}else{
						this.barStyle(cartogram,120+i*intervalX, h, this.val[i-1]*showHeight)
					}
					this.setText({
						ctx:cartogram,
						text:this.valX[i-1],
						textAlign:'left',
						x:120+i*intervalX,
						y:h+40
					})
				}
			},
			barStyle(cxt,x, y, h,isCur){
				CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
					if (w < 2 * r) r = w / 2;
					if (h < 2 * r) r = h / 2;
					this.beginPath();
					this.moveTo(x+r, y);
					this.arcTo(x+w, y, x+w, y-h, r);
					this.arcTo(x+w, y-h, x, y-h, r);
					this.arcTo(x, y-h, x, y, r);
					this.arcTo(x, y, x+w, y, r);
					this.closePath();
					return this;
				}
				cxt.lineWidth = 1;
				cxt.strokeStyle = "#fff";
				// ff8208
				cxt.roundRect(x,y,14,h,30).stroke();
				if(isCur){
					cxt.save();
					cxt.fillStyle = "#ff8208";
					cxt.fill()
					cxt.restore();
				}else{
					cxt.fillStyle = "#67aaf9";
					cxt.fill()
				}
			},
			bar(cartogram){
				let h = this.height * 2 - 66,
					w = this.width * 2
				this.barX(cartogram,w,h)
				this.barY(cartogram,w,h)
				this.setText({
					ctx:cartogram,
					text:'万元',
					color:'#ccc',
					textAlign:'right',
					x:100,
					y:50
				})
			}
		},
		mounted() {
			let cavans = document.getElementById(this.id);
			let cartogram = cavans.getContext('2d');
			cavans.width = this.width * 2;
			cavans.height = this.height * 2;
			if (this.type == 'ring') {
				this.ring(cartogram, cavans)
			} else if (this.type =='bar'){
				this.bar(cartogram)
			} else {
				this.Line(cartogram)
			}
			let that = this
		}
	} </script>

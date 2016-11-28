<template>
	  <canvas :id="id"></canvas>
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
          isDrawDashedLine:false
				}
			},
			props: ['width', 'height', 'maxH', 'maxW', 'val', 'valX', 'id', 'type', 'r', 'ringW', 'title', 'ringstyle', 'name'],
			methods: {
				drawDashedLine(context, x1, y1, x2, y2, dashLength) {
					dashLength = dashLength === undefined ? 5 : dashLength;
					let deltaX = x2 - x1;
					let deltaY = y2 - y1;
					let numDashes = Math.floor(
						Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
					for (let i = 0; i < numDashes; ++i) {
						context[i % 2 === 0 ? 'moveTo' : 'lineTo']
							(x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
					}
				},
				LineCoordinateX(cartogram) {
					cartogram.beginPath();
					cartogram.moveTo(0, this.h);
					cartogram.lineTo(this.width * 2, this.h);
					cartogram.lineWidth = 1;
					cartogram.strokeStyle = '#d2e4ff';
					cartogram.stroke();

					let coordinateLine = this.h / 3;
					for (var i = 0; i < 3; i++) {
						cartogram.beginPath();
						cartogram.strokeStyle = '#e3ecf2';
						this.drawDashedLine(cartogram, 30, i * coordinateLine, this.width * 2 - 30, i * coordinateLine, 13);
						cartogram.stroke();
					}
				},
				LineCoordinateY(cartogram) {
					let grad = cartogram.createLinearGradient(0, 0, this.width, 0),
						intervalW = this.intervalW / 2;
					cartogram.lineWidth = 2;
					cartogram.beginPath();
					cartogram.lineWidth = 2;
					grad.addColorStop(0, '#dbe7f6');
					grad.addColorStop(1, '#f1f5fc');
					cartogram.fillStyle = grad;
					cartogram.strokeStyle = '#d8e7ff';
					this.lineAnimate(cartogram, grad)
				},
				speedLine(cartogram, motionW, motionH, h, grad) {
					requestAnimationFrame(() => {
            let OldMotionH = this.OldMotionH,OldMotionW = this.OldMotionW, lineProcess = this.lineProcess
						if (lineProcess == 0) {
							cartogram.moveTo(0, h);
						} else if (lineProcess == this.lineStyleNum) {
							cartogram.moveTo(lineProcess, h);
							cartogram.lineTo(lineProcess, h - OldMotionH);
						}
						if (motionW > lineProcess) {
							cartogram.fillStyle = grad;
							this.lineProcess = Math.min(this.lineProcess + 30, motionW)
							let lineProcess = this.lineProcess,
                  newH
							if (this.lineNum == 0) {
								newH = motionH / motionW * (lineProcess - OldMotionW)
							} else {
								newH = (motionH - OldMotionH) / (motionW - OldMotionW) * (lineProcess - OldMotionW)
							}
							cartogram.stroke();
							cartogram.lineTo(lineProcess, h - OldMotionH - newH);
							cartogram.lineTo(lineProcess, h);
							this.OldMotionH = OldMotionH + newH
							this.OldMotionW = lineProcess
							this.lineStyleNum = this.lineProcess
							this.speedLine(cartogram, motionW, motionH, h, grad)
							cartogram.fill();
						} else {
							this.lineNum++;
							this.OldMotionH = motionH
							this.OldMotionW = motionW
							if (this.lineNum < this.val.length) {
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
									this.lineData(cartogram, i)
								}
							}
						}
					})
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
						// 圆
					cartogram.beginPath();
					if (i == valLen - 2) {
						cartogram.arc(i * lineW + intervalW, h - val[i] * lineH, 10, 0, 2 * Math.PI);
					} else if (i == valLen) {
						cartogram.arc(i * lineW + intervalW, h, 6, 0, 2 * Math.PI);
					} else {
						cartogram.arc(i * lineW + intervalW, h - val[i] * lineH, 6, 0, 2 * Math.PI);
					}
					if (i == valLen - 2) {
						cartogram.strokeStyle = '#ffe3ad';
						cartogram.fillStyle = "#ff7916";
						cartogram.lineWidth = 2;
						cartogram.fill();
						cartogram.stroke();
					} else {
						cartogram.strokeStyle = '#cae7ff';
						cartogram.fillStyle = "#fff";
						cartogram.fill();
						cartogram.stroke();
					}
					// 字
					cartogram.beginPath();
					cartogram.font = "24px Arial";
					if (i == valLen - 2) {
						cartogram.fillStyle = "#ff7916";
					} else {
						cartogram.fillStyle = "#a5a5a5";
					}
					cartogram.textAlign = "center";
					let textVal = i !== valLen && this.val[i] || ''
					cartogram.fillText(textVal, i * lineW + intervalW, h - val[i] * lineH - 15);
					cartogram.stroke();

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
					cartogram.beginPath();
					cartogram.fillStyle = "#666"
					cartogram.font = "24px Arial";
					cartogram.fillText(this.name, 35, 50);
					cartogram.stroke();
					cartogram.translate(0, 90);
          // if(maxYear > val[3].year){
          //   this.isDrawDashedLine= true 
          // }else{
          //   // console.log(parseInt(val[4]))
          //   this.isDrawDashedLine = parseInt(val[4].month) > maxMonth 
          // }
          console.log(this.isDrawDashedLine)
					this.LineCoordinateX(cartogram)
					this.LineCoordinateY(cartogram)
					for (var i = 0; i < valLen; i++) {
						// 下字
						cartogram.beginPath();
						cartogram.fillStyle = i == valLen - 2 && "#333" || "#afafaf";
						cartogram.font = i == valLen - 2 && "32px Arial" || "28px Arial";
						cartogram.textAlign = "center";
						cartogram.fillText(this.valX[i], i * lineW + intervalW, h + 45);
						cartogram.stroke();
					}
				},
				textCenter(text, num) {
					this.ctx.font = "bold 28px Arial";
					this.ctx.fillStyle = '#95d1ff';
					this.ctx.textAlign = 'center';
					this.ctx.textBaseline = 'middle';
					this.ctx.fillText('￥' + num, 0, -15);
					this.ctx.font = "bold 28px Arial";
					this.ctx.fillStyle = '#95d1ff';
					this.ctx.textAlign = 'center';
					this.ctx.textBaseline = 'middle';
					this.ctx.fillText(text, 0, 15);
				},
				animate(ctx, num, bg, r, ringW, isStrokeStyle) {
					let that = this;
					requestAnimationFrame(function() {
						that.process = Math.min(that.process + 1, 100);
						num = Math.min(num, 100);
						that.speedRing(ctx, r, that.oldAngle, Math.PI * (1.5 + 2 * that.process / 100), bg, false, isStrokeStyle)
						that.insideRing(ctx, r, ringW)
						if (that.process < num) {
							that.animate(ctx, num, bg, r, ringW, isStrokeStyle);
						} else {
							ctx.strokeStyle = isStrokeStyle || '#fff';
							that.process = that.num
							that.ringStyle(ctx, r, ringW, isStrokeStyle)
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
					// 画进度环 
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineWidth = 2;
					ctx.strokeStyle = (cur || isStrokeStyle) && color || '#fff';
					ctx.fillStyle = color;
					if (cur) {
						ctx.save();
						ctx.shadowBlur = 20;
						ctx.shadowColor = "rgb(135, 135, 135)";
						ctx.arc(0, 0, r, startAngle, endAngle);
						ctx.fill();
						ctx.restore();
					} else {
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
						this.animate(cartogram, this.num, this.ringstyle[this.ringStyleNum].color, r, ringW, isStrokeStyle)
					} else {
						isStrokeStyle && this.textCenter(this.ringstyle[0].title, this.ringstyle[0].monny)
					}
					this.ringStyleNum++;
				},
				ring(cartogram, cavans) {
					let r = this.r;
					let ringW = this.ringW;
					cartogram.translate(this.width, this.height);
					for (var k in this.ringstyle) {
						this.ringStyleaAllNum += this.ringstyle[k].monny;
					}

					if (this.ringstyle.length > 1) {
						this.ringStyle(cartogram, r, ringW);
						cavans.addEventListener('click', this.handleChartClick, false);
					} else {
						this.ringStyle(cartogram, r, ringW, true)
					}

					// 字
				},
				handleChartClick(clickEvent) {

					let chartRadius = this.r / 2;
					let chartRadiusMin = (this.r - this.ringW) / 2;
					let mouseX = clickEvent.pageX;
					let mouseY = clickEvent.layerY;
					let xFromCentre = mouseX - this.width / 2;
					let yFromCentre = mouseY - this.height / 2;
					let distanceFromCentre = Math.sqrt(Math.pow(Math.abs(xFromCentre), 2) + Math.pow(Math.abs(yFromCentre), 2));
					let chartStartAngle = 2 * Math.PI;
					if (distanceFromCentre <= chartRadiusMin) {
						return false;
					} else if (distanceFromCentre <= chartRadius) {
						let clickAngle;
						if (Math.atan2(yFromCentre, xFromCentre) < -0.5 * Math.PI && Math.atan2(yFromCentre, xFromCentre) > -1 * Math.PI) {
							// clickAngle = -Math.atan2( yFromCentre, xFromCentre ) + chartStartAngle+.5* Math.PI;  
							clickAngle = Math.atan2(yFromCentre, xFromCentre) + chartStartAngle * 2;
						} else {
							clickAngle = Math.atan2(yFromCentre, xFromCentre) + chartStartAngle;
						}
						for (var slice in this.ringData) {
							if (clickAngle >= this.ringData[slice].startAngle && clickAngle <= this.ringData[slice].endAngle) {
								this.changeRing(slice)
							}
						}
					} else {
						this.changeRing()
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

				}

			},
			mounted() {
				let cavans = document.getElementById(this.id);
				let cartogram = cavans.getContext('2d');
				cavans.width = this.width * 2;
				cavans.height = this.height * 2;
				if (this.type == 'ring') {
					this.ring(cartogram, cavans)
				} else {
					this.Line(cartogram)
				}
				let that = this
			}
	} </script>
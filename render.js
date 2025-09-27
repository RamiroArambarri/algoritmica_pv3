this.setUniform('time', performance.now() / 1000)
this.setUniform('pixSize', 1 / width)
this.setUniform('width', width)
this.setUniform('height', width)
this.setUniform('mouseX', mouse.x)
this.setUniform('mouseY', mouse.y)
this.setUniform('pi', Math.PI)


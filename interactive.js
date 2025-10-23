class Interactive {
    constructor(parentShader) {
        this.parentShader = parentShader
        this.eventListeners = []

    }

    keyPressed = (key, func) => {
        const callback = (ev) => {
            if (ev.key.toLowerCase() == key) {
                func();
            }
        }

        window.addEventListener('keydown', callback);

        this.eventListeners.push({ type: 'keydown', callback: callback });
    }

    setKeyTimer = (key) => {
        if (!this[(`${key}InitTimer`)]) {
            this[(`${key}InitTimer`)] = -Infinity
        }

        const callback = (ev) => {
            if (ev.key.toLowerCase() == key) {
                this[(`${key}InitTimer`)] = performance.now() / 1000
            }
        }

        window.addEventListener('keydown', callback);

        this.eventListeners.push({ type: 'keydown', callback: callback });

        this[(`${key}Timer`)] = performance.now() / 1000 - this[(`${key}InitTimer`)]
    }

    setKeyToggle = (key) => {
        if (!this[(`${key}Toggle`)]) {
            this[(`${key}Toggle`)] = false
        }

        const callback = (ev) => {
            if (ev.key.toLowerCase() == key) {
                this[(`${key}Toggle`)] = !this[(`${key}Toggle`)]
            }
        }

        window.addEventListener('keydown', callback);

        this.eventListeners.push({ type: 'keydown', callback: callback });
    }

    setKeySlider = (key, direction) => {
        if (this[(`${key}Slider`)] === undefined) {
            this[(`${key}Slider`)] = 0
            this[(`${key}Slider0`)] = 0
            this[(`${key}SliderActive`)] = false
        }

        const callback = (ev) => {
            if (ev.key.toLowerCase() == key) {
                this[(`${key}SliderActive`)] = !this[(`${key}SliderActive`)]

                if(direction == 'ud') {
                    this[(`${key}Slider0`)] = mouse[1]/height - this[(`${key}Slider`)]
                } else {
                    this[(`${key}Slider0`)] = mouse[0]/width - this[(`${key}Slider`)]
                }
                
            }
        }

        if (this[(`${key}SliderActive`)]) {
            if(direction == 'ud') {
                    this[(`${key}Slider`)] = mouse[1]/height - this[(`${key}Slider0`)]
                } else {
                    this[(`${key}Slider`)] = mouse[0]/width - this[(`${key}Slider0`)]
                }
            
        }

        window.addEventListener('keydown', callback);

        this.eventListeners.push({ type: 'keydown', callback: callback });
    }
}
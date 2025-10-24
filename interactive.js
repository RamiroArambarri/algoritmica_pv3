class Interactive {
    constructor(parentShader) {
        this.parentShader = parentShader
        this.eventListeners = []

    }

    applyFunctionAngLog = (func) => {
        const messages = []
        const originalLog = console.log
        console.log = (message) => {
            messages.push(message)
            originalLog()
        }
        func();
        $errorLog.innerHTML = $errorLog.innerHTML + messages.join('<br>') + '<br>'
    }

    keyPressed = (key, func) => {
        const regex = /^[a-zA-Z0-9]$/
        if (regex.test(key)) {
            //Keyboard events
            const callback = (ev) => {
                if (ev.key.toLowerCase() == key) {
                    this.applyFunctionAngLog(func)
                }

            }
            window.addEventListener('keydown', callback);

            this.eventListeners.push({ type: 'keydown', callback: callback });
        } else if (key == 'mouseLeft' || key == 'mouseMiddle' || key == 'mouseRight') {

            let inputNum = key == 'mouseLeft' ? 0 : key == 'mouseMiddle' ? 1 : 2

            const callback = (ev) => {
                //Mouse events
                if (ev.button == inputNum) {
                    this.applyFunctionAngLog(func)
                }

            }
            window.addEventListener('mousedown', callback);

            this.eventListeners.push({ type: 'mousedown', callback: callback });
        }
    }

    keyReleased = (key, func) => {
        const regex = /^[a-zA-Z0-9]$/
        if (regex.test(key)) {
            //Keyboard events
            const callback = (ev) => {
                if (document.activeElement != $('#frag-input') && document.activeElement != $('#js-input')) {
                    if (ev.key.toLowerCase() == key) {
                        this.applyFunctionAngLog(func)
                    }
                }
            }
            window.addEventListener('keyup', callback);

            this.eventListeners.push({ type: 'keyup', callback: callback });
        } else if (key == 'mouseLeft' || key == 'mouseMiddle' || key == 'mouseRight') {

            let inputNum = key == 'mouseLeft' ? 0 : key == 'mouseMiddle' ? 1 : 2

            const callback = (ev) => {
                //Mouse events
                if (document.activeElement != $('#frag-input') && document.activeElement != $('#js-input')) {
                    if (ev.button == inputNum) {
                        this.applyFunctionAngLog(func)
                    }
                }
            }
            window.addEventListener('mouseup', callback);

            this.eventListeners.push({ type: 'mouseup', callback: callback });
        }
    }

    setKeyTimer = (key) => {
        if (!this[(`${key}InitTimer`)]) {
            this[(`${key}InitTimer`)] = -Infinity
        }

        this.keyPressed(key, () => { this[(`${key}InitTimer`)] = performance.now() / 1000 })

        this[(`${key}Timer`)] = performance.now() / 1000 - this[(`${key}InitTimer`)]
    }

    setKeyToggle = (key) => {
        if (!this[(`${key}Toggle`)]) {
            this[(`${key}Toggle`)] = false
        }

        this.keyPressed(key, () => { this[(`${key}Toggle`)] = !this[(`${key}Toggle`)] })
    }

    setKeySlider = (key, direction) => {
        if (this[(`${key}Slider`)] === undefined) {
            this[(`${key}Slider`)] = 0
            this[(`${key}Slider0`)] = 0
            this[(`${key}SliderActive`)] = false
        }


        this.keyPressed(key, () => {
            this[(`${key}SliderActive`)] = true

            if (direction == 'ud') {
                this[(`${key}Slider0`)] = mouse[1] / height - this[(`${key}Slider`)]
            } else {
                this[(`${key}Slider0`)] = mouse[0] / width - this[(`${key}Slider`)]
            }
        })

        this.keyReleased(key, () => { this[(`${key}SliderActive`)] = false })


        if (this[(`${key}SliderActive`)]) {
            if (direction == 'ud') {
                this[(`${key}Slider`)] = mouse[1] / height - this[(`${key}Slider0`)]
            } else {
                this[(`${key}Slider`)] = mouse[0] / width - this[(`${key}Slider0`)]
            }

        }

    }
}
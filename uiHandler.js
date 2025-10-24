const $ui = $('#ui');
const $fragInput = $('#frag-input');
const $fragButton = $('#frag-button');
const $jsButton = $('#js-button');
const $jsInput = $('#js-input');
const $compileButton = $('#compile-button');
const $errorLog = $('#errorLog')
const $messageLog = $('#messageLog')

let editingFile = '.frag'
let uiDisplayState = 'hidden'


$jsButton.addEventListener('click', () => {
    editingFile = '.js'
    $('#frag-pannel').style.display = "none"
    $('#js-pannel').style.display = "block"
})

$fragButton.addEventListener('click', () => {
    editingFile = '.frag'
    $('#frag-pannel').style.display = "block"
    $('#js-pannel').style.display = "none"
})

const setupUI = (jsSource, fragSource) => {
    $fragInput.value = fragSource
    $jsInput.value = jsSource
}



$compileButton.addEventListener('click', async () => {
    switch (editingFile) {
        case '.frag':
            editFrag();
            break;
        case '.js':
            editJs();
            break;
    }

})

const editFrag = () => {
    myShader.fragSource = $fragInput.value;

    const setUpResponse = myShader.setUpProgram();

    if (setUpResponse != 0) {
        $errorLog.innerHTML = setUpResponse
    } else {
        $errorLog.innerHTML = ''
        navigator.clipboard.writeText($fragInput.value)
    }
}

const editJs = () => {
    const setUpResponse = myShader.setUpRender($jsInput.value)
    if (setUpResponse[0] != 0) {
    } else {
        $errorLog.innerHTML = ''
        navigator.clipboard.writeText($jsInput.value)
    }

    $messageLog.innerHTML = setUpResponse.slice(1).join('<br>') + '<br>';

}

window.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey && ev.key.toLowerCase() == "q") {
        $('#ui').style.display = $('#ui').style.display == 'block' ? 'none' : 'block';
    }
});

window.addEventListener("contextmenu", (ev) => {
    ev.preventDefault()
});

$ui.addEventListener("keydown", (ev) => {
    ev.stopPropagation()
});

$ui.addEventListener("keyup", (ev) => {
    ev.stopPropagation()
});

$ui.addEventListener("mousedown", (ev) => {
    ev.stopPropagation()
});

$ui.addEventListener("mouseup", (ev) => {
    ev.stopPropagation()
    $fragButton.blur();
    $jsButton.blur();
    $compileButton.blur();
});
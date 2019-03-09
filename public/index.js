const ENTER = 13;

setUp();

function setUp() {
    const textInput = $("input[type='text']");
    const dropZone = $(".dropzone");
    getCurrentState(dropZone);
    initFunctionality(textInput, dropZone);
    setEmptyListDisplayState();
    setShowHide(textInput, dropZone);
    setPlusSign(textInput);
    setCheckSign();
    setTrashSign();
    setSingleItemDeleteOption();
}

function getCurrentState(dropZone) {
    const tasksDict = {
        1: "todo",
        2: "doing",
        3: "done"
    };
    getListsStates(tasksDict);
    $(".draggable").draggable({
        helper: "clone"
    });
    setDragAndDrop(dropZone);
}

function getListsStates(tasksDict) {
    for(let key in tasksDict) {
        let content = localStorage.getItem(`${tasksDict[key]}`);
        $(`#${tasksDict[key]} ul`).append(content);
    }
}

function setListsStates() {
    localStorage.clear();
    localStorage.setItem("todo", $("#todo ul")[0].innerHTML);
    localStorage.setItem("doing", $("#doing ul")[0].innerHTML);
    localStorage.setItem("done", $("#done ul")[0].innerHTML);
}

function initFunctionality(textInput, dropZone) {
    textInput.on("keypress", function(event) {
        if(event.keyCode == ENTER) {
            addTask($(this), dropZone);
        }
    });
}

function setShowHide(textInput, dropZone) {
    textInput.on("focusout", function() {
        addTask($(this), dropZone);
    });
}

function addTask(textInput, dropZone) {
    let value = textInput.val();
    if(checkValidity(value)) {
        textInput.val("");
        $("#todo ul").prepend(`<li class='draggable'>${value} <i class="fas fa-times"></i></li>`);
        textInput.removeClass("initial");
        $(".draggable").draggable({
            helper: "clone"
        });
        $(".last-li").removeClass("last-li");
        localStorage.setItem("todo", $("#todo ul")[0].innerHTML);
        setDragAndDrop(dropZone);
        setSingleItemDeleteOption();
        setEmptyListDisplayState();
    }
}

function checkValidity(value) {
    if(value === "" || value.includes("<")) {
        return false;
    }
    return true;
}

function setDragAndDrop(dropZone) {
    setDraggableFunctionality();
    setDroppableFunctionality(dropZone);
}

function setDroppableFunctionality(dropZone) {
    dropZone.droppable({
        tolerance: "touch"
    });
    dropZone.on("dropover", function() {
        $(".draggable").draggable({
            revert: false
        });
    });

    dropZone.on("dropout", function() {
        $(".draggable").draggable({
            revert: true
        });
    });

    dropZone.on("drop", function(event, ui) {
        ui.helper.css("width", "300px");
        $(this).find("ul").append(ui.draggable[0]);
        $(".ui-draggable-dragging").remove();
        $(".dragging").removeClass("dragging");
        $(".last-li").removeClass("last-li");
        setListsStates();
        setSingleItemDeleteOption();
        setEmptyListDisplayState();
    });
}


function setDraggableFunctionality() {
    setDragStart();
    setRevert();
}

function setDragStart() {
    $(".draggable").on("dragstart", function() {
        $(this).addClass("dragging");
        const draggedElement = document.querySelector(".dragging");
        const draggedFromList = draggedElement.parentNode.children;
        const listLength = draggedFromList.length
        if(listLength <= 2) {
            draggedElement.parentElement.previousElementSibling.classList.remove("hidden");
        } else if(draggedElement == draggedFromList[listLength - 2]){
            draggedFromList[listLength - 3].classList.add("last-li");
        } else {
            draggedFromList[listLength - 2].classList.add("last-li");
        }
        setInputDisplayState();
    });
}

function setRevert() {
    $(".draggable").on("dragstop", function() {
        const draggedElement = document.querySelector(".dragging");
        if(draggedElement) {
            styleLastListElement(draggedElement);
            $(this).removeClass("dragging");
            $(".ui-draggable-dragging").remove();
            setEmptyListDisplayState();
        }
    });
}

function styleLastListElement(draggedElement) {
    const draggedFromList = draggedElement.parentNode.children;
    for(element of draggedFromList) {
        element.classList.remove("last-li");
    }
    if(!draggedElement.nextElementSibling.nextElementSibling){
        draggedElement.classList.add("last-li");
    }
}

function setPlusSign(textInput) {
    const plusSign = $(".fa-plus");
    plusSign.on("mousedown", function() {
        setTimeout(function() {
            textInput.focus();
        });
    });
}

function setCheckSign() {
    const checkSign = $(".fa-check");
    checkSign.on("click", function() {
        const taskList = $("#doing ul li");
        $("#done ul").append(taskList);
        setEmptyListDisplayState();
        setListsStates();
    });
}

function setTrashSign() {
    const trashSign = $(".fa-trash-alt");
    trashSign.on("click", function() {
        const taskList = $("#done ul li");
        taskList.remove();
        setEmptyListDisplayState();
        setListsStates();
    });
}

function setSingleItemDeleteOption() {
    $(".fa-times").on("click", function() {
        $(this).parent().remove();
        setEmptyListDisplayState();
        setListsStates();
    });
}

function setEmptyListDisplayState() {
    const spaceHolders = document.querySelectorAll(".spaceholder");
    for(spaceHolder of spaceHolders) {
        if(spaceHolder.nextElementSibling.children.length === 0) {
            spaceHolder.classList.remove("hidden");
        } else {
            spaceHolder.classList.add("hidden");
        }
   }
   setInputDisplayState();
}

function setInputDisplayState() {
    const todoList = document.querySelector("#todo ul");
    const textInput = document.querySelector("input");
    if(todoList.children.length > 2 && todoList.children[0].classList.contains("dragging")) {
        textInput.classList.remove("initial");
    }
    else if(todoList.children.length == 0 || todoList.children[0].classList.contains("dragging")) {
        textInput.classList.add("initial");
    } else {
        textInput.classList.remove("initial");
   }
}





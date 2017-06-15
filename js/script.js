(function() {
"use strict";

var todos = [];
var nextId = 1;

if (localStorage["todoData"]) {
 todos = JSON.parse(localStorage["todoData"]);
 displayList();
}

$("#addNewBtn").on("click", addNewTodo);
$("#listOfTasks").on("click", ".editItem", editTodo);
$("#listOfTasks").on("click", ".deleteItem", confirmAndDeleteTodo);
$("#listOfTasks").on("click", ".itemCheckbox i", markAsComplete);
$("#star-input i").on("click", toggleStarred);

$("#all-tasks").on("click", displayAll);
$("#starred-tasks").on("click", displayStarredList);
$("#today-tasks").on("click", displayTodayList);

$("#viewCompletedBtn").click(function() {
  $("#completed-task-list").toggle();
});

function displayList() {
  $("#listOfTasks").empty();
  $("#listOfCompletedTasks").empty();
  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];
    var li = $("<li data-id='" + todo.id + "' class='taskItem'>");
    var spanCheckbox;
    var spanContent = "<span class='itemContent'> " + todo.todoContent + "</span>"
    var spanDelete = "<span class='deleteItem'><i class='fa fa-trash-o' aria-hidden='true'></i></span>";
    var spanEdit = "<span class='editItem'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span>";
    var spanDate = "<span class='itemDate'>" + todo.todoDate + "</span>";
    var spanStar = "<span class='starItem'><i class='fa fa-star' aria-hidden='true'></i></span>";
    if (todo.todoCompleted === true) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-check-square-o' aria-hidden='true'></i></span>";
    } else if (todo.todoCompleted === false) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-square-o' aria-hidden='true'></i></span>";
    }
    li.append(spanCheckbox);
    li.append(spanContent);
    if (todo.todoCompleted === false) {
      li.append(spanDelete);
      li.append(spanEdit);
      if (todo.todoStarred === true) {
        li.append(spanStar);
      }
      li.append(spanDate);
    }
    if (todo.todoCompleted === true) {
      $("#listOfCompletedTasks").append(li);
    } else if (todo.todoCompleted === false) {
      $("#listOfTasks").append(li);
    }
  }
  $("#bg-overlay").removeClass("overlay");
  $("#task-modal").hide();
}

function displayAll() {
  displayList();
  $("#tasks-title").text("All Tasks");
}

function displayStarredList() {
  var todos_starred = todos.filter(function(el) {
    return el.todoStarred === true;
  });
  $("#tasks-title").text("Starred Tasks");

  $("#listOfTasks").empty();
  $("#listOfCompletedTasks").empty();
  for (var i = 0; i < todos_starred.length; i++) {
    var todo_starred = todos_starred[i];
    var li = $("<li data-id='" + todo_starred.id + "' class='taskItem'>");
    var spanCheckbox;
    var spanContent = "<span class='itemContent'> " + todo_starred.todoContent + "</span>"
    var spanDelete = "<span class='deleteItem'><i class='fa fa-trash-o' aria-hidden='true'></i></span>";
    var spanEdit = "<span class='editItem'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span>";
    var spanDate = "<span class='itemDate'>" + todo_starred.todoDate + "</span>";
    var spanStar = "<span class='starItem'><i class='fa fa-star' aria-hidden='true'></i></span>";
    if (todo_starred.todoCompleted === true) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-check-square-o' aria-hidden='true'></i></span>";
    } else if (todo_starred.todoCompleted === false) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-square-o' aria-hidden='true'></i></span>";
    }
    li.append(spanCheckbox);
    li.append(spanContent);
    if (todo_starred.todoCompleted === false) {
      li.append(spanDelete);
    li.append(spanEdit);
    if (todo_starred.todoStarred === true) {
      li.append(spanStar);
    }
    li.append(spanDate);
    }
    if (todo_starred.todoCompleted === true) {
      $("#listOfCompletedTasks").append(li);
    } else if (todo_starred.todoCompleted === false) {
      $("#listOfTasks").append(li);
    }
  }
}

function displayTodayList() {
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var today_date = ((''+month).length<2 ? '0' : '') + month + '/' + ((''+day).length<2 ? '0' : '') + day + '/' + d.getFullYear();

  var todos_today = todos.filter(function(el) {
    return el.todoDate === today_date;
  });
  $("#tasks-title").text("Today's Tasks");

  $("#listOfTasks").empty();
  $("#listOfCompletedTasks").empty();
  for (var i = 0; i < todos_today.length; i++) {
    var todo_today = todos_today[i];
    var li = $("<li data-id='" + todo_today.id + "' class='taskItem'>");
    var spanCheckbox;
    var spanContent = "<span class='itemContent'> " + todo_today.todoContent + "</span>"
    var spanDelete = "<span class='deleteItem'><i class='fa fa-trash-o' aria-hidden='true'></i></span>";
    var spanEdit = "<span class='editItem'><i class='fa fa-pencil-square-o' aria-hidden='true'></i></span>";
    var spanDate = "<span class='itemDate'>" + todo_today.todoDate + "</span>";
    var spanStar = "<span class='starItem'><i class='fa fa-star' aria-hidden='true'></i></span>";
    if (todo_today.todoCompleted === true) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-check-square-o' aria-hidden='true'></i></span>";
    } else if (todo_today.todoCompleted === false) {
      spanCheckbox = "<span class='itemCheckbox'><i class='fa fa-square-o' aria-hidden='true'></i></span>";
    }
    li.append(spanCheckbox);
    li.append(spanContent);
    if (todo_today.todoCompleted === false) {
      li.append(spanDelete);
    li.append(spanEdit);
    if (todo_today.todoStarred === true) {
      li.append(spanStar);
    }
    li.append(spanDate);
    }
    if (todo_today.todoCompleted === true) {
      $("#listOfCompletedTasks").append(li);
    } else if (todo_today.todoCompleted === false) {
      $("#listOfTasks").append(li);
    }
  }
}

function storeTodoData() {
   localStorage["todoData"] = JSON.stringify(todos);
 }

function addNewTodo() {
  addOrEditTodo();
}

function editTodo(evt) {
  var i = indexOfEventTodo(evt);
  if (i >= 0) {
    addOrEditTodo(todos[i]);
  }
}

function markAsComplete(evt) {
  var i = indexOfEventTodo(evt);
  if (i >= 0) {
    $(this).removeClass("fa-square-o").addClass("fa-check-square-o");
    addOrEditTodo(todos[i]);
  }
  displayList();
  storeTodoData();
  console.log(todos);
}

function confirmAndDeleteTodo(evt) {
  var i = indexOfEventTodo(evt);
  if (i >= 0) {
    if (window.confirm("Are you sure you want to delete the task '" + todos[i].todoContent + "'?")) {
      deleteTodo(i);
      displayList();
    }
  }
  function deleteTodo(idx) {
    todos.splice(idx, 1);
    storeTodoData();
  }
}

function indexOfEventTodo(evt) {
  var span = evt.target;
  var li = $(span).closest("li");
  var id = li.attr("data-id");
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      return i;
    }
  }
  return -1;
}

function addOrEditTodo(todo) {
  var completedStatus, starredStatus;
  if (todo) {
    $("#task-input").val(todo.todoContent);
    if ($(".itemCheckbox i").hasClass("fa-check-square-o")) {
      todo.todoCompleted = true;
    }
    if (todo.todoStarred === true) {
      $("#star-input i").removeClass("fa-star-o").addClass("fa-star");
    } else if (todo.todoStarred === false) {
      $("#star-input i").removeClass("fa-star").addClass("fa-star-o");
    }
    $("#datepicker").val(todo.todoDate);
    $(".itemCheckbox i").removeClass("fa-check-square-o").addClass("fa-square-o");
  } else {
    $("#task-input").val("");
    $("#star-input i").removeClass("fa-star").addClass("fa-star-o");
    $("#datepicker").val("");
  }

  $("#modalSaveBtn").one("click", addOrUpdateTodo);
//  $("#modalCancelBtn").one("click", displayList);

  $("#bg-overlay").addClass("overlay");
  $("#task-modal").show();

  function addOrUpdateTodo(evt) {
    evt.preventDefault();
    if ($(".itemCheckbox i").hasClass("fa-check-square-o")) {
      completedStatus = true;
    } else if ($(".itemCheckbox i").hasClass("fa-square-o")) {
      completedStatus = false;
    }
    if ($("#star-input i").hasClass("fa-star-o")) {
      starredStatus = false;
    } else if ($("#star-input i").hasClass("fa-star")) {
      starredStatus = true;
    }
    if (todo) {
      todo.todoCompleted = completedStatus;
      todo.todoStarred = starredStatus;
      todo.todoDate = $("#datepicker").val();
      if (todo.todoCompleted === false) {
        todo.todoContent = $("#task-input").val();
      }
    } else {
      var newTodo = {
        id: (nextId++).toString(),
        todoContent: $("#task-input").val(),
        todoCompleted: false,
        todoStarred: starredStatus,
        todoDate: $("#datepicker").val()
      };
      todos.push(newTodo);
    }
    displayList();
    storeTodoData();
    console.log(todos);
  }
}

function toggleStarred() {
  $(this).toggleClass("fa-star-o fa-star");
}

// Datepicker widget
$(function() {
  $("#datepicker").datepicker({
  	inline: true,
  	showOtherMonths: true,
  	dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	});
});
$("#date-input i").click(function() {
  $("#datepicker").datepicker("show");
});

})();
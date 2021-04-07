const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createToDoItem = (todo) => {
  return `<tr class='todo-item'><th>${escape(todo)}</th></tr>`;
};

const renderTodos = (todos) => {
  for(let todo of todos){
    console.log('todo', todo);
    $(`#${todo.category}-items`).append(createToDoItem(todo.name));
  }
  //adds empty table row to the end of each item, made invisible with css
  $(`#${todos[0].category}-items`).append(`<tr class='todo-item sort-disabled'><th></th></tr>`);

};

$(() => {
  // clear textarea and get correct lists for user on reload
  $('#todo-text').val('');
  $.ajax({
    method:'GET',
    url: '/lists/',
    success: (lists) => {
      for (let list of lists){
        renderTodos(list);
      }
    }
  });

  $('#add-item').on("submit", function(event) {
    event.preventDefault();
    $('.error').hide()
    const len = $("#todo-text").val().trim().length;
    if (len){
      $.ajax({
        method:'POST',
        url:'/lists/',
        data: $(this).serialize(),
        success: (() => {
          $('#todo-text').val('');
          //$(`#${data.category}-items`).append(createToDoItem(`${data.name}`));
          $.ajax({
            method:'GET',
            url: '/lists/',
            success: (lists) => {
              $("#buy-items").empty();
              $("#eat-items").empty();
              $("#read-items").empty();
              $("#watch-items").empty();
              for (let list of lists){
                renderTodos(list);
              }
            }
          })
        })
      }).fail(() => {
        $('.error').text('Please log in before adding an item').slideDown(300);
      });
    } else {
      $(".error").text('Empty text means you got nothing to do....').slideDown(300);
    }
  })

  $('.login').on('submit', function(event) {
    event.preventDefault();
    const max = 5;
    const id = Math.floor(Math.random() * (max - 1) + 1)
    $.ajax({
      method:'GET',
      url:`/user/login/${id}`
    });
  });
  // making the lists move
  $( "#watch-items, #buy-items, #read-items, #eat-items" ).sortable({
  //solution for dragging to empty table adapted from https://stackoverflow.com/questions/3751436/jquery-ui-sortable-unable-to-drop-tr-in-empty-tbody
    items: ">*:not(.sort-disabled)",
    connectWith: ".connectedLists"
  }).disableSelection();

  //drag n drop functionality
  $(".todo-item").on('drag', function(event) {
    const id = $(this).attr('id');
    $("div.card").on('drop', function (event) {
      const category = $(this).attr('id').split('-')[0];
      $.ajax({
        url:'/lists/move',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({"id": id, "category": category})
      })
    });
  })

});

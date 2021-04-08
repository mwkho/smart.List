const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createToDoItem = (todo, id) => {
  return `<tr id=todo_${id} class='todo-item'><th>${escape(todo)}</th><td><button class="btn btn-danger" type=submit action="/lists/delete" method="POST">X</button></td></tr>`;
}; // added a button to the created items

const renderTodos = (todos) => {
  for (let todo of todos) {
    $(`#${todo.category}-items`).append(createToDoItem(todo.name, todo.id));
  }
};

const listReload = () => {
  const categories = ['buy', 'watch', 'read', 'eat', 'unsorted'];
  for (let category of categories) {
    $(`#${category}-items`).empty();
    $(`#${category}-items`).append(`<tr class="todo-item sort-disabled"><th></th></tr>`);
  }
};

const showUncategorize = () => {
  $('.uncategorize').first().each(() => {
    $('.uncategorize').hide();
    if(($('#uncategorize-items').children().length)){
      $('.uncategorize').show(200);
    }
  })
}

$(() => {
  // clear textarea and get correct lists for user on reload
  $.ajax({
    method:'GET',
    url: '/lists/',
    success: (lists) => {
      listReload();
      for (let list of lists) {
        renderTodos(list);
      }
    }
  });

  showUncategorize();
  $('#todo-text').val('');

  $('#add-item').on('submit', function(event) {
    event.preventDefault();
    $('.error').hide();
    const len = $('#todo-text').val().trim().length;
    if (len) {
      $.ajax({
        method:'POST',
        url:'/lists/',
        data: $(this).serialize(),
        success: (() => {
          $.ajax({
            method:'GET',
            url: '/lists/',
            success: (lists) => {
              listReload();
              for (let list of lists) {
                renderTodos(list);
              }
              showUncategorize();
              $('#todo-text').val('');
            }
          });
        })
      }).fail(() => {
        $('.error').text('Please log in before adding an item').slideDown(300);
      });
    } else {
      $('.error').text('Empty text means you got nothing to do....').slideDown(300);
    }
  });

  $('.login').on('submit', function(event) {
    event.preventDefault();
    const max = 5;
    const id = Math.floor(Math.random() * (max - 1) + 1);
    $.ajax({
      method:'GET',
      url:`/user/login/${id}`
    });
  });

  $('.todo-item').on('submit', function(event) { // this is new
    event.preventDefault();
    $.ajax({
      method:'POST',
      url:`/lists/delete`,
      data: $(this).attr('id')
    });
  });

  // making the lists move
<<<<<<< HEAD
  $( "#watch-items, #buy-items, #read-items, #eat-items, #unsorted-items" ).sortable({
=======
  $('#watch-items, #buy-items, #read-items, #eat-items, #uncategorize-items').sortable({
>>>>>>> uncategorized
  //solution for dragging to empty table adapted from https://stackoverflow.com/questions/3751436/jquery-ui-sortable-unable-to-drop-tr-in-empty-tbody
    items: ">*:not(.sort-disabled)",
    connectWith: '.connectedLists',
    receive: (event, ui) => {
      // update only when an item is dropped (received) into a different list,
      const id = ui.item.attr('id').split('_')[1];
      const category = ui.item.parent().attr('id').split('-')[0];
      $.ajax({
        method: 'POST',
        url: '/lists/move',
        data: {id, category}
      });
      showUncategorize();
    }
  }).disableSelection();
});

// initialize websocket
var ws = new WebSocket("ws://192.168.56.101:8080/");

console.log('starting meteorite websockets. . .');

ws.onmessage = function(msg) {
  // parse the json message
  // todo: handle non-json messages
  var json = JSON.parse(msg.data);
  
  // log the data
  console.log(json);
  
  // if this is a delete
  if (json.bind_data === 'delete') {
    // remove the item
    $('#' + json.bind_key).remove();
    // halt further processing
    return false;
  }
  
  // for each meteorite class
  $('.meteorite').each(function() {
    // if the bind keys match
    if ($(this).data('bind-key') === json.bind_key) {
      console.log('bind found');
      
      // if there is no bind-attr present, this is a collection
      if ($(this).data('bind-attr') === undefined) {
        add(json, $(this));
      // else update the element
      } else {
        update(json, $(this));
      }
      
    }
  });
}

// add an item
function add(json, $element) {
  // add to the dom
  $element.append(json.bind_data);
  // listen to subscribe events
  subscribe($(json.bind_data).find('.meteorite').data('bind-key'));  
}

// update a single attribute
function update(json, $element) {
  // get the bind data
  var bind_data = JSON.parse(json.bind_data);
  // desired attribute
  var bind_attr = $element.data('bind-attr');
  // get the attribute data
  var attr_data = bind_data[bind_attr];

  // update the property
  $element.prop('checked', attr_data);
  // update the text
  $element.text(attr_data);
  // notify event handlers that a change has occurred
  $element.trigger('change');
}

// when the document is ready
$(document).on('page:load ready', function() {
  subscribeAfterWebsocket();
});

// subscribe to all bind keys of meteorite classes
function subscribeAll() {
  // for each meteorite class
  $('.meteorite').each(function() {
    // if there is a bind key
    if ($(this).data('bind-key') !== undefined) {
      // subscribe
      subscribe($(this).data('bind-key'));
    }
  });
}

// wait for websocket to be ready, then subscribe all
function subscribeAfterWebsocket() {
  // set a 5ms timeout
  setTimeout(function() {
    // if the websocket is ready
    if (ws.readyState === 1) {
      // send the subscribe notices
      subscribeAll();
    // try again if not ready
    } else { subscribeAfterWebsocket(); }
  }, 5);
}

// subscribe to events when the websocket is ready
function subscribe(bind_key) {
  // send the subscribe notice
  ws.send(JSON.stringify({ action: 'subscribe', key: bind_key }));
}

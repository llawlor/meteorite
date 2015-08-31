// meteorite namespace
var Meteorite = Meteorite || {};

// initialize websocket
Meteorite.websocket = new WebSocket("ws://" + location.hostname + ":8080/");

console.log('starting meteorite websockets. . .');

// when a new websocket message is received
Meteorite.websocket.onmessage = function(msg) {
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
        Meteorite.add(json, $(this));
      // else update the element
      } else {
        Meteorite.update(json, $(this));
      }
      
    }
  });
}

// add an item
Meteorite.add = function(json, $element) {
  // add to the dom
  $element.append(json.bind_data);
  // listen to subscribe events
  Meteorite.subscribe($(json.bind_data).find('.meteorite').data('bind-key'));  
}

// update a single attribute
Meteorite.update = function(json, $element) {
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

// subscribe to all bind keys of meteorite classes
Meteorite.subscribeAll = function() {
  // for each meteorite class
  $('.meteorite').each(function() {
    // if there is a bind key
    if ($(this).data('bind-key') !== undefined) {
      // subscribe
      Meteorite.subscribe($(this).data('bind-key'));
    }
  });
}

// wait for websocket to be ready, then subscribe all
Meteorite.subscribeAfterWebsocket = function() {
  // set a 5ms timeout
  setTimeout(function() {
    // if the websocket is ready
    if (Meteorite.websocket.readyState === 1) {
      // send the subscribe notices
      Meteorite.subscribeAll();
    // try again if not ready
    } else { Meteorite.subscribeAfterWebsocket(); }
  }, 5);
}

// subscribe to events when the websocket is ready
Meteorite.subscribe = function(bind_key) {
  // send the subscribe notice
  Meteorite.websocket.send(JSON.stringify({ action: 'subscribe', key: bind_key }));
}

// when the document is ready
$(document).on('page:load ready', function() {
  Meteorite.subscribeAfterWebsocket();
});

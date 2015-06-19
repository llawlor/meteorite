// initialize websocket
var ws = new WebSocket("ws://192.168.56.101:8080/");

console.log('starting meteorite websockets. . .');

ws.onmessage = function(msg) {
  // parse the json message
  // todo: handle non-json messages
  var json = JSON.parse(msg.data);
  
  // log the data
  console.log(json);
  
  // for each meteorite class
  $('.meteorite').each(function() {
    // if the bind keys match
    if ($(this).data('bind-key') === json.bind_key) {
      console.log('bind found');
      // get the bind data
      var bind_data = JSON.parse(json.bind_data);
      // desired attribute
      var bind_attr = $(this).data('bind-attr');
      // get the attribute data
      var attr_data = bind_data[bind_attr];

      // update the property
      $(this).prop('checked', attr_data);
      // update the text
      $(this).text(attr_data);
      // notify event handlers that a change has occurred
      $(this).trigger('change');
    }
  });
}

// subscribe to events when the websocket is ready
function subscribe(bind_key) {
  // set a 5ms timeout
  setTimeout(function() {
    // if the websocket is ready
    if (ws.readyState === 1) {
      // send the subscribe notice
      ws.send(JSON.stringify({ action: 'subscribe', key: bind_key }));
    // try again if not ready
    } else { subscribe(); }
  }, 5);
}

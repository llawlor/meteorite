// initialize websocket
var ws = new WebSocket("ws://192.168.56.101:8080/");

console.log('starting meteorite websockets. . .');

ws.onmessage = function(msg) {
  // parse the json message
  // todo: handle non-json messages
  var json = JSON.parse(msg.data);
  
  // for each meteorite class
  $('.meteorite').each(function() {
    // if the bind keys match
    if ($(this).data('bind_key') === json.bind_key) {
      // get the bind data
      var bind_data = JSON.parse(json.bind_data);
      // desired attribute
      var bind_attr = $(this).data('bind_attr');
      // get the attribute data
      var attr_data = JSON.stringify(bind_data[bind_attr]);
      // update the attribute
      $(this).text(attr_data);
    }
  });
}

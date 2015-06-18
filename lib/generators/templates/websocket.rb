require 'em-websocket'
require 'em-hiredis'
require 'json'

$clients = []

EM.run do
  puts "starting websocket server. . ."
  
  redis = EM::Hiredis.connect #("redis://127.0.0.1:6379")
  pubsub = redis.pubsub

  # when a pubsub message is received
  pubsub.on(:message) do |channel, message|
    puts [:message, channel, message]
    # for each client
    $clients.each do |client|
      # send a message
      client.send({bind_key: channel, bind_data: message}.to_json)
    end
  end
    
  EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
    ws.onopen do |handshake|
      puts "WebSocket connection open"
      
      # add the client
      $clients.push(ws)
      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      #ws.send "Hello Client, you connected to #{handshake.path}"
    end

    ws.onclose do
      puts "Connection closed"
      $clients.delete(ws)
    end

    ws.onmessage do |msg|
      puts "Received message: #{msg}"
      #ws.send "Pong: #{msg}"
      
      json = JSON.parse(msg)
      
      if json['action'] == 'subscribe'
        # subscribe
        pubsub.subscribe(json['key'])
        puts "subscribe to: #{json['key']}"
      end
    end
  
  end

end

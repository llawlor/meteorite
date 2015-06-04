require 'em-websocket'
require 'em-hiredis'
require 'json'


        
EM.run {
  puts "starting websocket server. . ."
  
  redis = EM::Hiredis.connect #("redis://127.0.0.1:6379")
  pubsub = redis.pubsub

  EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      # Publish message to the client
      #ws.send "Hello Client, you connected to #{handshake.path}"
    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
      puts "Recieved message: #{msg}"
      #ws.send "Pong: #{msg}"
      
      json = JSON.parse(msg)
      
      if json['action'] == 'subscribe'
      
        # subscribe
        pubsub.subscribe(json['key'])
        puts "subscribe to: #{json['key']}"
        pubsub.on(:message) { |channel, message|
          p [:message, channel, message]
          ws.send({bind_key: channel, bind_data: message}.to_json)
        }
        
      end
    }
  end
}

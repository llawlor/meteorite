require 'rails/generators/base'

module Meteorite
  
  class WebsocketGenerator < ::Rails::Generators::Base
  
    desc "This generator creates a websocket.rb file at daemons/"

    source_root File.expand_path("../../templates", __FILE__)

    def copy_websocket_file
      copy_file "websocket.rb", "daemons/websocket.rb"
    end

  end
  
end

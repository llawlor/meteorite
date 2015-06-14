require 'rails/generators/base'

module Meteorite
  
  class InstallGenerator < ::Rails::Generators::Base
  
    desc "This generator creates a websocket.rb file at daemons/ and an initializer file at config/initializers/meteorite.rb"

    source_root File.expand_path("../../templates", __FILE__)

    def copy_websocket_file
      copy_file "websocket.rb", "daemons/websocket.rb"
    end

    def copy_initializer_file
      copy_file "meteorite.rb", "config/initializers/meteorite.rb"
    end
    
  end
  
end

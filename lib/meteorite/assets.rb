module Meteorite
  # mount the Rails engine so that our JavaScript assets are included
  module Rails
    class Engine < ::Rails::Engine
    end
  end
end

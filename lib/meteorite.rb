require "meteorite/version"

module Meteorite
  # mount the Rails engine so that our JavaScript assets are included
  module Rails
    class Engine < ::Rails::Engine
    end
  end
  
  # get the unique bind key for an instance of an ActiveRecord model
  def self.bind_key(instance)
    "#{instance.class.name}-#{instance.id}"
  end
end

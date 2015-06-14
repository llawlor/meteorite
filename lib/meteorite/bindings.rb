module Meteorite
  # get the unique bind key for an instance of an ActiveRecord model
  def self.bind_key(instance)
    "#{instance.class.name}-#{instance.id}"
  end
end

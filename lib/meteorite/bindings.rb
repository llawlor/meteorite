module Meteorite
  # get the unique bind key for an instance or collection of ActiveRecord models
  def self.bind_key(object)
  
    # if we're dealing with a collection
    if object.class.parent == ActiveRecord
      return "#{object.table_name}"
    # else if we're dealing with an object
    elsif object.class.parent == Object && object.respond_to?('id')
      return "#{object.class.name}-#{object.id}"
    end
    
  end
end

# Meteorite

TODO: Write a gem description

## Installation

Add this line to your application's Gemfile:

    gem 'meteorite'

And then execute:

    $ bundle install

## Usage

Generate websocket server:

    $ rails generate meteorite:websocket
    
The JavaScript file needs to be added to the assets pipeline.  In app/assets/javascripts/application.js, add this line:
    //= require meteorite

In view pages, subscribe to changes (replace MODEL_INSTANCE with an actual instance of your model):
<pre>
  <script>
    ws.onopen = function() {
      // listen to changes
      ws.send(JSON.stringify({ action: 'subscribe', key: '<%= Meteorite.bind_key(@MODEL_INSTANCE.first) %>' }));
    }
  </script>
</pre>

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

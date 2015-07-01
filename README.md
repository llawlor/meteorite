# Meteorite

Meteorite enables you to add two-way data binding to your application with minimal effort.
For an example application, please see https://github.com/llawlor/meteorite-simple-todos .

## Dependencies

You need Redis installed and running for Meteorite to work properly.

Install Redis server (on Ubuntu):

    $ sudo apt-get install redis-server

Run Redis server:

    $ nohup redis-server &

## Installation

Add this line to your application's Gemfile:

    gem 'meteorite'

And then execute:

    $ bundle install

Install required files:

    $ rails generate meteorite:install
    
[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/adb20f19b8bd6034ea6ef81a4618f359e9b93222?diff=unified)
    
The generated JavaScript file needs to be added to the assets pipeline.  In app/assets/javascripts/application.js, add this line:

    //= require meteorite

Run the websocket daemon:

    $ ruby daemons/websocket.rb

## Example Usage in a Task Model

### Create a task:
task_controller#create
```ruby
# create the task
task = Task.create(task_params)
# render the partial to a string
task_string = render_to_string(partial: 'task', locals: { task: task })
# use the $redis.publish method to send your bind_key and task partial
$redis.publish(Meteorite.bind_key(Task.all), task_string)
```

tasks/index.html.erb
```html
<table class="meteorite" data-bind-key="<%= Meteorite.bind_key(@tasks) %>">
  <% @tasks.each do |task| %>
    <%= render partial: 'task', locals: { task: task } %>
  <% end %>
</table>
```

tasks/_task.html.erb
```html
<%= form_for task do |f| %>
  <label>
    <%= f.check_box :checked, class: 'meteorite', data: { bind_key: Meteorite.bind_key(task), bind_attr: 'checked' } %>
    <%= task.text %>
  </label>
<% end %>
```

### Update a task:
tasks_controller#update
```ruby
# use the $redis.publish method to send your bind_key and task as JSON
task = Task.find(params[:id])
$redis.publish(Meteorite.bind_key(task), task.to_json)
```

### Delete a task:
tasks_controller#destroy
```ruby
# use the $redis.publish method to send your bind_key and 'delete' message
task = Task.find(params[:id])
$redis.publish(Meteorite.bind_key(task), 'delete')
```


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

### Items that contributors can help with:
1. Tests
2. Examples

Please discuss major feature changes with me first, to see if changes should be included in this gem or forked as your own.


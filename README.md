## Deprecation Notice
This gem has been deprecated, please use Rails 5 ActionCable: edgeguides.rubyonrails.org/action_cable_overview.html

# Meteorite

Meteorite enables you to add two-way data binding (realtime updates) to your application with minimal effort.
The source code for the demo application is available at https://github.com/llawlor/meteorite-tasks-example .

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
    
[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/adb20f19b8bd6034ea6ef81a4618f359e9b93222)
    
The generated JavaScript file needs to be added to the assets pipeline.  In app/assets/javascripts/application.js, add this line:

    //= require meteorite

[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/c7b82339822a6af62548af96adc0374ebb9fa12f)

Run the websocket daemon:

    $ ruby daemons/websocket.rb

The Redis server location can be configured at config/initializers/meteorite.rb .

## Example Usage in a Task Model

### Create a task:

First, we publish a message to Redis with a key of 'tasks' and a value equal to the task's partial.
Meteorite.bind_key(MODEL_NAME.all) will use the table name as the key to bind messages to.

```ruby
# tasks_controller#create

# create the task
task = Task.create(task_params)
# render the partial to a string
task_string = render_to_string(partial: 'task', locals: { task: task })
# use the $redis.publish method to send your bind_key and task partial
$redis.publish(Meteorite.bind_key(Task.all), task_string)
```

An HTML element with a class of "meteorite" and data attribute for the bind key is used to specify where additional model instances will be added to the DOM.

```html
<!-- tasks/index.html.erb -->

<table class="meteorite" data-bind-key="<%= Meteorite.bind_key(@tasks) %>">
  <% @tasks.each do |task| %>
    <%= render partial: 'task', locals: { task: task } %>
  <% end %>
</table>
```

The partial should have a top-level element with an ID of the model instance's bind key.
Individual HTML attributes can be dynamically updated by adding a "meteorite" class, data-bind-key, and data-bind-attr. 

```html
<!-- tasks/_task.html.erb -->

<tr id="<%= Meteorite.bind_key(task) %>">
  <td>
    <%= form_for task, remote: true, html: { style: 'float: left; margin-right: 5px;' } do |f| %>
      <label>
        <%= f.check_box :checked, class: 'task_check meteorite', data: { bind_key: Meteorite.bind_key(task), bind_attr: 'checked' } %>
        <span class="checkbox_text <%= 'checked' if task.checked?%>"><%= task.text %></span>
      </label>
    <% end %>
    
    <%= link_to raw("&times;"), task, method: 'delete', data: { remote: true }, class: 'pull-right' %>
  </td>
</tr>
<% end %>
```

[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/9440626fdc14af5e84066eef60fabf3e99fcfd93)

### Update a task:

Updates can be performed by publishing the model instance's bind key and the model instance to JSON.

```ruby
# tasks_controller#update

# use the $redis.publish method to send your bind_key and task as JSON
task = Task.find(params[:id])
$redis.publish(Meteorite.bind_key(task), task.to_json)
```

[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/f5a4e21b4b24173c7a4832d954567b616d685b4c)

### Delete a task:

Model instances can be deleted by publishing the model instance's bind key and the 'delete' message.

```ruby
# tasks_controller#destroy

# use the $redis.publish method to send your bind_key and 'delete' message
task = Task.find(params[:id])
$redis.publish(Meteorite.bind_key(task), 'delete')
```

[(view diff)](https://github.com/llawlor/meteorite-tasks-example/commit/abfb76d11b3cb422ee4d37aaf8b9364823a2b0bf)

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


# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'meteorite/version'

Gem::Specification.new do |spec|
  spec.name          = "meteorite"
  spec.version       = Meteorite::VERSION
  spec.authors       = ["llawlor"]
  spec.email         = ["primemod3@gmail.com"]
  spec.description   = %q{Meteorite enables you to add two-way data binding (realtime updates) to your application with minimal effort. }
  spec.summary       = %q{Two-way realtime data binding for Rails}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_runtime_dependency "em-websocket"
  spec.add_runtime_dependency "em-hiredis"
  spec.add_runtime_dependency "redis"
  spec.add_dependency "railties"
end

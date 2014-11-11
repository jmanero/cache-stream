# encoding: utf-8

require 'bundler'
require 'bundler/setup'
require 'thor/scmversion'
require 'json'

##
# Module release tasks
##
class Release < Thor
  include Thor::Actions
  namespace 'npm'

  desc 'release [TYPE [PRERELEASE]]', 'Increment module version, package '\
    'module, and publish to NPM'
  def release(type = nil, prerelease = nil)
    invoke :version, [type, prerelease], options
    invoke :publish, [], options
  end

  desc 'version [TYPE [PRERELEASE]]', 'Increment module version'
  def version(type = nil, prerelease = nil)
    say_status :version, "Bumping #{ type } version"
    run 'git push'
    invoke 'version:bump', type, prerelease, :default => 'patch'
  end

  desc 'package', 'Update package.json with current module version'
  def package(*_)
    invoke 'version:current', [], options

    ## Read package.json template, add version, render package.json
    package_json = JSON.parse(IO.read(File.expand_path('../package.template.json', __FILE__)))
    package_json[:version] = IO.read(File.expand_path('../VERSION', __FILE__))

    IO.write(File.expand_path('../package.json', __FILE__),
             JSON.pretty_generate(package_json))
  end

  desc 'publish', 'Publish module using NPM'
  def publish(*_)
    invoke :package, [], options
    run 'npm publish'
  end
end

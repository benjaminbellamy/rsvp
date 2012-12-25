rsvp
====

Really Simple Varnish Panel
This WebApp allows you to monitor your Varnish server.

Features
--------
* Display real-time varnishstat
* Display real-time varnishlog

Installing rsvp
---------------

You need to know how to create an Apache VHOST. That's about it.
```
<VirtualHost *:81>
  ServerAdmin admin@localhost
	DocumentRoot /var/rsvp/www
	<Directory />
		Options FollowSymLinks
		AllowOverride None
		AuthType Basic
		AuthName "Really Simple Varnish Panel"
		AuthType Basic
		AuthUserFile /var/rsvp/.htpasswd
		Require valid-user
	</Directory>
	<Directory /var/rsvp/www>
		Options Indexes FollowSymLinks MultiViews
		AllowOverride None
		Order allow,deny
		allow from all
	</Directory>

	ScriptAlias /cgi-bin/ /var/rsvp/cgi-bin/
	<Directory "/var/rsvp/cgi-bin">
		AllowOverride None
		Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
		Order allow,deny
		Allow from all
	</Directory>

	ErrorLog /var/log/apache2/rsvp-error.log

	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	CustomLog /var/log/apache2/rsvp-access.log combined

</VirtualHost>
```


License
-------

The Uptime code is free to use and distribute, under the [MIT license](https://raw.github.com/benjaminbellamy/rsvp/master/LICENSE).

Uptime uses third-party libraries:

* [jQuery](http://jquery.com/), licensed under the [MIT License](http://jquery.org/license),
* [TwitterBootstrap](http://twitter.github.com/bootstrap/), licensed under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0),

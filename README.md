rsvp
====

* *“Really Simple Varnish Panel”*
* This WebApp allows you to monitor your Varnish server.
* This app uses cool new stuff such as [jQuery](http://jquery.com/) and [TwitterBootstrap](http://twitter.github.com/bootstrap/) but also very ugly old ones such as [CGI](http://httpd.apache.org/docs/2.2/howto/cgi.html). Why? Because it was the easiest way!
* **Do not use on production server. Use for testing purpose only**

![Really Simple Varnish Panel](http://techwatch.keeward.com/wp-content/uploads/2012/12/DSC03535-580x386.jpg)

Features
--------
* Display real-time **varnishstat** with *HIT/(HIT+MISS)* ratio
* Display real-time **varnishlog**

Installing rsvp
---------------


* Obviously, you need a **Vanish cache server** (version **3**) up and running.
* You need **Apache** running on the same server, different ip port, let's say 81, but anyone will do.
* You need Apache to be able to connect to **varnishadm**, so copy */etc/varnish/secret* to */etc/varnish/secret.www-data* and chown it to *www-data:www-data*.
* I strongly suggest that you protect your server with some **authentification** (.htpasswd with Basic AuthType should be enough).
* **Copy** rsvp directory to */var/*, *www-data* should have **write** access to */var/rsvp/www/logs/* directory.
* You need also to know how to create an Apache **VHOST**. That's about it.

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

The rsvp code is free to use and distribute, under the [MIT license](https://raw.github.com/benjaminbellamy/rsvp/master/LICENSE).

rsvp uses third-party libraries:

* [jQuery](http://jquery.com/), licensed under the [MIT License](http://jquery.org/license),
* [TwitterBootstrap](http://twitter.github.com/bootstrap/), licensed under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0),

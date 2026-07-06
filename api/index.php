<?php
$_ENV['APP_ENV'] = 'production';
$_ENV['APP_DEBUG'] = 'false';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';
$_ENV['SESSION_DRIVER'] = 'cookie';
$_ENV['LOG_CHANNEL'] = 'stderr';
$_ENV['CACHE_DRIVER'] = 'array';
putenv('SESSION_DRIVER=cookie');
putenv('VIEW_COMPILED_PATH=/tmp');

require __DIR__ . '/../public/index.php';

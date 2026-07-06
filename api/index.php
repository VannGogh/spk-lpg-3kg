<?php
$_ENV['APP_ENV'] = 'production';
$_ENV['APP_DEBUG'] = 'true';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';
$_ENV['SESSION_DRIVER'] = 'cookie';
$_ENV['LOG_CHANNEL'] = 'stderr';
$_ENV['CACHE_STORE'] = 'array';
$_ENV['QUEUE_CONNECTION'] = 'sync';

// FORCE OVERRIDE DB USERNAME UNTUK SUPABASE POOLER
$_ENV['DB_USERNAME'] = 'postgres.inartlouzsiknnywvgmh';
putenv('DB_USERNAME=postgres.inartlouzsiknnywvgmh');
$_SERVER['DB_USERNAME'] = 'postgres.inartlouzsiknnywvgmh';

putenv('APP_DEBUG=true');
$_SERVER['APP_DEBUG'] = 'true';

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    echo "<h1>CRITICAL ERROR</h1>";
    $trace = str_replace('IvanPutra@371536', '********', $e->getMessage() . "\n" . $e->getTraceAsString());
    echo "<pre>" . $trace . "</pre>";
}

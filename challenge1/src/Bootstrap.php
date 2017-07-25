<?php declare(strict_types = 1);

require __DIR__ . '/../vendor/autoload.php';

error_reporting(E_ALL);
date_default_timezone_set('UTC');

use NoSQLite\NoSQLite;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Challenge\Controller;


$dbConnection = new NoSQLite('mydb.sqlite');
$request = Request::createFromGlobals();

$setHash = new Route(
    '/messages',
    array('_controller' => Controller::class),
    array(),
    array(),
    '',
    array(),
    array('POST')
);
$getHash = new Route(
    '/messages/{hash}',
    array('_controller' => Controller::class),
    array(),
    array(),
    '',
    array(),
    array('GET')
);
$routes = new RouteCollection();
$routes->add('setHash', $setHash);
$routes->add('getHash', $getHash);
$context = new RequestContext();
$context->fromRequest($request);
$matcher = new UrlMatcher($routes, $context);
try {
    $parameters = $matcher->match($request->getPathInfo());
    $class = new $parameters['_controller']($dbConnection);
    $function = $parameters['_route'];
    $json = file_get_contents("php://input");
    $postRequest = json_decode($json);
    $response = $class->$function($postRequest, $parameters);
} catch (ResourceNotFoundException $e) {
    $response = new Response('Not Found', 404);
} catch (Exception $e) {
    $response = new Response('An error occurred', 500);
}
$response->send();



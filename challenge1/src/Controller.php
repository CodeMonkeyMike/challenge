<?php

namespace Challenge;

use Symfony\Component\HttpFoundation\JsonResponse;

class Controller
{
    public function __construct($dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }

    public function setHash($request, $parameters)
    {
        $store = $this->dbConnection->getStore('sha');
        $message = $request->message;
        $hash = hash('sha256', $message);
        $store->set($hash, $message);
        return new JsonResponse(['message' => $hash], 200);
    }

    public function getHash($request, $parameters)
    {
        $store = $this->dbConnection->getStore('sha');
        $value = $store->get($parameters['hash']);
        if (!$value) {
            return new JsonResponse(['err_msg' => 'message not found'], 404);
        }
        return new JsonResponse(['message' => $value], 200);
    }
}

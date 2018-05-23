<?php

namespace React\Promise\Timer;

use RuntimeException;

class TimeoutException extends RuntimeException
{
    private $timeout;

    public function __construct($timeout, $message = NULL, $code = NULL, $previous = NULL) {
        parent::__construct($message, $code, $previous);

        $this->timeout = $timeout;
    }

    public function getTimeout() {
        return $this->timeout;
    }
}

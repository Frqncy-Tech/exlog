# Express Logging for General use (EXLOG)

Simple logger for logging activity in an Express server.

## General logging

You can call the logger directly for simple logging:

exlog.log("Message text")

## Middleware based logging

Use it directly as an Express middleware

app.use(exlog)
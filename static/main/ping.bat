@echo off

rem ping -n 1 %1 | find "Received = 1"

rem if errorlevel 1 goto NoServer
rem echo %1 is availabe.
rem exit /b 0
rem goto :EOF

rem :NoServer
rem echo %1 is not availabe yet.
rem exit /b 1
rem pause
rem goto :EOF

rem THE ACTUAL CODE IS DOWN HERE
for /f %%i in ('ping -n 1 %1 ^| find /c "(0%% loss)"') do SET MATCHES=%%i
echo %MATCHES%
exit /b %MATCHES%
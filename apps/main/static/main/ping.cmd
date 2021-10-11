:<<"::BATCH"
@echo off
for /f %%i in ('ping -n 1 %1 ^| find /c "(100%% loss)"') do SET MATCHES=%%i
echo %MATCHES%
exit /b %MATCHES%
::BATCH

:; if ping -c 1 $1 > /dev/null 2>&1; then
:; echo success; exit 0;
:; else echo failure; exit 1;
:; fi

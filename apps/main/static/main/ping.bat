@echo off
set ip = %1

ping -n 1 %ip% 
rem | FIND "TTL="

if errorlevel 1 goto NoServer

echo %MyServer% is availabe.
rem Insert commands here, for example 1 or more net use to connect network drives.
goto :EOF

:NoServer
echo %MyServer% is not availabe yet.
pause
goto :EOF
Dim Arg, ip, edfa, voltage
Set Arg = Wscript.Arguments

ip = Arg(0)
edfa = Arg(1)
voltage = Arg(2)

set Shell=CreateObject("WScript.Shell")

Shell.run "cmd /K"
wscript.sleep(1000)
sendkeys ("telnet.exe " &ip& " 23{ENTER}")
wscript.sleep(4000)
sendkeys ("ls_tool edfa_set_phdout " &edfa& " " &voltage& "{ENTER}")
wscript.sleep(100)
sendkeys ("exit{ENTER}")
wscript.sleep(100)
sendkeys ("exit{ENTER}")

function sendkeys (strkeys)
on error resume next
' BACKSPACE {BACKSPACE}, {BS}, or {BKSP} 
' BREAK {BREAK} 
' CAPS LOCK {CAPSLOCK} 
' DEL or DELETE {DELETE} or {DEL} 
' DOWN ARROW {DOWN} 
' END {END} 
' ENTER {ENTER} or ~ 
' ESC {ESC} 
' HELP {HELP} 
' HOME {HOME} 
' INS or INSERT {INSERT} or {INS} 
' LEFT ARROW {LEFT} 
' NUM LOCK {NUMLOCK} 
' PAGE DOWN {PGDN} 
' PAGE UP {PGUP} 
' PRINT SCREEN {PRTSC} 
' RIGHT ARROW {RIGHT} 
' SCROLL LOCK {SCROLLLOCK} 
' TAB {TAB} 
' UP ARROW {UP} 
' F1 {F1} 
  shell.sendkeys(strKeys)
if err.number <> 0 then debug "Failed to sendkeys """ & strkeys &""""
on error goto 0
end function
@echo off

cd /d C:\Users\archi\Desktop\Projects\aipa\aipa

start cmd /k "npm run dev"

timeout /t 5

start chrome http://localhost:3000
#! /bin/bash

echo '
__     __                 __  __      
\ \   / /                |  \/  |     
 \ \_/ /__   __ _  __ _  | \  / | ___ 
  \   / _ \ / _` |/ _` | | |\/| |/ _ \
   | | (_) | (_| | (_| | | |  | |  __/
   |_|\___/ \__, |\__,_| |_|  |_|\___|
             __/ |                    
            |___/                     
Setup File


Cloning Repo
'
command -v git >/dev/null 2>&1 || { echo >&2 "I require git but it's not installed.  Aborting."; exit 1; }

git clone https://github.com/DevBash1/Yoga-Me

cd Yoga-Me

if command -v php -v &> /dev/null
then
        echo '\nRunning Server with php'
        php -S localhost:7000 -t .
elif command -v node -v &> /dev/null
then
        if command -v serve -v &> /dev/null
        then
                echo '\nRunning Server with serve'
                serve
        elif command -v npm -v &> /dev/null
        then
                echo '\nInstalling serve'
                npm i -g serve

                serve
        else
                echo '\nfailed to run local server'
                exit
        fi
else
        echo '\nfailed to run local server'
        exit
fi


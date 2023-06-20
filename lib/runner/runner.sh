npx sortjson && echo -e "" && sleep 1 && clear

npx prettier --write . && echo -e "" && sleep 1 && clear

run_type=("${1}")

options_available="refer below available options for 'npm test' : \n\n1. npm test doctor \n-> to check required setup is done or not on your machine to run appium \n\n2. npm test create \n-> to generate required spec files ( mention spec details in appium-spec-create.txt ) \n\n3. npm test serial \n-> to run the cases serially ( specs will run locally )"

if [[ "${run_type}" == "doctor" ]]; then
    npx appium-doctor
elif [[ "${run_type}" == "create" ]]; then
    ts-node "lib/runner/appium-spec-create.ts"
elif [[ "${run_type}" == "serial" ]]; then
    pkill -9 -f appium
    ts-node "lib/runner/appium-runner-serial.ts"
    bash "lib/runner/bash-serial.sh"
elif [[ "${run_type}" == "help" ]]; then
    echo -e $options_available
else
    echo -e $options_available
fi

exit
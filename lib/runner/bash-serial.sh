serial_cmd=`cat lib/runner/run.txt`

IFS=$'\n'
ADDR=( ${serial_cmd} )

if [ "${#ADDR[@]}" == "0" ]; then
  echo -e "\nNo valid spec found, please check appium-runner.txt !!!"
  exit
fi

for cmd in "${ADDR[@]}";
do

eval $cmd

done

exit
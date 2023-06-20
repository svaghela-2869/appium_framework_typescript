import * as fs from "fs";
import { get_time_stamp, sleep } from "../commom/utils_common";
import * as os from "os";
import * as path from "path";

function run_spec() {
    const sel_runnner = fs.readFileSync(path.resolve(__filename, "../../../appium-runner.txt"), "utf-8");
    const spec_array = sel_runnner.split("\n");
    const spec_array_with_result_folder: string[] = [];
    const spec_array_with_final_cmd: string[] = [];

    console.log("Below spec files / folders will be run serially.\n");

    for (let i = 0; i < spec_array.length; i++) {
        if (spec_array[i].startsWith("##") || !spec_array[i]) {
            continue;
        }

        console.log(spec_array[i]);

        let supportedOs = ["android"];
        if (!supportedOs.includes(spec_array[i].split(" => ")[0])) {
            console.log("\nPlease select serial runs supported platform : " + supportedOs.toString());
            fs.writeFileSync(path.resolve(__dirname, String("./run.txt")), "");
            return;
        }

        let split = "/";
        if (os.type().toLocaleLowerCase().startsWith("win")) {
            split = "\\";
        }

        let name_index = spec_array[i].split(" => ")[2].split(split).length;
        let spec_run_data: string;

        if (spec_array[i].includes("**")) {
            spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[2].split(split)[name_index - 3].split(".")[0];
        } else {
            spec_run_data = spec_array[i] + " => " + get_time_stamp() + " => " + spec_array[i].split(" => ")[2].split(split)[name_index - 1].split(".")[0];
        }

        spec_array_with_result_folder.push(spec_run_data);

        sleep(1.3);
    }

    // console.log(spec_array_with_result_folder);

    console.log("\nTotal spec files / folders found : " + spec_array_with_result_folder.length);

    for (let i = 0; i < spec_array_with_result_folder.length; i++) {
        if (spec_array_with_result_folder[i].split(" => ").length == 5) {
            let baseCommand = "npx mocha --require 'ts-node/register' --platform android --device emulator-5554 --diff true --full-trace true --no-timeouts --reporter mochawesome --reporter-options 'reportDir=results/_serial/TEMP_RESULT_FOLDER_TEMP,reportFilename='appium-report',reportPageTitle='" + spec_array_with_result_folder[i].split(" => ")[3] + "',embeddedScreenshots=true,charts=true,html=true,json=false,overwrite=true,inlineAssets=true,saveAllAttempts=false,code=false,quiet=false,ignoreVideos=true,showPending=true,autoOpen=false' --spec ";

            baseCommand = baseCommand.replace("--platform android", "--platform " + spec_array_with_result_folder[i].split(" => ")[0]);
            baseCommand = baseCommand.replace("--device emulator-5554", "--device " + spec_array_with_result_folder[i].split(" => ")[1]);
            baseCommand = baseCommand + spec_array_with_result_folder[i].split(" => ")[2].replaceAll("\\\\", "/");
            baseCommand = baseCommand.replace("TEMP_RESULT_FOLDER_TEMP", spec_array_with_result_folder[i].split(" => ")[4] + "/" + spec_array_with_result_folder[i].split(" => ")[3]);

            let final_result_folder = "results/_serial/" + spec_array_with_result_folder[i].split(" => ")[4] + "/" + spec_array_with_result_folder[i].split(" => ")[3];
            if (!fs.existsSync(final_result_folder)) {
                fs.mkdirSync(final_result_folder, { recursive: true });
            }

            let final_command_push = String(baseCommand + " > '" + final_result_folder + "/appium-log.txt'").replaceAll("\r", "");

            spec_array_with_final_cmd.push(final_command_push);
        } else {
            console.error("\nPlease check appium-runner.txt for error...");
            return;
        }
    }

    // console.log(spec_array_with_final_cmd);

    for (let i = 0; i < spec_array_with_final_cmd.length; i++) {
        if (i == spec_array_with_final_cmd.length - 1) {
            spec_array_with_final_cmd[i] = spec_array_with_final_cmd[i];
        } else {
            spec_array_with_final_cmd[i] = spec_array_with_final_cmd[i] + "\n";
        }
    }

    // console.log(spec_array_with_final_cmd);

    fs.writeFileSync(path.resolve(__dirname, String("./run.txt")), spec_array_with_final_cmd.toString().replaceAll("\n,", "\n"));

    console.log("\n==================== Appium Report Files ====================\n");

    for (let i = 0; i < spec_array_with_result_folder.length; i++) {
        let report_folder_path = "../../results/_serial/" + spec_array_with_result_folder[i].split(" => ")[4] + "/" + spec_array_with_result_folder[i].split(" => ")[3];
        let log = path.resolve(__dirname, String(report_folder_path + "/appium-log.txt"));
        let report = path.resolve(__dirname, String(report_folder_path + "/appium-report.html"));
        console.log(log);
        console.log(report + "\n");
    }

    console.log("Running specs...");

    return;
}

run_spec();

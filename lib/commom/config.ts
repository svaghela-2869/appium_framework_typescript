import * as reporter from "./reporter";
import * as utils_common from "./utils_common";
import * as fs from "fs";

import { remote } from "webdriverio";
import { main as main_appium_server } from "appium";
import { AppiumServer } from "@appium/types";

export let driver: WebdriverIO.Browser;
export let spec: any = {};
export let device: any = {};
export let env_vars: any = {};

let server: AppiumServer;

export async function launch_server() {
    await reporter.entry_log("launch_server");

    let args = {
        address: "0.0.0.0",
        port: 2869,
    };
    try {
        server = await main_appium_server(args);
        await reporter.pass("Appium server is up.");
    } catch (error) {
        await reporter.fail("Failed to launch appium server.");
    }

    await reporter.exit_log("launch_server");
}

export async function install_app(app_package_id_or_bundle_id: string, app_file_path: string, reset_app: boolean) {
    await reporter.exit_log("install_app");

    spec.app = app_package_id_or_bundle_id;

    let driver_options: any;
    if (String(device.platform).toLowerCase() == "android") {
        const android_capabilities: any = {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:fullReset": reset_app,
            "appium:noReset": !reset_app,
            "appium:deviceName": device.name,
        };
        if (Boolean(reset_app) == true && app_file_path != "app_launch_without_file") {
            android_capabilities["appium:app"] = app_file_path;
        }
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: android_capabilities,
        };
    } else if (String(device.platform).toLowerCase() == "ios") {
        const ios_capabilities: any = {
            platformName: "iOS",
            "appium:automationName": "XCUITest",
            "appium:fullReset": reset_app,
            "appium:noReset": !reset_app,
            "appium:deviceName": device.name,
        };
        if (Boolean(reset_app) == true && app_file_path != "app_launch_without_file") {
            ios_capabilities["appium:app"] = app_file_path;
        }
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: ios_capabilities,
        };
    } else {
        await reporter.fail("Please select valid platform in appium-runner.txt !!!");
        return;
    }

    await reporter.info("Appium Server trying to connect with the device...");
    driver = await remote(driver_options);

    await driver.startRecordingScreen({ videoType: "h264", videoQuality: "high", videoFps: 60, timeLimit: 1800 });

    if (await driver.isLocked()) {
        await reporter.fail("device locked !!!", true);
        return;
    } else {
        await driver.terminateApp(app_package_id_or_bundle_id);
        await reporter.info("Installing app, if not installed...");
        if (await driver.isAppInstalled(app_package_id_or_bundle_id)) {
            await reporter.info("App is already installed.");
            if (Boolean(reset_app) == true) {
                await reporter.info("App reset is enabled, app data will clear before launch...");
            }
        } else {
            if (app_file_path == "app_launch_without_file") {
                await reporter.fail("App is not installed, please give app file path in csv !!!");
                return;
            } else {
                if (fs.existsSync(app_file_path)) {
                    await driver.installApp(app_file_path);
                    await reporter.pass("App installation complete.");
                } else {
                    await reporter.fail("App file not found on given path : " + app_file_path);
                }
            }
        }
    }

    await reporter.exit_log("install_app");
}

export async function quit_driver() {
    await reporter.exit_log("quit_driver");

    await utils_common.sleep(3);
    try {
        await driver.terminateApp(spec.app);

        await utils_common.sleep(3);
        await save_recording();

        await driver.deleteSession();

        server.closeAllConnections();
        await server.close();

        // temporary hard quit appium ( not recommended )
        if (String(device.platform).toLowerCase() == "ios") {
            var cmd = require("node-cmd");
            await cmd.runSync("pkill -9 -f appium");
        }
    } catch (error) {
        await reporter.fail("something went wrong while closing connection !!!");
    }

    await reporter.exit_log("quit_driver");
}

async function save_recording() {
    await reporter.exit_log("save_recording");

    try {
        const file_path = spec.resultFolder + "/recordings/" + spec.name + ".mp4";
        const video_record_data = await driver.stopRecordingScreen();
        fs.writeFileSync(file_path, video_record_data, { encoding: "base64" });
    } catch (error) {
        await reporter.fail("something went wrong while saving video recording !!!");
    }

    await reporter.exit_log("save_recording");
}

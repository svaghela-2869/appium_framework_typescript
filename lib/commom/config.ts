import * as reporter from "./reporter";
import * as utils_common from "./utils_common";
import * as fs from "fs";

import { remote } from "webdriverio";
import { main as main_appium_server } from "appium";
import { AppiumServer } from "@appium/types";

export let driver: WebdriverIO.Browser;
export let spec: any = {};
export let device: any = {};

let server: AppiumServer;

export async function launch_server() {
    await reporter.entry_log("launch_server");

    let args = {
        address: "0.0.0.0",
        port: 2869,
    };
    try {
        server = await main_appium_server(args);
        await reporter.info("Appium server is up.");
    } catch (error) {
        await reporter.fail("Failed to launch appium server.");
    }

    await reporter.exit_log("launch_server");
}

export async function install_app(app_package_id_or_bundle_id: string, app_file_path: string) {
    await reporter.exit_log("install_app");

    spec.app = app_package_id_or_bundle_id;

    let driver_options: any;
    if (String(device.platform).toLowerCase() == "android") {
        const android_capabilities: any = {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:fullReset": false,
            "appium:noReset": true,
            "appium:deviceName": device.name,
        };
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: android_capabilities,
        };
        driver = await remote(driver_options);
    } else if (String(device.platform).toLowerCase() == "ios") {
        const ios_capabilities: any = {
            platformName: "iOS",
            "appium:automationName": "XCUITest",
            "appium:fullReset": false,
            "appium:noReset": true,
            "appium:deviceName": device.name,
        };
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: ios_capabilities,
        };
        driver = await remote(driver_options);
    } else {
        await reporter.fail("Please select valid platform in appium-runner.txt !!!");
        return;
    }

    if (await driver.isLocked()) {
        await reporter.fail("device locked !!!", true);
        return;
    } else {
        await driver.terminateApp(app_package_id_or_bundle_id);
        await reporter.info("Installing app, if not installed...");
        if (await driver.isAppInstalled(app_package_id_or_bundle_id)) {
            await reporter.info("App is already installed.");
        } else {
            if (app_file_path == "app_launch_without_file") {
                await reporter.fail("App is not installed, please give app file path in csv !!!");
                return;
            } else {
                await driver.installApp(app_file_path);
                await reporter.info("App installation complete.");
            }
        }
    }

    await utils_common.sleep(5);
    await driver.startRecordingScreen({ videoType: "h264", videoQuality: "high", videoFps: 60, timeLimit: 1800 });

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

        await server.close();
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

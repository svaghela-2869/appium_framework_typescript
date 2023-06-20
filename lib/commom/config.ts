import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

import { remote } from "webdriverio";
const Appium = require("appium");

export let driver: any;
export let spec: any = {};
export let device: any = {};

let server: any;

export async function launch_server() {
    await reporter.entry_log("launch_server");

    let args = {
        address: "0.0.0.0",
        port: 2869,
    };
    try {
        server = await Appium.main(args);
        await reporter.info("Appium server is up.");
    } catch (error) {
        await reporter.fail("Failed to launch appium server.");
    }

    await reporter.exit_log("launch_server");
}

export async function launch(app: string, launch_activity: string) {
    await reporter.exit_log("launch");

    let driver_options: any;
    if (device.platform == "android") {
        const android_capabilities: any = {
            platformName: "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": device.name,
            "appium:appPackage": app,
            "appium:appActivity": launch_activity,
        };
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: android_capabilities,
        };
        driver = await remote(driver_options);
        await driver.startRecordingScreen();
        await utils_common.sleep(3);
        await reporter.pass("App [ " + app + " ] launched.", true);
    } else if (device.platform == "ios") {
        const ios_capabilities: any = {
            platformName: "iOS",
            "appium:automationName": "XCUITest",
            "appium:deviceName": device.name,
        };
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: ios_capabilities,
        };
        await reporter.fail("IOS not supported yet.");
    } else {
        await reporter.fail("Please select valid platform in appium-runner.txt !!!");
        return;
    }

    await reporter.exit_log("launch");
    return;
}

export async function quit_driver() {
    await reporter.exit_log("quit_driver");

    const waitTill = new Date(new Date().getTime() + 5000);
    while (waitTill > new Date()) {}
    await driver.deleteSession();
    await server.close();

    await reporter.exit_log("quit_driver");
}

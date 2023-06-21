import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

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
        await reporter.info("Server.address : " + JSON.stringify(server.address));
        await reporter.info("Appium server is up.");
    } catch (error) {
        await reporter.fail("Failed to launch appium server.");
    }

    await reporter.exit_log("launch_server");
}

export async function launch(app: string, launch_activity: string) {
    await reporter.exit_log("launch");

    let driver_options: any;
    if (String(device.platform).toLowerCase() == "android") {
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
        await reporter.info("Launching app on android...");
        driver = await remote(driver_options);
        await utils_common.sleep(3);
        await reporter.pass("App [ " + app + " ] launched.", true);
    } else if (String(device.platform).toLowerCase() == "ios") {
        const ios_capabilities: any = {
            platformName: "iOS",
            "appium:automationName": "XCUITest",
            "appium:deviceName": device.name,
            "appium:bundleId": app,
        };
        driver_options = {
            address: "0.0.0.0",
            port: 2869,
            capabilities: ios_capabilities,
        };
        await reporter.info("Launching app on ios...");
        driver = await remote(driver_options);
        await utils_common.sleep(3);
        await reporter.pass("App [ " + app + " ] launched.", true);
    } else {
        await reporter.fail("Please select valid platform in appium-runner.txt !!!");
        return;
    }
    await reporter.exit_log("launch");
}

export async function quit_driver_and_server() {
    await reporter.exit_log("quit_driver");

    const waitTill = new Date(new Date().getTime() + 5000);
    while (waitTill > new Date()) {}
    try {
        await driver.deleteSession();
        await reporter.info("session deleted.");
        // await driver.end();
        await server.close();
        await reporter.info("server closed.");
    } catch (error) {
        await reporter.fail("something went wrong while closing connection !!!");
    }

    await reporter.exit_log("quit_driver");
}

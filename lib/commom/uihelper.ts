import * as globalConfig from "./config";
import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

let driver: WebdriverIO.Browser;

export async function launch_app(app_package_id_or_bundle_id: string, app_file_path?: string) {
    await reporter.entry_log("launch_app");

    await globalConfig.install_app(app_package_id_or_bundle_id, app_file_path || "app_launch_without_file");

    driver = globalConfig.driver;

    await driver.activateApp(app_package_id_or_bundle_id);
    await utils_common.sleep(3);
    await reporter.pass("App : " + app_package_id_or_bundle_id + " launched.", true);

    await reporter.exit_log("launch_app");
}

export async function click_with_xpath(xpath: string) {
    await reporter.entry_log("click_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        await ele.click();
        await utils_common.sleep(1);
        await reporter.pass("Clicked on element with xpath : " + xpath, true);
    } catch (error) {
        await reporter.fail_and_continue("Element not found with xpath : " + xpath, true);
    }

    await reporter.exit_log("click_with_xpath");
}

export async function wait_for_element_to_be_present_on_ui(xpath: string, wait_time_in_seconds: number, fail?: boolean) {
    await reporter.entry_log("wait_for_element_to_be_present_on_ui");

    await reporter.debug(xpath);
    await driver.setTimeouts(0);
    for (let i = 0; i < wait_time_in_seconds; i++) {
        await sleep(1);
        try {
            let ele = await driver.$(xpath);
            if (await ele.isDisplayed()) {
                await reporter.pass("Element with xpath : " + xpath + " found in " + i + " seconds");
                return true;
            }
        } catch (error) {
            await reporter.debug("Got error for findElements, retrying..." + error);
        }
    }

    if (fail) {
        await reporter.fail_and_continue("Element with xpath : " + xpath + " not found in " + wait_time_in_seconds + " seconds", true);
    } else {
        await reporter.warn("Element with xpath : " + xpath + " not found in " + wait_time_in_seconds + " seconds", true);
    }

    await reporter.exit_log("wait_for_element_to_be_present_on_ui");
    return false;
}

export async function sleep(seconds: number, screen_shot: string = "false") {
    await reporter.entry_log("sleep");

    await utils_common.sleep(seconds);
    if (screen_shot == "true") {
        await reporter.pass(seconds + " second sleep done, time to wake up.", true);
    } else {
        await reporter.debug(seconds + " second sleep done, time to wake up.");
    }

    await reporter.exit_log("sleep");
}

export async function click_with_id(id: string) {
    await reporter.entry_log("click_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        await ele.click();
        await utils_common.sleep(1);
        await reporter.pass("Clicked on element using id : " + id, true);
    } catch (error) {
        await reporter.fail_and_continue("Element not found with id : " + id, true);
    }

    await reporter.exit_log("click_with_id");
}

import * as globalConfig from "./config";
import * as reporter from "./reporter";
import * as utils_common from "./utils_common";

let driver: WebdriverIO.Browser;

export async function launch_app(app_package_id_or_bundle_id: string, app_file_path?: string, reset_app?: boolean) {
    await reporter.entry_log("launch_app");

    await globalConfig.install_app(app_package_id_or_bundle_id, app_file_path || "app_launch_without_file", Boolean(reset_app) || false);

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
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await reporter.pass("Clicked on element with xpath : " + xpath, true);
        } else {
            await reporter.fail_and_continue("Element not found with xpath : " + xpath, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("click_with_xpath");
}

export async function click_with_id(id: string) {
    await reporter.entry_log("click_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await reporter.pass("Clicked on element using id : " + id, true);
        } else {
            await reporter.fail_and_continue("Element not found with id : " + id, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("click_with_id");
}

export async function verify_element_on_ui_with_xpath(xpath: string, should_exists: boolean = true) {
    await reporter.entry_log("verify_element_on_ui_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        if ((ele && Boolean(should_exists) == true) || String(should_exists) == "true") {
            await reporter.pass("Element found using xpath : " + xpath, true);
        } else if ((ele && Boolean(should_exists) == false) || String(should_exists) == "false") {
            await reporter.pass("Element not found on ui as expected using xpath : " + xpath, true);
        } else {
            await reporter.fail_and_continue("Element not found or not verified as per requirenment, should exists : " + should_exists, true);
        }
    } catch (error) {
        await reporter.fail("Got error while verify element : " + error);
    }

    await reporter.exit_log("verify_element_on_ui_with_xpath");
}

export async function verify_element_on_ui_with_id(id: string, should_exists: boolean = true) {
    await reporter.entry_log("verify_element_on_ui_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        if ((ele && Boolean(should_exists) == true) || String(should_exists) == "true") {
            await reporter.pass("Element found using id : " + id, true);
        } else if ((ele && Boolean(should_exists) == false) || String(should_exists) == "false") {
            await reporter.pass("Element not found on ui as expected using id : " + id, true);
        } else {
            await reporter.fail_and_continue("Element not found or not verified as per requirenment, should exists : " + should_exists, true);
        }
    } catch (error) {
        await reporter.fail("Got error while verify element : " + error);
    }

    await reporter.exit_log("verify_element_on_ui_with_id");
}

export async function verify_element_enabled_with_xpath(xpath: string, should_be_enabled: boolean = true) {
    await reporter.entry_log("verify_element_enabled_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        if ((ele && (await ele.isEnabled()) && Boolean(should_be_enabled) == true) || String(should_be_enabled) == "true") {
            await reporter.pass("Element found enabled using xpath : " + xpath, true);
        } else if ((ele && !(await ele.isEnabled()) && Boolean(should_be_enabled) == false) || String(should_be_enabled) == "false") {
            await reporter.pass("Element found disabled as expected using xpath : " + xpath, true);
        } else {
            await reporter.fail_and_continue("Element not found or not verified as per requirenment, enabled : " + should_be_enabled, true);
        }
    } catch (error) {
        await reporter.fail("Got error while verify element : " + error);
    }

    await reporter.exit_log("verify_element_enabled_with_xpath");
}

export async function verify_element_enabled_with_id(id: string, should_be_enabled: boolean = true) {
    await reporter.entry_log("verify_element_enabled_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        if ((ele && (await ele.isEnabled()) && Boolean(should_be_enabled) == true) || String(should_be_enabled) == "true") {
            await reporter.pass("Element found enabled using id : " + id, true);
        } else if ((ele && !(await ele.isEnabled()) && Boolean(should_be_enabled) == false) || String(should_be_enabled) == "false") {
            await reporter.pass("Element found disabled as expected using id : " + id, true);
        } else {
            await reporter.fail_and_continue("Element not found or not verified as per requirenment, enabled : " + should_be_enabled, true);
        }
    } catch (error) {
        await reporter.fail("Got error while verify element : " + error);
    }

    await reporter.exit_log("verify_element_enabled_with_id");
}

export async function wait_for_element_to_be_present_on_ui_with_xpath(xpath: string, wait_time_in_seconds: number, fail_test: boolean = false) {
    await reporter.entry_log("wait_for_element_to_be_present_on_ui_with_xpath");

    await reporter.debug(xpath);
    await driver.setTimeouts(0);
    for (let i = 0; i < wait_time_in_seconds; i++) {
        await sleep(1);
        let ele = await driver.$(xpath);
        try {
            if (ele && (await ele.isDisplayed())) {
                await reporter.pass("Element with xpath : " + xpath + " found in " + i + " seconds");
                return true;
            }
        } catch (error) {
            await reporter.debug("Got error for findElements, retrying..." + error);
        }
    }

    if (Boolean(fail_test) == true || String(fail_test) == "true") {
        await reporter.fail("Element with xpath : " + xpath + " not found in " + wait_time_in_seconds + " seconds", true);
    } else {
        await reporter.warn("Element with xpath : " + xpath + " not found in " + wait_time_in_seconds + " seconds", true);
    }

    await reporter.exit_log("wait_for_element_to_be_present_on_ui_with_xpath");
    return false;
}

export async function wait_for_element_to_be_present_on_ui_with_id(id: string, wait_time_in_seconds: number, fail_test: boolean = false) {
    await reporter.entry_log("wait_for_element_to_be_present_on_ui_with_id");

    await reporter.debug(id);
    await driver.setTimeouts(0);
    for (let i = 0; i < wait_time_in_seconds; i++) {
        await sleep(1);
        let ele = await driver.$("~" + id);
        try {
            if (ele && (await ele.isDisplayed())) {
                await reporter.pass("Element with id : " + id + " found in " + i + " seconds");
                return true;
            }
        } catch (error) {
            await reporter.debug("Got error for findElements, retrying..." + error);
        }
    }

    if (Boolean(fail_test) == true || String(fail_test) == "true") {
        await reporter.fail("Element with id : " + id + " not found in " + wait_time_in_seconds + " seconds", true);
    } else {
        await reporter.warn("Element with id : " + id + " not found in " + wait_time_in_seconds + " seconds", true);
    }

    await reporter.exit_log("wait_for_element_to_be_present_on_ui_with_id");
    return false;
}

export async function set_text_with_xpath(xpath: string, value: string) {
    await reporter.entry_log("set_text_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await ele.clearValue();
            await ele.setValue(value);
            await driver.hideKeyboard();
            await utils_common.sleep(1);
            await reporter.pass("Value : " + value + " entered on element with xpath : " + xpath, true);
        } else {
            await reporter.fail_and_continue("Element not found with xpath : " + xpath, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("set_text_with_xpath");
}

export async function set_text_with_id(id: string, value: string) {
    await reporter.entry_log("set_text_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await ele.clearValue();
            await ele.setValue(value);
            await driver.hideKeyboard();
            await utils_common.sleep(1);
            await reporter.pass("Value : " + value + " entered on element with xpath : " + id, true);
        } else {
            await reporter.fail_and_continue("Element not found with xpath : " + id, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("set_text_with_id");
}

export async function clear_text_with_xpath(xpath: string) {
    await reporter.entry_log("clear_text_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await ele.clearValue();
            await driver.hideKeyboard();
            await reporter.pass("Value cleared on element with xpath : " + xpath, true);
        } else {
            await reporter.fail_and_continue("Element not found with xpath : " + xpath, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("clear_text_with_xpath");
}

export async function clear_text_with_id(id: string) {
    await reporter.entry_log("clear_text_with_id");

    await reporter.debug(id);
    let ele = await driver.$("~" + id);
    try {
        if (ele && (await ele.isDisplayed())) {
            await ele.click();
            await utils_common.sleep(1);
            await ele.clearValue();
            await driver.hideKeyboard();
            await reporter.pass("Value cleared on element with id : " + id, true);
        } else {
            await reporter.fail_and_continue("Element not found with id : " + id, true);
        }
    } catch (error) {
        await reporter.fail("Got error while click : " + error);
    }

    await reporter.exit_log("clear_text_with_id");
}

export async function sleep(seconds: number, screen_shot: boolean = false) {
    await reporter.entry_log("sleep");

    await utils_common.sleep(seconds);
    if (screen_shot || String(screen_shot) == "true") {
        await reporter.pass(seconds + " second sleep done, time to wake up.", true);
    } else {
        await reporter.debug(seconds + " second sleep done, time to wake up.");
    }

    await reporter.exit_log("sleep");
}

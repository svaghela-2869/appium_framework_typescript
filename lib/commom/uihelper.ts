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
    await reporter.pass("App [ " + app_package_id_or_bundle_id + " ] launched.", true);

    await reporter.exit_log("launch_app");
}

export async function click_with_xpath(xpath: string) {
    await reporter.entry_log("click_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$("xpath=" + xpath);
    try {
        await ele.click();
        await utils_common.sleep(1);
        await reporter.pass("Clicked on element [ " + xpath + " ]", true);
    } catch (error) {
        await reporter.fail_and_continue("Element not found with xpath, [ " + xpath + " ]", true);
    }

    await reporter.exit_log("click_with_xpath");
}

export async function click_with_id(accessibility_id: string) {
    await reporter.entry_log("click_with_id");

    await reporter.debug(accessibility_id);
    let ele = await driver.$("id=" + accessibility_id);
    try {
        await ele.click();
        await utils_common.sleep(1);
        await reporter.pass("Clicked on element [ " + accessibility_id + " ]", true);
    } catch (error) {
        await reporter.fail_and_continue("Element not found with id, [ " + accessibility_id + " ]", true);
    }

    await reporter.exit_log("click_with_id");
}

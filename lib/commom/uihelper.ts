import * as globalConfig from "./config";
import * as reporter from "./reporter";

let driver: WebdriverIO.Browser;

export async function launch_app(app_package_or_bundle_id: string, android_launch_activity: string) {
    await reporter.entry_log("launch_app");
    await globalConfig.launch(app_package_or_bundle_id, android_launch_activity || "ios");
    driver = globalConfig.driver;
    await reporter.exit_log("launch_app");
}

export async function click_with_xpath(xpath: string) {
    await reporter.entry_log("click_with_xpath");

    await reporter.debug(xpath);
    let ele = await driver.$(xpath);
    try {
        await ele.click();
        await reporter.pass("Clicked on element [ " + xpath + " ]", true);
    } catch (error) {
        await reporter.fail_and_continue("Element not found with xpath, [ " + xpath + " ]", true);
    }

    await reporter.exit_log("click_with_xpath");
}

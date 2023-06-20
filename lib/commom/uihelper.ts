import * as globalConfig from "./config";
import * as reporter from "./reporter";

let driver: any;

export async function launch_app(app: string, launch_activity: string) {
    await reporter.entry_log("launch_app");
    await globalConfig.launch(app, launch_activity);
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

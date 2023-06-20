import { configure, getLogger } from "log4js";
import * as utils_common from "./utils_common";
import * as globalConfig from "./config";
import { writeFileSync } from "fs";
import { assert } from "chai";

const addContext = require("mochawesome/addContext");
export const logger = getLogger();
const dateFormat = require("dateformat");

export let contextMessages: any[] = [];
export let step_status = { abort: false, fail: false, msg: "" };

export function set_logger() {
    configure({
        appenders: {
            out: {
                type: "stdout",
                layout: { type: "pattern", pattern: "[%d{yyyy-MM-dd} %r] [%p] %m" },
            },
        },
        categories: { default: { appenders: ["out"], level: "debug" } },
    });
}

export async function clear_context() {
    contextMessages = [];
    step_status.fail = false;
}

export async function debug(value: string) {
    logger.debug(value);
    return;
}

export async function info(msg: string, screenShot?: boolean) {
    logger.info(msg);
    let contMsg: any = {};

    contMsg.txt = "[" + dateFormat("yyyy-mm-dd HH:MM:ss") + "]" + " [INFO] : " + msg;

    if (screenShot) {
        let imagePath = "/screenshots/" + utils_common.get_time_stamp("yyyymmddHHMMssl") + ".png";
        await take_screenshot(globalConfig.spec.resultFolder + imagePath);
        contMsg.img = "." + imagePath;
    }

    contextMessages.push(contMsg);
    return;
}

export async function pass(msg: string, screenShot?: boolean) {
    logger.info(msg);
    let contMsg: any = {};

    contMsg.txt = "[" + dateFormat("yyyy-mm-dd HH:MM:ss") + "]" + " [PASS] : " + msg;

    if (screenShot) {
        let imagePath = "/screenshots/" + utils_common.get_time_stamp("yyyymmddHHMMssl") + ".png";
        await take_screenshot(globalConfig.spec.resultFolder + imagePath);
        contMsg.img = "." + imagePath;
    }

    contextMessages.push(contMsg);

    return;
}

export async function warn(msg: string, screenShot?: boolean) {
    logger.warn(msg);
    let contMsg: any = {};

    contMsg.txt = "[" + dateFormat("yyyy-mm-dd HH:MM:ss") + "]" + " [WARN] : " + msg;

    if (screenShot) {
        let imagePath = "/screenshots/" + utils_common.get_time_stamp("yyyymmddHHMMssl") + ".png";
        await take_screenshot(globalConfig.spec.resultFolder + imagePath);
        contMsg.img = "." + imagePath;
    }

    contextMessages.push(contMsg);

    return;
}

export async function fail_and_continue(msg: string, screenShot?: boolean) {
    logger.error(msg);
    let contMsg: any = {};

    contMsg.txt = "[" + dateFormat("yyyy-mm-dd HH:MM:ss") + "]" + " [ERROR] : " + msg;
    if (screenShot) {
        let imagePath = "/screenshots/" + utils_common.get_time_stamp("yyyymmddHHMMssl") + ".png";
        await take_screenshot(globalConfig.spec.resultFolder + imagePath);
        contMsg.img = "." + imagePath;
    }

    contextMessages.push(contMsg);

    step_status.fail = true;
    step_status.msg = msg;
}

export async function fail(msg: string, screenShot?: boolean) {
    logger.fatal(msg);
    let contMsg: any = {};

    contMsg.txt = "[" + dateFormat("yyyy-mm-dd HH:MM:ss") + "]" + " [FAIL] : " + msg;
    if (screenShot) {
        let imagePath = "/screenshots/" + utils_common.get_time_stamp("yyyymmddHHMMssl") + ".png";
        await take_screenshot(globalConfig.spec.resultFolder + imagePath);
        contMsg.img = "." + imagePath;
    }

    contextMessages.push(contMsg);

    step_status.abort = true;
    step_status.fail = true;
    step_status.msg = msg;

    assert.fail(msg);
}

export async function add_to_context(testContext: Mocha.Context) {
    contextMessages.forEach((msg) => {
        addContext(testContext, msg.txt);
        if (msg.img) {
            addContext(testContext, msg.img);
        }
    });
}

export async function take_screenshot(imagePath: string) {
    try {
        let image = await globalConfig.driver.takeScreenshot();
        writeFileSync(imagePath, image, "base64");
    } catch (error) {
        logger.error(error);
    }
}

export async function entry_log(function_name: string) {
    logger.trace("-->" + function_name);
}

export async function exit_log(function_name: string) {
    logger.trace("<--" + function_name);
}

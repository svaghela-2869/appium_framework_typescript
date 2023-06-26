import * as uihelper from "../commom/uihelper";
import * as reporter from "../commom/reporter";
import "../commom/extentions";

export async function sound_it_onboarding(data_map: Map<string, string>) {
    await reporter.entry_log("sound_it_onboarding");

    await uihelper.sleep(3);
    await reporter.info("Code Pending...");

    await reporter.exit_log("sound_it_onboarding");
}

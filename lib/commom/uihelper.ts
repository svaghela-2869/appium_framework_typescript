import * as globalConfig from "./config";
import * as reporter from "./reporter";

export async function launch_app(app: string) {
    await reporter.entry_log("launch_app");
    await globalConfig.launch(app);
    await reporter.exit_log("launch_app");
}

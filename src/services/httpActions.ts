import axios, { AxiosError } from "axios";
import { useToast } from "vue-toast-notification";

namespace Actions {
    function displayError(e: AxiosError): void {
        console.error(e);
        useToast().error(e.message);
    }

    export async function DeleteServer(serverID: bigint): Promise<void> {
        console.debug(`Deleting server ID ${serverID}`);

        await axios.post("/api/server/delete", null, {
            params: {
                serverID: String(serverID),
            },
        })
            .catch((e: AxiosError) => {
                displayError(e)
            });
    }

    export async function RenameServer(serverID: bigint): Promise<void> {
        console.debug(`Renaming server ID ${serverID}`);

        await axios
            .post("/api/server/rename", null, {
                params: {
                    serverID: String(serverID),
                    name: "new name",
                },
            })
            .catch((e: AxiosError) => {
                displayError(e)
            });
    }
}

export default Actions
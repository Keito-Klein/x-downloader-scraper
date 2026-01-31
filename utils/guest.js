import axios from "axios";
import { getGuestTokenAuthorization } from "./authorization.js";

export const getGuestToken = async () => {
    try {
        const { data } = await axios(
            "https://api.twitter.com/1.1/guest/activate.json",
            {
                method: "POST",
                headers: {
                    Authorization: await getGuestTokenAuthorization(),
                },
            }
        );
        return data.guest_token;
    } catch(e) {
        return null;
    }
};
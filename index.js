import axios from "axios";
import fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import { getGuestToken } from "./utils/guest.js"
import { getTwitterAuthorization } from "./utils/authorization.js";
import variable from "./params/variable.js";
import feature from "./params/feature.js";
import fieldToggles from "./params/field.js";
 
const api = (id, idResult) => {
    return `https://api.x.com/graphql/${id}/${idResult}`
}

const XD = async (url, config, proxy) => {
    const id = url.match(/\/([\d]+)/);
    const regex = /^(?:(https?:\/\/)?(www\.)?(m\.)?(?:twitter|x)\.com\/\w+)/;

    if (!regex.test(url)) return { status: "error", message: "Invalid URL!" };
    if (!id)
        return {
            status: "error",
            message: "There was an error getting twitter id. Make sure your twitter url is correct!",
        };

    const guest_token = await getGuestToken();
    const csrf_token = config?.cookie ? config.cookie.match(/(?:^|; )ct0=([^;]*)/) : "";

    if (!guest_token)
        return {
            status: "error",
            message: "Failed to get Guest Token. Authorization is invalid!",
        };

    const agent = proxy
        ? proxy.startsWith("socks")
            ? new SocksProxyAgent(proxy)
            : proxy.startsWith("http")
            ? new HttpsProxyAgent(proxy)
            : undefined
        : undefined;

    try {
        const params = {
            variables: JSON.stringify(variable(id[1])),
            features: JSON.stringify(feature),
            fieldToggles: JSON.stringify(fieldToggles),
        };

        const headers = {
            Authorization: config?.authorization || (await getTwitterAuthorization()),
            Cookie: config?.cookie || "",
            "x-guest-token": guest_token,
            "x-csrf-token": csrf_token ? csrf_token[1] : "",
            "User-Agent":
                config?.userAgent ||
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
        };

        const makeRequest = await axios({
            method: "GET",
            url: api("0aTrQMKgj95K791yXeNDRA", "TweetResultByRestId"),
            params,
            headers,
            httpsAgent: agent || undefined,
            proxy: agent ? false : undefined,
            timeout: 15000,
        });

        if(!makeRequest.data.data.tweetResult?.result) {
            return {
                status: "error",
                message: "Tweet not found or unavailable."
            }
        }
        if(makeRequest.data.data.tweetResult.result?.reason === "NsfwLoggedOut") {
            return {
                status: "error",
                message: "This tweet is marked as sensitive. Please login to view this tweet."
            }
        }
        const result = makeRequest.data.data.tweetResult.result;
        const user = result.core.user_results.result
        const media = result.legacy.extended_entities.media?.map((item) => {
            if (item.type === "photo") {
                 return {
                    type: item.type,
                    source: item.expanded_url,
                    url: item.media_url_https,
                }
            }
            if (item.type === "video") {
                return {
                            type: item.type,
                            thumb: item.media_url_https,
                            source: item.expanded_url,
                            variants: item.video_info.variants.map(v => ({
                                bitrate: v.bitrate || null,
                                content_type: v.content_type,
                                url: v.url.split("?")[0]
                            }))
                        }
            }
            if(item.type === "animated_gif") {
                return {
                    type:item.type,
                    quality: item.original_info.height + "x" + item.original_info.width,
                    thum: item.media_url_https,
                    url: item.video_info.variants[0].url.split("?")[0],
                    source: item.expanded_url
                }
            }
        })
        const author = {
            name: user.core.name,
            screen_name: user.core.screen_name,
            verified: user.is_blue_verified,
            bio: user.legacy.description || user.profile_bio.description,
            location: user.location.location,
            member_since: user.core.created_at,
            profile_url: `https://x.com/${user.core.screen_name}`,
            avatar_url: user.legacy.default_profile_image ? "https://i.ibb.co/VWhgKY3/default.jpg" : user.avatar.image_url.replace("_normal", ""),
            banner_url: user.legacy.profile_banner_url || null,
            can_dm: (user.dm_permissions && Object.keys(user.dm_permissions).length)
                ? (user.dm_permissions.can_dm ?? "unknown")
                : "unknown",
            statistics: {
                followers: user.legacy.followers_count,
                following: user.legacy.friends_count,
                favourites: user.legacy.favourites_count,
                listed_count: user.legacy.listed_count,
                media_count: user.legacy.media_count,
            }
        }
        const statistics = {
            favorites: result.legacy.favorite_count,
            bookmarks: result.legacy.bookmark_count,
            quote_count: result.legacy.quote_count,
            reply_count: result.legacy.reply_count,
            retweet_count: result.legacy.retweet_count
        }

        const final_response = {
            status: "success",
            data: {
                author,
                statistics,
                result: {
                    id: result.rest_id,
                    created_at: result.legacy.created_at,
                    description: result.legacy.full_text,
                    language: result.legacy.lang,
                    possibly_nsfw: result.legacy.possibly_sensitive || false,
                    media_count: media ? media.length : null,
                    media: media || null,
                }
            }
        }

        return final_response;
    } catch (err) {
        console.error("Axios error:", err.code, err.message);
        return { status: "error", message: err.message, code: err.code };
    }
};

export default XD;
import {APIGatewayProxyResult, Callback, Context, Handler} from "aws-lambda";
import {HTTPResponse} from "./utils/HTTPResponse";

const handler: Handler = async (event: any, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
    // Request integrity checks
    if (!event) {
        return new HTTPResponse(400, "AWS event is empty. Check your test event.");
    }

    if (event.body) {
        let payload: any = {};

        try {
            payload = JSON.parse(event.body);
        } catch {
            return new HTTPResponse(400, "Body is not a valid JSON.");
        }

        Object.assign(event, { body: payload });
    }

    return new HTTPResponse(200, { ok: `it works` });
};

export { handler };

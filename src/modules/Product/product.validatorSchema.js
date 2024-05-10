import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const likeProductSchema = {
    body: Joi.object({
        onModel: Joi.string().required(),
    }),
    params: Joi.object({
        productId: generalRules.dbId.required(),
    }),
    headers: generalRules.headersRules
    .options({ allowUnknown: true })
}



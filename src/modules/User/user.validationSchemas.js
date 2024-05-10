import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().min(5).max(10).alphanum().required().messages({
      "any.required": "please enter your username",
    }),
    email: Joi.string()
      .email({ tlds: { allow: ["com", "org", "yahoo"] }, minDomainSegments: 1 })
      .required(),
    password: Joi.string().required(),
    cpass: Joi.string().valid(Joi.ref("password")), // ensure that the cpass must be equal to password
    age: Joi.number().min(4),
    gender: Joi.string().valid("female", "male"), // for enum values
  })

    .with("password", "cpass") // ensure that if the password exists so the cpass must exist
    .with("email", "password"), // ensure that if the email exists so the password must exist
};

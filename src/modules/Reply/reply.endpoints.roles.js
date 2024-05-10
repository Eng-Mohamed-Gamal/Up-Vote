import { systemRoles } from "../../utils/systemRoles.js";


export const endPointsRoles = {
    LIKE_REPLY: [systemRoles.USER, systemRoles.ADMIN],
    ADD_REPLY:[systemRoles.USER,systemRoles.ADMIN]
}
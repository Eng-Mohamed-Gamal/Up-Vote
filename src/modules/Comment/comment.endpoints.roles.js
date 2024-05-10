import { systemRoles } from "../../utils/systemRoles.js";


export const endPointsRoles = {
    ADD_COMMENT: [systemRoles.USER, systemRoles.ADMIN],
    LIKE_COMMENT: [systemRoles.USER, systemRoles.ADMIN]
}
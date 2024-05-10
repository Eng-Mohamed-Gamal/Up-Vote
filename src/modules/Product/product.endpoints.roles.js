import { systemRoles } from "../../utils/systemRoles.js";


export const endPointsRoles = {
    GET_ALL_PRODUCTS: [systemRoles.ADMIN],
    ADD_PRODUCT: [systemRoles.ADMIN, systemRoles.USER],

}
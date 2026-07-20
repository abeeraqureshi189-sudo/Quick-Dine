import {Router} from "express";
import {getMe, loginUser, registerUser} from "../controllers/authControllers.js";
import {Protect} from "../middlewares/auth.js";

const authRouter = Router()

authRouter.post("../regiter", registerUser)
authRouter.post("../login", loginUser)
authRouter.get("../me", Protect,getMe)

export default authRouter;
import { Request } from "express";

import { User } from "../entities/user.entity.js";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

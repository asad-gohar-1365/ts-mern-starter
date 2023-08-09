import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const create = async (
	req: Request,
	res: Response
) => {
	const data = await UserService.userSignup(req.body);
	res.status(data.code).send(data.info);
};

export const login = async (
	req: Request,
	res: Response
) => {
	const data = await UserService.userLogin(req.body);
	res.status(data.code).send(data.info);
};

export const getAll = async (
	req: Request,
	res: Response
) => {
	const data = await UserService.getUsers();
	res.status(data.code).send(data.info);
};


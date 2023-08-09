import { isValidObjectId } from "mongoose";
import User from "../models/user.model";
import { IUser, ILogin } from "../ts/interfaces/user.interface";

export const userLogin = async (data: ILogin) => {
	const { email, password } = data;
	const user = await User.findOne({ email });
	if (!user) {
		return {
			code: 404,
			info: {
				status: false,
				message: "User not found",
			},
		};
	}
	const isPasswordMatch = await user!.comparePassword(String(password));
	if (!isPasswordMatch) {
		return {
			code: 404,
			info: { status: false, message: "invalid credentials" },
		};
	}
	const accessToken = user!.generateAccessToken();
	const refreshToken = user!.generateRefreshToken();
	return {
		code: 200,
		info: {
			status: true,
			message: "User found",
			user,
			accessToken,
			refreshToken,
		},
	};
};

export const userSignup = async (data: IUser) => {
	const {
		name,
		email,
		password,
		role,
		constituency,
		picture,
		isVerified,
		cnic,
	} = data;
	const checkEmailUser = await User.findOne({ email });
	const checkCnicUser = await User.findOne({ cnic });
	if (checkCnicUser) {
		return {
			code: 409,
			info: {
				status: false,
				message: "cnic already registered",
			},
		};
	}
	if (!checkEmailUser) {
		const user = await User.create({
			name,
			email,
			password,
			role,
			constituency,
			picture,
			isVerified,
			cnic,
		});
		if (user) {
			const accessToken = user.generateAccessToken();
			const refreshToken = user.generateRefreshToken();
			return {
				code: 200,
				info: {
					status: true,
					user,
					accessToken,
					refreshToken,
					message: "Created new user",
				},
			};
		} else {
			return {
				code: 401,
				info: {
					status: false,
					message: "Failed to create new user",
				},
			};
		}
	} else {
		return {
			code: 409,
			info: {
				status: false,
				message: "Email already in use",
			},
		};
	}
};

export const getUsers = async () => {
	const users = await User.find().lean();
	if (users.length > 0) {
		return {
			code: 200,
			info: {
				status: true,
				data: users,
				message: "Found All Users",
			},
		};
	} else {
		return {
			code: 401,
			info: {
				status: false,
				message: "The requested collection does not exist or is empty.",
			},
		};
	}
};


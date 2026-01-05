import { UserModel } from "../models/user.model";

export const getUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email });
};

export const createUser = async (userData: any) => {
    const user = new UserModel(userData);
    return await user.save();
};
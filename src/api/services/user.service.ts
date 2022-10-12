import argon2 from "argon2";
import { CreateUserInput } from "../schemas/user.schema";
import { db } from "../utils";
import { omit } from "lodash";

//Sign up
export async function createUser(user: CreateUserInput["body"]) {
  const { name, email, password } = user;
  try {
    //hash password before insertion into DB
    const hash = await hashPassword(password);

    //Create new User record
    const user_id = await db("users").insert({
      name,
      email,
      password: hash,
    });
    const user = await db("users").where({ user_id }).first();

    return JSON.stringify(omit(user, "password"));
  } catch (err: any) {
    throw new Error(err);
  }
}

//Verify user password and mail
export async function verifyUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  //find user
  const user = await db("users").where({ email }).first();

  if (!user) {
    return false;
  }

  //compare passwords
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return false;
  }

  return omit(user, "password");
}

export async function findUser(query: object) {
  const user = await db("users").where(query).first();
  return user;
}

export async function hashPassword(password: string) {
  const hash = await argon2.hash(password);
  return hash;
}

async function comparePassword(password: string, hash: string) {
  const isVerified = await argon2.verify(hash, password);
  return isVerified;
}

import { users } from "@clerk/clerk-sdk-node";

export const getUserIds = async (emails: string[]): Promise<string[]> => {
  const userPromises = emails.map(async (email) => {
    const userList = await users.getUserList({ emailAddress: [email] });
    return userList.length > 0 ? userList[0].id : null;
  });

  const userIds = await Promise.all(userPromises);
  return userIds.filter((id) => id !== null) as string[];
};

export default function excludePassword<User, Key extends keyof User>(
  obj: User,
  keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

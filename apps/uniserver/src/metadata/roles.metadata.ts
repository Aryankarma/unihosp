import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export default function Roles(...role: Role[]) {
  return SetMetadata('role', role);
}
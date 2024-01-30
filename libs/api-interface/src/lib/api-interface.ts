import { Appointments, Doctor, Hospital, Patient, User } from '@prisma/client';

export type UserResponse = Omit<User, 'password'>;

export type UserProfileResponse = Patient & {
  allowedHospitals: Hospital[];
  allowedDoctors: Doctor[];
  Appointments: Appointments[];
};

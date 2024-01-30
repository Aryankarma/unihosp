export type CreateHospitalInput = {
    name: string,
    handle?: string,
    location: string,
    ownerId: string
    coordinates: { longitude: number, latitude: number }
}

export type CreateMultipleHospitalInput = CreateHospitalInput[]
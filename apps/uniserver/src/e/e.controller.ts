import { Controller, Get, Param } from '@nestjs/common';
import { HospitalService } from '../hospital/services/hospital.service';
import { PatientService } from '../patient/service/patient.service';
import { DoctorService } from '../doctor/service/doctor.service';


@Controller('e')
export class EController {

    constructor(
        private hospitalService: HospitalService,
        private patientService: PatientService,
        private doctorService: DoctorService
    ) { }


    @Get("/h/:hospitalId")
    getHospitalById(@Param("hospitalId") hospitalId: string) {
        return this.hospitalService.getHospitalById({
            id: hospitalId
        })
    }

    @Get("/p/:patientId")
    async getPatientById(@Param("patientId") patientId: string) {
        return this.patientService.findPatientProfile({ id: patientId })
    }

    @Get("/d/:doctorId")
    getDoctorById(@Param("doctorId") doctorId: string) {
        console.log("DoctorId", doctorId)
        return this.doctorService.getDoctorById({
            id: doctorId
        })
    }
}

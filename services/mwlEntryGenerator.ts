import _ = require("lodash/fp");
import {Utils} from "./Utils";
import {PersonGenerator} from "./PersonGenerator";
import {departments} from "../Confg";
import {IDepartment} from "../interfaces";

export class MwlEntryGenerator {

    public jsonEntry: any;

    public accession: string | null = null;
    public allergies = "";
    public department = "";
    public dateOfBirth: Date | null = null;
    public institution = "";
    public medicalAlerts = "";
    public modality: string | null = null;
    public patientHistoryAdditional = "";
    public patientId: string | null = null;
    public patientIdOther = "";
    public patientName: string | null = null;
    public patientWeight = "0";
    public requestedProcedureId = "6789";
    public referringPhysiciansName = "";
    public sex: string | null = null;
    public scheduledProcedureStepAttendingName: string | null = null;
    public scheduledProcedureStepDate: string | null = null;
    public scheduledProcedureStepTime: string | null = null;
    public scheduledProcedureStepId = "12345";
    public scheduledStationAE = "ZEN_SNAP_MD";
    public scheduledStationName = "ZenSnapMD 4.1";
    public sopInstanceUid: string | null = null;
    public studyDescription = "";
    public studyUid: string | null = null;

    public readonly modalities = ["CT", "MR", "DX", "PET", "US", "XA"];

    constructor(private patientGenerator: PersonGenerator | null = null) {
        if (!patientGenerator) {
            this.patientGenerator = new PersonGenerator();
        }
    }

    public generateJson(): any {
        // const iAm = "";
        const my = this;
        const patient = my.patientGenerator!.generate();
        const attending = my.patientGenerator!.generate("MD");
        const referring = my.patientGenerator!.generate("MD");

        const sopInstanceUid = my.sopInstanceUid || Utils.generateUid();
        const studyUid = my.studyUid || Utils.generateUid();
        const accession = my.accession || Utils.genrateRandomId(8);
        const patientName = my.patientName || patient.name;
        const modality = my.modality || my.modalities[Math.floor(Math.random() * my.modalities.length)];
        const patientId = my.patientId || patient.mrn;
        const dob = my.dateOfBirth || patient.dob;
        const dobStr = Utils.formatDate(dob);
        const sex = my.sex || patient.gender;
        const now = new Date();
        const startDate = my.scheduledProcedureStepDate || Utils.formatDate(now);
        const startTime = my.scheduledProcedureStepTime || Utils.formatTime(now);
        const referringName = my.referringPhysiciansName || referring.name;
        const attendingName = my.scheduledProcedureStepAttendingName || attending.name;

        const activeDepartments = _.filter<IDepartment>(x => x.active)(departments);
        const oneDept: IDepartment = activeDepartments[Math.floor(Math.random() * departments.length)];
        const reason = oneDept.reasons[Math.floor(Math.random() * oneDept.reasons.length)];

        const description = my.studyDescription || reason;
        const theDepartment = my.department || oneDept.department;

        my.jsonEntry = {
            "00080005": {
                "vr": "CS",
                "Value": [
                    "ISO_IR 192"
                ]
            },
            "00080018": {
                "vr": "UI",
                "Value": [
                    sopInstanceUid
                ]
            },
            "00080050": {
                "vr": "SH",
                "Value": [
                    accession
                ]
            },
            "00080060": {
                "vr": "CS",
                "Value": [
                    modality
                ]
            },
            "00080080": {
                "vr": "LO",
                "Value": [
                    my.institution
                ]
            },
            "00080090": {
                "vr": "PN",
                "Value": [
                    {
                        "Alphabetic": referringName
                    }
                ]
            },
            "00081030": {
                "vr": "LO",
                "Value": [description]
            },
            "00081040": {
                "vr": "LO",
                "Value": [
                    theDepartment
                ]
            },
            "00100010": {
                "vr": "PN",
                "Value": [
                    {
                        "Alphabetic": patientName
                    }
                ]
            },
            "00100020": {
                "vr": "LO",
                "Value": [
                    patientId
                ]
            },
            "00100030": {
                "vr": "DA",
                "Value": [
                    dobStr
                ]
            },
            "00100040": {
                "vr": "CS",
                "Value": [
                    sex
                ]
            },
            "00101000": {
                "vr": "LO",
                "Value": [
                    my.patientIdOther,
                ]
            },
            "00101030": {
                "vr": "DS",
                "Value": [
                    my.patientWeight
                ]
            },
            "00102000": {
                "vr": "LO",
                "Value": [
                    my.medicalAlerts
                ]
            },
            "00102110": {
                "vr": "LO",
                "Value": [
                    my.allergies
                ]
            },
            "001021B0": {
                "vr": "LT",
                "Value": my.patientHistoryAdditional
            },
            "0020000D": {
                "vr": "UI",
                "Value": [
                    studyUid
                ]
            },
            // "00321030": {
            //     "vr": "LO",
            //     "Value": null
            // },
            "00321032": {
                "vr": "PN",
                "Value": [
                    {
                        "Alphabetic": referringName
                    }
                ]
            },
            "00321060": {
                "vr": "LO",
                "Value": [
                    description
                ]
            },
            "00321064": {
                "vr": "SQ",
                "Value": [
                    {
                        "00080100": {
                            "vr": "SH",
                            "Value": [
                                "18804247"
                            ]
                        },
                        "00080102": {
                            "vr": "SH",
                            "Value": ""
                        },
                        "00080104": {
                            "vr": "LO",
                            "Value": [
                                description
                            ]
                        }
                    }
                ]
            },
            "00380010": {
                "vr": "LO",
                "Value": [
                    accession
                ]
            },
            "00400009": {
                "vr": "SH",
                "Value": [
                    my.scheduledProcedureStepId
                ]
            },
            "00400100": {
                "vr": "SQ",
                "Value": [
                    {
                        "00080060": {
                            "vr": "CS",
                            "Value": [
                                modality
                            ]
                        },
                        "00400001": {
                            "vr": "AE",
                            "Value": [
                                my.scheduledStationAE
                            ]
                        },
                        "00400002": {
                            "vr": "DA",
                            "Value": [
                                startDate
                            ]
                        },
                        "00400003": {
                            "vr": "TM",
                            "Value": [
                                startTime
                            ]
                        },
                        "00400006": {
                            "vr": "PN",
                            "Value": attendingName
                        },
                        "00400007": {
                            "vr": "LO",
                            "Value": [
                                description
                            ]
                        },
                        "00400008": {
                            "vr": "SQ",
                            "Value": [
                                {
                                    "00080100": {
                                        "vr": "SH",
                                        "Value": [
                                            "18804247"
                                        ]
                                    },
                                    "00080102": {
                                        "vr": "SH",
                                        "Value": null
                                    },
                                    "00080104": {
                                        "vr": "LO",
                                        "Value": [
                                            my.studyDescription
                                        ]
                                    }
                                }
                            ]
                        },
                        "00400009": {
                            "vr": "SH",
                            "Value": [
                                my.scheduledProcedureStepId
                            ]
                        },
                        "00400010": {
                            "vr": "SH",
                            "Value": [
                                my.scheduledStationName
                            ]
                        }
                    }
                ]
            },
            "00401001": {
                "vr": "SH",
                "Value": [
                    my.requestedProcedureId
                ]
            }
        };

        return my.jsonEntry;

    };
}
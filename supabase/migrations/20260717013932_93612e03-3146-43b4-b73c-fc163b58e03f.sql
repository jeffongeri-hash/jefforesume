DELETE FROM public.pav_jobs
WHERE title !~* '(physician\s*assistant|\mPA-?C\M|\mAPP\M|advanced\s*practice\s*(provider|practitioner))'
   OR title ~* '\m(dentist|dental|MSW|social\s*worker|medical\s*assistant|technician|technologist|sonographer|therapist|dietitian|pharmacist|scribe|receptionist|scheduler|clerk|phlebotom|paramedic|EMT|nurse|\mRN\M|LPN|LVN)\M'
   OR (title ~* '\mphysician\M' AND title !~* 'physician\s*assistant');
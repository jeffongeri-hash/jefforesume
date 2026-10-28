export const MECHANICS_PATH = '/msk-anatomy-atlas/movement-injury';
export const INDEX_ONLY = 'Index only — no separate mesh in this reference model';
export type Role = 'Prime mover' | 'Synergist' | 'Antagonist' | 'Stabilizer' | 'Force transmitter' | 'At-risk structure';
export interface AnatomyRole { id: string; name: string; meshes: string[]; nerve: string; relation: string; cue: string; }
export interface Phase { id: string; name: string; action: string; position: string; roles: { anatomy: string; role: Role; note: string }[]; angle: number; secondary?: number; }
export type Rig = 'shoulder' | 'elbow' | 'forearm' | 'wrist' | 'neck' | 'trunk' | 'hip' | 'knee' | 'ankle' | 'squat';
export interface Mechanic { id: string; kind: 'movement' | 'injury'; name: string; region: string; rig: Rig; axis: 'x' | 'y' | 'z'; joints: string; orientation: string; phases: Phase[]; context: string; associated: string; safety?: string; }
const a = (id: string, name: string, meshes: string[], nerve: string, relation: string, cue: string): AnatomyRole => ({id,name,meshes,nerve,relation,cue});
export const ANATOMY: AnatomyRole[] = [
 a('deltoid','Middle deltoid',['Acromial part of deltoid muscle.r'],'Axillary nerve, C5–C6','Acromion to deltoid tuberosity; humeral abduction after initiation.','Humerus.r'),
 a('supra','Supraspinatus',['Supraspinatus muscle.r'],'Suprascapular nerve, C5–C6','Supraspinous fossa to superior greater tubercle; cuff compression and abduction.','Humerus.r'),
 a('infra','Infraspinatus / teres minor',['Infraspinatus muscle.r','Teres minor muscle.r'],'Suprascapular / axillary nerves, C5–C6','Posterior cuff; external rotation and eccentric control of internal rotation.','Scapula.r'),
 a('subscap','Subscapularis',['Subscapularis muscle.r'],'Upper/lower subscapular nerves, C5–C6','Anterior cuff inserts on lesser tubercle; internal rotation and joint compression.','Humerus.r'),
 a('pec','Pectoralis major',['Clavicular head of pectoralis major muscle.r','Sternocostal head of pectoralis major muscle.r'],'Medial/lateral pectoral nerves, C5–T1','Humeral adduction and internal rotation; clavicular head contributes flexion.','Humerus.r'),
 a('lat','Latissimus dorsi',['Latissimus dorsi muscle.r'],'Thoracodorsal nerve, C6–C8','Humeral extension, adduction and internal rotation; links upper limb to trunk.','Humerus.r'),
 a('serratus','Serratus anterior',['Serratus anterior muscle.r'],'Long thoracic nerve, C5–C7','Protraction, upward rotation and posterior tilt of the scapula against thorax.','Scapula.r'),
 a('trap','Upper / lower trapezius',['Descending part of trapezius muscle.r','Ascending part of trapezius muscle.r'],'Accessory nerve; C3–C4 proprioceptive contribution','With serratus, upwardly rotates scapula; middle fibers stabilize/retract.','Scapula.r'),
 a('triceps','Triceps brachii',['Long head of triceps brachii.r','Lateral head of triceps brachii.r','Medial head of triceps brachii.r'],'Radial nerve, C6–C8','Elbow extension; long head also crosses the glenohumeral joint.','Ulna.r'),
 a('biceps','Biceps / brachialis',['Long head of biceps brachii.r','Short head of biceps brachii.r','Brachialis muscle.r'],'Musculocutaneous nerve, C5–C6; radial contribution to brachialis','Brachialis flexes regardless of forearm rotation; biceps also supinates.','Radius.r'),
 a('pronators','Flexor–pronator group',['Pronator quadratus.r','Superficial head of pronator teres.r','Flexor carpi radialis.r'],'Median nerve; anterior interosseous branch to pronator quadratus','Pronation and dynamic medial-elbow support; not every flexor is represented here.','Ulna.r'),
 a('supinator','Supinator',['Supinator.r'],'Deep radial nerve, C6–C7','Rotates radius around ulna; biceps especially contributes with a flexed elbow.','Radius.r'),
 a('wrist-ext','Wrist extensors',['Extensor carpi radialis longus.r','Extensor carpi radialis brevis.r'],'Radial nerve / deep radial branch, C6–C8','Maintain wrist extension against flexor torque during grip.','Radius.r'),
 a('grip','Finger flexors',['Flexor digitorum superficialis.r'],'Median nerve; FDP dual median/ulnar supply','Extrinsic flexor tension creates wrist-flexion torque; extensors counterbalance.','Scaphoid bone.r'),
 a('scm','Sternocleidomastoid',['Sternocleidomastoid muscle.r'],'Accessory nerve; C2–C3 sensory contribution','Unilateral activation rotates head contralaterally, with ipsilateral side flexion.','Axis (C2)'),
 a('splenius','Splenius capitis',['Splenius capitis muscle.r'],'Posterior cervical rami','Ipsilateral head rotation and extension; deep cervical stabilizers coordinate.','Atlas (C1)'),
 a('back','Lumbar multifidus',['Multifidus lumborum muscle.r'],'Posterior spinal rami','Segmental control and extension; erector spinae adds a larger extensor moment.','Vertebra L3'),
 a('iliopsoas','Iliopsoas',['Iliacus muscle.r','Psoas major.r'],'Femoral nerve to iliacus, L2–L3; anterior rami L1–L3 to psoas','Hip flexion; psoas also has lumbar attachments.','Femur.r'),
 a('glute-max','Gluteus maximus',['Gluteus maximus muscle.r'],'Inferior gluteal nerve, L5–S2','Powerful hip extension; eccentric control of hip flexion during descent.','Femur.r'),
 a('glute-med','Gluteus medius / minimus',['Gluteus medius muscle.r','Gluteus minimus muscle.r'],'Superior gluteal nerve, L4–S1','Hip abduction and frontal-plane pelvic stabilization in single-leg stance.','Hip bone.r'),
 a('quads','Quadriceps',['Rectus femoris muscle.r','Vastus medialis muscle.r','Vastus lateralis muscle.r','Vastus intermedius muscle.r'],'Femoral nerve, L2–L4','Knee extension; eccentric control of knee flexion. Rectus femoris also flexes hip.','Patella.r'),
 a('hamstrings','Hamstrings',['Long head of biceps femoris.r','Semitendinosus muscle.r','Semimembranosus muscle.r'],'Tibial division of sciatic nerve, L5–S2','Hip extension and knee flexion; biarticular lengthening with hip flexion plus knee extension.','Femur.r'),
 a('gastroc','Gastrocnemius',['Medial head of gastrocnemius.r','Lateral head of gastrocnemius.r'],'Tibial nerve, S1–S2','Plantarflexion and knee flexion; force depends on both joint positions.','Calcaneus.r'),
 a('soleus','Soleus',['Soleus muscle.r'],'Tibial nerve, S1–S2','Plantarflexion; eccentrically restrains forward tibial progression in stance/squat.','Calcaneus.r'),
 a('ta','Tibialis anterior',['Tibialis anterior muscle.r'],'Deep fibular nerve, L4–L5','Dorsiflexion for toe clearance; eccentric control after heel contact.','Talus.r'),
 a('achilles','Calcaneal (Achilles) tendon',['Calcaneal tendon.r'],'Not a contractile muscle; transmits triceps surae force','Convergent tendon inserts on calcaneal tuberosity; stored/released elastic energy is conceptual.','Calcaneus.r'),
 a('acl','Anterior cruciate ligament',['Anterior cruciate ligament.r'],'Non-motor ligament; articular sensory branches','Limits anterior tibial translation and contributes rotational restraint; load is multifactorial.','Tibia.r'),
 a('pcl','Posterior cruciate ligament',['Posterior cruciate ligament.r'],'Non-motor ligament; articular sensory branches','Restrains posterior tibial translation, notably with flexed knee.','Tibia.r'),
 a('meniscus','Medial meniscus / MCL',['Medial meniscus.r','Superficial part of tibial collateral ligament.r'],'Non-motor connective tissues','Medial meniscus has capsular/deep MCL relationships; valgus/rotation may load medial structures.','Tibia.r'),
 a('all','Anterolateral complex',[],'Non-motor capsuloligamentous relationships','Includes anterolateral capsule and iliotibial tract-related restraint; variable anatomy.','Lateral meniscus.r'),
 a('mpfl','Medial patellofemoral ligament',[],'Non-motor ligament','Medial restraint to lateral patellar translation near extension; not an isolated mesh.','Patella.r'),
 a('labrum','Glenoid labrum / capsule',['Glenoid labrum.r','Articular capsule of glenohumeral joint.r'],'Articular sensory innervation','Anterior-inferior capsulolabral relations are exposed by abduction/external rotation.','Scapula.r'),
 a('axillary','Axillary nerve',['Axillary nerve.r'],'C5–C6','Passes inferior to shoulder joint near surgical neck; deltoid motor and lateral-shoulder sensory territory.','Humerus.r'),
 a('syndesmosis','Distal tibiofibular syndesmosis',['Anterior tibiofibular ligament.r','Posterior tibiofibular ligament.r'],'Non-motor ligament complex','External rotation of talus relative to mortise can load distal tibiofibular restraints.','Talus.r'),
 a('atfl','Anterior talofibular / calcaneofibular ligaments',[],'Non-motor lateral ligaments','ATFL connects fibula to talus; CFL crosses toward calcaneus. Neither has a separate reference mesh.','Talus.r'),
 a('sciatic','Sciatic nerve',['Sciatic nerve.r'],'L4–S3','Posterior to hip/deep gluteal region; proximity matters in substantial posterior hip trauma.','Femur.r'),
];
const r = (anatomy: string, role: Role, note: string) => ({ anatomy,role,note });
const p = (id: string, name: string, action: string, position: string, angle: number, roles: Phase['roles'], secondary = 0): Phase => ({id,name,action,position,angle,roles,secondary});
const m = (id: string,name: string,region: string,rig: Rig,axis: Mechanic['axis'],joints: string,phases: Phase[],context: string,associated: string): Mechanic => ({id,name,region,rig,axis,joints,phases,context,associated,kind:'movement',orientation:'Right-sided reference; illustrative angles are not measured ranges or technique targets.'});
const urgent = 'Red-flag anatomy: neurovascular compromise, deformity, inability to bear weight after substantial trauma, or acute neurologic deficits warrants urgent clinical assessment. This is general educational context, not individual advice.';
const injury = (id: string,name: string,region: string,rig: Rig,axis: Mechanic['axis'],joints: string,phases: Phase[],context: string,associated: string): Mechanic => ({...m(id,name,region,rig,axis,joints,phases,context,associated),kind:'injury',safety:urgent});
export const MECHANICS: Mechanic[] = [
 m('throw','Overhand throw','Shoulder & trunk','shoulder','z','Glenohumeral, scapulothoracic, elbow; thorax and pelvis contribute',[
  p('wind-up','Wind-up','Prepare the kinetic chain; trunk and lower limbs transfer momentum.','Arm near side; pelvis/trunk orientation prepares subsequent motion.',0,[r('trap','Stabilizer','Positions the scapula'),r('glute-med','Stabilizer','Controls pelvis; shown in lower-limb references')]),
  p('cocking','Cocking','Elevate arm with external rotation; scapula upwardly rotates and retracts.','Abduction with external rotation; this single-axis overlay does not reproduce combined rotation.',75,[r('serratus','Stabilizer','Upward rotation and posterior tilt'),r('trap','Synergist','Scapular upward-rotation force couple'),r('infra','Prime mover','External rotation'),r('supra','Stabilizer','Centers humeral head')]),
  p('acceleration','Acceleration','Rapid internal rotation and elbow extension contribute to forward motion.','Trunk turns forward; shoulder transitions through rotation while elbow extends.',45,[r('pec','Prime mover','Internal rotation/adduction'),r('lat','Synergist','Internal rotation contribution'),r('triceps','Prime mover','Elbow extension'),r('serratus','Synergist','Scapular protraction'),r('pronators','Stabilizer','Dynamic medial-elbow support')]),
  p('deceleration','Deceleration / follow-through','Posterior cuff and scapular muscles absorb motion eccentrically.','Arm lowers across body; elbow flexors help slow extension.',10,[r('infra','Antagonist','Eccentric control of internal rotation'),r('biceps','Antagonist','Eccentric elbow-extension braking'),r('trap','Stabilizer','Scapular control'),r('subscap','Stabilizer','Cuff compression throughout')])
 ],'Throwing is a linked whole-body action, not an isolated shoulder movement.','Reference overlay emphasizes phase anatomy; ball release, trunk sequencing and scapular translation are not simulated.'),
 m('abduction','Shoulder abduction & controlled lowering','Shoulder','shoulder','z','Glenohumeral joint and scapulothoracic articulation',[
 p('raise','Raise','Concentric humeral abduction with coordinated scapular upward rotation.','Arm elevates in a simplified frontal plane.',70,[r('deltoid','Prime mover','Concentric abduction'),r('supra','Synergist','Abduction and compression'),r('serratus','Stabilizer','Scapular rotation')]),
 p('lower','Controlled lowering','Abductors control descent eccentrically rather than switch off.','Arm returns toward side under gravity.',0,[r('deltoid','Prime mover','Eccentric descent controller'),r('supra','Stabilizer','Maintains cuff compression'),r('lat','Antagonist','Adductor in opposition to elevation')])
 ],'Scapulohumeral contribution varies across elevation; a fixed 2:1 ratio is not assumed.','Cuff, deltoid and scapular stabilizers cooperate; scapular motion is described rather than quantitatively rigged.'),
 m('external-rotation','Shoulder external rotation at side','Shoulder','shoulder','y','Glenohumeral joint',[
 p('rotate','External rotation','Posterior cuff turns humerus outward.','Arm at side; rotation about long axis.',35,[r('infra','Prime mover','Concentric external rotation'),r('supra','Stabilizer','Joint centering')]),
 p('return','Return','External rotators eccentrically control return.','Humerus returns to reference orientation.',0,[r('infra','Prime mover','Eccentric return'),r('subscap','Antagonist','Internal-rotation opposition')])
 ],'At-side rotation differs from overhead rotation; positions alter capsular and muscular leverage.','Scapular stabilization prevents the entire shoulder girdle from substituting for humeral rotation.'),
 m('elbow','Elbow flexion & extension','Elbow','elbow','x','Humeroulnar and humeroradial joints',[
 p('flex','Flexion','Flexors shorten to flex the elbow.','Forearm approaches arm.',80,[r('biceps','Prime mover','Concentric elbow flexion'),r('triceps','Antagonist','Opposes flexion')]),
 p('extend','Extension','Triceps extends; flexors may eccentrically brake loaded lowering.','Forearm returns toward extension without hyperextension.',0,[r('triceps','Prime mover','Concentric extension'),r('biceps','Antagonist','Eccentric controller when load demands')])
 ],'Muscle role depends on external load and whether the task is lifting or lowering.','Biceps is also a supinator; brachialis remains a flexor across forearm positions.'),
 m('forearm','Forearm pronation / supination','Forearm','forearm','y','Proximal and distal radioulnar joints',[
 p('pronate','Pronation','Radius turns relative to ulna.','Illustrative long-axis rotation; crossing geometry is simplified.',65,[r('pronators','Prime mover','Pronator teres/quadratus turn radius'),r('supinator','Antagonist','Opposes pronation')]),
 p('supinate','Supination','Supinator and biceps rotate forearm back.','Radius returns toward uncrossed orientation.',-25,[r('supinator','Prime mover','Concentric supination'),r('biceps','Synergist','Especially with flexed elbow')])
 ],'The radius moves around the ulna, not two bones rotating as one fused segment.','Overlay rotates the radius alone; interosseous membrane and soft-tissue deformation are not modeled.'),
 m('wrist','Wrist extension / grip support','Wrist & hand','wrist','x','Radiocarpal and midcarpal joints',[
 p('set','Set wrist','Extensors position wrist against finger-flexor torque.','Modest illustrative extension, not a grip-strength target.',25,[r('wrist-ext','Stabilizer','Counterbalances wrist-flexion torque'),r('grip','Prime mover','Finger flexion generates grip')]),
 p('release','Release / return','Reduce grip while controlling wrist return.','Wrist returns toward neutral.',0,[r('wrist-ext','Prime mover','Eccentric return control'),r('grip','Synergist','Task-dependent tension')])
 ],'Wrist extensors support grip without being primary finger flexors.','Finger flexion is described; the hand reference has no articulated tendon or digit rig.'),
 m('neck','Neck rotation','Neck','neck','y','Atlantoaxial and lower cervical joints',[
 p('turn','Turn right','Right splenius and left SCM contribute to right rotation.','Skull rotates relative to cervical reference.',30,[r('splenius','Prime mover','Ipsilateral rotation'),r('scm','Synergist','Contralateral SCM contributes; the displayed right SCM opposes this turn')]),
 p('return','Return to center','Bilateral coordination controls return.','No end-range or loaded neck motion is implied.',0,[r('splenius','Antagonist','Can eccentrically control opposite rotation'),r('scm','Stabilizer','Coordinated head control')])
 ],'The right SCM is not a prime mover for rightward rotation; contralateral contribution is explicitly distinguished.','Upper cervical contribution is not identical to motion at every subaxial segment.'),
 m('trunk','Trunk extension & controlled flexion','Back','trunk','x','Lumbar/thoracic motion segments and hip relations',[
 p('extend','Extension','Posterior extensors contribute extension.','Small en-bloc reference overlay; not individual disc motion.',-15,[r('back','Prime mover','Extension/segmental stabilization')]),
 p('flex','Controlled flexion','Extensors can restrain forward bending eccentrically.','Trunk inclines forward with hip contribution described.',20,[r('back','Prime mover','Eccentric flexion control'),r('glute-max','Stabilizer','Hip contribution to bending')])
 ],'Actual bending is distributed across spine and hips; this is not a spinal load calculation.','No disc pressure, nerve compression or tissue strain is predicted.'),
 m('hip','Hip flexion & extension','Hip','hip','x','Acetabulofemoral joint',[
 p('flex','Flexion','Iliopsoas contributes hip flexion.','Femur moves forward relative to pelvis.',45,[r('iliopsoas','Prime mover','Concentric flexion'),r('quads','Synergist','Rectus femoris component only')]),
 p('extend','Extension','Gluteus maximus and hamstrings contribute extension.','Return through reference position.',-10,[r('glute-max','Prime mover','Concentric extension'),r('hamstrings','Synergist','Biarticular hip extension'),r('iliopsoas','Antagonist','Flexor opposition')])
 ],'Pelvic position changes the apparent hip angle.','Rectus femoris is the hip-flexing quadriceps component; the vasti do not cross the hip.'),
 m('hip-abduction','Hip abduction / pelvic stabilization','Hip','hip','z','Hip joint and frontal-plane pelvic balance',[
 p('abduct','Abduct','Abductors move femur laterally in open chain.','Right femur abducts relative to fixed pelvis.',25,[r('glute-med','Prime mover','Concentric open-chain abduction')]),
 p('stance','Single-leg support concept','Same muscles restrain contralateral pelvic drop in closed chain.','Reference returns to neutral; pelvis remains a reference overlay.',0,[r('glute-med','Stabilizer','Frontal-plane pelvic control'),r('glute-max','Synergist','Proximal control')])
 ],'Open-chain femoral motion and closed-chain pelvic support are distinct tasks.','The animation does not assess gait, weakness or a Trendelenburg sign.'),
 m('knee','Knee flexion & extension','Knee','knee','x','Femorotibial and patellofemoral joints',[
 p('flex','Flexion','Hamstrings actively flex; gastrocnemius may assist.','Tibia flexes relative to femur.',65,[r('hamstrings','Prime mover','Concentric flexion'),r('gastroc','Synergist','Knee-flexion contribution'),r('quads','Antagonist','Eccentric controller during loaded descent')]),
 p('extend','Extension','Quadriceps actively extend; flexors may brake.','Tibia returns toward extension.',0,[r('quads','Prime mover','Concentric extension'),r('hamstrings','Antagonist','Task-dependent eccentric braking')])
 ],'Active knee flexion is not the same as squat descent: quadriceps eccentrically control loaded descent.','Patellar tracking and coupled tibial rotation are not quantitatively modeled.'),
 m('squat','Squat descent / ascent','Hip, knee & ankle','squat','x','Hip, knee and talocrural joints',[
 p('descent','Descent','Hip/knee extensors restrain flexion eccentrically; soleus restrains tibial progression.','Hip and knee flex with ankle dorsiflexion.',45,[r('quads','Prime mover','Eccentric knee-flexion control'),r('glute-max','Prime mover','Eccentric hip-flexion control'),r('soleus','Stabilizer','Eccentric tibial progression control'),r('glute-med','Stabilizer','Frontal-plane hip control'),r('hamstrings','Synergist','Co-contraction; biarticular length changes can offset')],70),
 p('ascent','Ascent','Extensors generate concentric hip/knee extension.','Return toward standing.',0,[r('quads','Prime mover','Concentric knee extension'),r('glute-max','Prime mover','Concentric hip extension'),r('soleus','Synergist','Ankle contribution'),r('gastroc','Synergist','Task-dependent biarticular contribution')])
 ],'This open-chain bone overlay explains joint coordination, not a foot-ground-constrained squat simulation.','Foot contact, balance, body mass, muscle activation and ground reaction forces are not solved.'),
 m('ankle','Ankle dorsiflexion / plantarflexion','Ankle','ankle','x','Talocrural joint',[
 p('dorsi','Dorsiflexion','Dorsiflexors lift foot relative to leg.','Foot rotates upward in sagittal plane.',15,[r('ta','Prime mover','Concentric dorsiflexion'),r('soleus','Antagonist','Can eccentrically control loaded dorsiflexion')]),
 p('plantar','Plantarflexion','Triceps surae transmits force via Achilles.','Foot rotates downward.',-25,[r('soleus','Prime mover','Plantarflexion'),r('gastroc','Synergist','Plantarflexion'),r('achilles','Force transmitter','Conveys muscle force to calcaneus')])
 ],'Talocrural dorsiflexion is distinct from subtalar inversion/eversion.','Reference tendon is not stretched or assigned a measured force.'),
 m('heel-raise','Push-off / heel raise','Ankle & calf','ankle','x','Talocrural joint; forefoot load transfer',[
 p('rise','Rise / push-off','Plantarflexors develop torque transmitted to heel.','Illustrative plantarflexion; no ground-contact solver.',-30,[r('soleus','Prime mover','Concentric plantarflexion'),r('gastroc','Synergist','Concentric contribution'),r('achilles','Force transmitter','Links triceps surae to heel')]),
 p('lower','Controlled lowering','Plantarflexors restrain heel descent eccentrically.','Return toward reference stance.',0,[r('soleus','Prime mover','Eccentric control'),r('gastroc','Synergist','Eccentric control'),r('ta','Antagonist','Dorsiflexion opposition')])
 ],'A heel raise is a closed-chain task; the overlay shows equivalent relative foot/leg angle only.','Elastic recoil and toe-joint extension are concepts, not tissue-force measurements.'),
 m('gait','Gait stance-to-swing overview','Lower limb','hip','x','Hip, knee and ankle across the gait cycle',[
 p('stance','Stance','Hip abductors stabilize pelvis; plantarflexors restrain tibial progression.','Hip approaches extension during late stance.',-10,[r('glute-med','Stabilizer','Single-leg pelvic support'),r('soleus','Stabilizer','Tibial progression control')]),
 p('swing','Swing','Hip flexion and ankle dorsiflexion support limb advancement and toe clearance.','Hip flexes; knee/ankle coordination is described.',30,[r('iliopsoas','Prime mover','Hip flexion'),r('ta','Prime mover','Dorsiflexion for clearance'),r('hamstrings','Antagonist','Late-swing eccentric lengthening control')])
 ],'Stance and swing phases involve different load conditions.','This is not a complete gait model, gait analysis, prognosis or rehabilitation recommendation.'),
 injury('pivot','Non-contact knee pivot / twist','Knee','knee','y','Knee, ACL, medial meniscus/MCL and anterolateral relations',[
 p('plant','Foot planted','A planted-foot turn couples rotational and frontal-plane loading.','Near-extension knee with relative tibial rotation.',0,[r('acl','At-risk structure','Rotational/anterior-translation restraint')]),
 p('twist','Rotation load cue','Rotation with valgus/anterior shear may load several restraints.','Small illustrative tibial rotation, not a rupture threshold.',18,[r('acl','At-risk structure','Load is multifactorial'),r('meniscus','At-risk structure','Medial capsulomeniscal/MCL relationships'),r('all','At-risk structure','Anterolateral rotational restraint')])
 ],'Typical concept: change of direction or landing with a planted foot; no animation can establish an ACL injury.','Associated meniscal, medial and anterolateral anatomy may be involved; sequence does not predict a combined injury.'),
 injury('hyperextension','Knee hyperextension','Knee','knee','x','Knee capsule, cruciates and popliteal neurovascular corridor',[
 p('approach','Approach extension','External load drives knee toward extension.','Reference knee reaches extension.',0,[r('acl','At-risk structure','Cruciate restraint')]),
 p('beyond','Beyond reference extension','Hyperextension can load posterior capsule and cruciates.','Small illustrative reverse flexion; no failure threshold.',-10,[r('acl','At-risk structure','Anterior/rotational restraint'),r('pcl','At-risk structure','Posterior restraint; pattern varies')])
 ],'Substantial hyperextension may involve capsuloligamentous injury without a visible tear in this model.','Popliteal vessels lie behind the knee; major deformity and neurovascular changes merit urgent assessment.'),
 injury('patella','Patellar lateral displacement','Knee','knee','z','Patellofemoral joint and medial restraints',[
 p('aligned','Reference alignment','Patella lies anterior to the distal femur.','Uninjured reference alignment.',0,[r('quads','Force transmitter','Extensor mechanism relation')]),
 p('lateral','Lateral tracking cue','A lateral path cue marks displacement tendency; no torn ligament is created.','Illustrative patellar lateral shift only.',12,[r('mpfl','At-risk structure','Medial restraint near extension'),r('quads','Stabilizer','Extensor mechanism and retinacular relations')])
 ],'Typical concept: twisting with a flexed knee and lateral force vector.','Medial retinaculum/MPFL and patellofemoral cartilage are relevant; pose is not proof of dislocation.'),
 injury('shoulder-dislocation','Shoulder anterior-dislocation mechanism','Shoulder','shoulder','z','Glenohumeral joint, capsule/labrum and axillary nerve',[
 p('position','Abduction / external-rotation context','Position exposes anterior-inferior capsular relations.','Abducted arm; external rotation described, not fully rigged.',65,[r('labrum','At-risk structure','Anterior-inferior capsulolabral relation')]),
 p('load','Anterior load cue','Highlight shows anatomy potentially exposed to traumatic load.','Humeral head stays uninjured; translation is not diagnosed.',80,[r('labrum','At-risk structure','Capsule and labrum'),r('axillary','At-risk structure','Inferior joint/surgical-neck relation')])
 ],'Typical concept: traumatic abduction/external rotation with anterior load.','Greater tubercle, cuff and axillary nerve are associated anatomy; no reduction or procedural instruction.'),
 injury('cuff-load','Rotator cuff load / subacromial relation','Shoulder','shoulder','z','Cuff, greater tubercle and coracoacromial arch',[
 p('elevate','Elevation','Cuff centers humeral head as deltoid elevates.','Simplified humeral abduction.',60,[r('supra','Stabilizer','Joint compression'),r('deltoid','Prime mover','Elevation torque')]),
 p('load','Tendon load orientation','A highlight marks tendon-region anatomy, not a tear or impingement diagnosis.','Elevated reference position.',80,[r('supra','At-risk structure','Cuff tendon relation'),r('infra','Stabilizer','Posterior cuff contribution')])
 ],'Mechanical concept: cuff load and subacromial proximity change with position and scapular motion.','Pain is not explained by a simple pinching animation; tendon biology and space are not simulated.'),
 injury('high-ankle','High ankle external-rotation mechanism','Ankle','ankle','y','Distal tibiofibular mortise and syndesmosis',[
 p('mortise','Reference mortise','Talus sits within distal tibia/fibula.','Reference ankle.',0,[r('syndesmosis','Stabilizer','Distal tibiofibular restraint')]),
 p('rotation','External-rotation cue','Relative external rotation may load syndesmotic restraints.','Small talar/foot rotation; no measured widening.',18,[r('syndesmosis','At-risk structure','Anterior/posterior tibiofibular ligaments')])
 ],'Typical concept: foot externally rotates relative to leg, often with dorsiflexion.','Interosseous membrane, medial ankle and proximal fibula are associated anatomy; no fracture prediction.'),
 injury('inversion','Lateral ankle inversion mechanism','Ankle','ankle','z','Subtalar/lateral ankle and ATFL/CFL relations',[
 p('reference','Reference foot','Reference ligament relations are described.','Neutral foot.',0,[r('atfl','Stabilizer','Lateral restraint relation')]),
 p('invert','Inversion cue','Inversion, particularly with plantarflexion, can load lateral restraints.','Simplified inward tilt; subtalar axis is not precisely rigged.',20,[r('atfl','At-risk structure','ATFL/CFL anatomy remains index-only')])
 ],'Typical concept: foot rolls inward under a lateral loading event.','ATFL and CFL are not separate model meshes; talus-linked cues disclose the relationship, not a ligament tear.'),
 injury('achilles-load','Achilles sudden push-off load','Ankle & calf','ankle','x','Triceps surae, calcaneal tendon and heel',[
 p('preload','Preload','Triceps surae tensions calcaneal tendon.','Dorsiflexion before push-off.',10,[r('soleus','Prime mover','Develops plantarflexor torque'),r('achilles','Force transmitter','Conveys load')]),
 p('push','Sudden push-off cue','Rapid load transition marks tendon at-risk anatomy without rupture deformation.','Illustrative plantarflexion.',-25,[r('gastroc','Synergist','Contributes torque'),r('achilles','At-risk structure','Tendon load concept, not failure measurement')])
 ],'Typical concept: sudden acceleration or forceful push-off with high tendon load.','Reference tendon stays intact; there is no rupture threshold, gap size or return-to-play advice.'),
 injury('hamstring-load','Hamstring high-speed lengthening','Thigh','hip','x','Hip/knee and proximal hamstring origins',[
 p('swing','Late-swing context','Hip flexion plus knee extension lengthens biarticular hamstrings.','Hip flexes; knee-extension component is described.',35,[r('hamstrings','Antagonist','Eccentric braking of limb advancement')]),
 p('lengthen','Lengthening load cue','High-speed eccentric loading marks relevant posterior-thigh anatomy.','Greater illustrative hip flexion; no muscle strain is computed.',55,[r('hamstrings','At-risk structure','Musculotendinous/proximal origin relations')])
 ],'Typical concept: sprint late swing or abrupt lengthening with hip flexed and knee extending.','Proximal ischial origins and sciatic relation matter; no muscle tear is visually fabricated.'),
 injury('dashboard','Posterior hip dashboard-type mechanism','Hip','hip','x','Hip, proximal femur, posterior acetabulum and sciatic relation',[
 p('seated','Flexed-hip context','A flexed hip positions femur for transmitted axial loading.','Illustrative hip flexion.',55,[r('pcl','At-risk structure','Flexed-knee dashboard load also relates to PCL')]),
 p('load','Posterior-load cue','Force transmitted through femur can load posterior hip structures.','Hip remains an intact reference; no dislocation is asserted.',65,[r('sciatic','At-risk structure','Posterior hip nerve relation'),r('glute-max','Stabilizer','Posterior regional anatomy')])
 ],'Non-graphic concept: substantial dashboard-type impact with flexed hip; not a collision or injury prediction.','Posterior acetabulum, femoral head/neck and sciatic nerve are relevant; no operation or reduction plan.')
];
/** The count describes distinct study records, not repeated rendered role rows. */
export const STRUCTURED_ENTRY_COUNT = ANATOMY.length + MECHANICS.length + MECHANICS.reduce((n,m) => n + m.phases.length,0);
export const PLAYBACK_DEFAULT = { playing: false, speed: 1, time: 0 } as const;
export const SPEEDS = [0.5,1,1.5] as const;
export const PHASE_SECONDS = 3;
export function duration(m: Mechanic) { return m.phases.length * PHASE_SECONDS; }
export function phaseAt(m: Mechanic,time: number) { return Math.min(m.phases.length-1,Math.max(0,Math.floor(time/PHASE_SECONDS))); }
export function advance(time: number,dt: number,speed: number,total: number,playing: boolean) { return playing ? (time + Math.max(0,Math.min(dt,0.1))*speed) % total : time; }
export function keyframe(m: Mechanic,time: number) {
 const index=phaseAt(m,time), current=m.phases[index], previous=m.phases[(index+m.phases.length-1)%m.phases.length];
 const t=Math.min(1, Math.max(0,(time-index*PHASE_SECONDS)/PHASE_SECONDS)); const k=t*t*(3-2*t);
 return {index,angle:previous.angle+(current.angle-previous.angle)*k,secondary:(previous.secondary??0)+((current.secondary??0)-(previous.secondary??0))*k};
}
export function phaseHighlights(m: Mechanic,time: number) { return m.phases[phaseAt(m,time)].roles.flatMap(r=>ANATOMY.find(a=>a.id===r.anatomy)?.meshes??[]); }
export function motionAllowed(playing: boolean,reduced: boolean) { return playing && !reduced; }
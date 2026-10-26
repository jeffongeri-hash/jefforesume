export type Layer = "bone" | "muscle" | "ligament";

export interface Structure {
  id: string;
  name: string;
  layer: Layer;
  d: string; // SVG path
  term: string; // anatomical terminology / classification
  detail: string;
  clinical: string;
  label: [number, number]; // label anchor
  stroke?: boolean; // render as a cord/band instead of a filled shape
}

export interface Region {
  id: string;
  name: string;
  view: string;
  structures: Structure[];
}

const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;

export const LAYERS: { id: Layer; label: string }[] = [
  { id: "bone", label: "Bone" },
  { id: "muscle", label: "Muscle" },
  { id: "ligament", label: "Ligament / Tendon" },
];

export const REGIONS: Region[] = [
  {
    id: "shoulder",
    name: "Shoulder",
    view: "Right shoulder, anterior view",
    structures: [
      { id: "scapula", name: "Scapula", layer: "bone", label: [175, 250],
        d: "M150,110 L245,118 L250,175 L205,330 L170,300 L140,190Z",
        term: "Flat bone; costal (subscapular) surface shown, lying behind the glenohumeral joint.",
        detail: "Provides origin for all four rotator cuff muscles and bears the coracoid, acromion and glenoid.",
        clinical: "Scapular dyskinesis alters cuff mechanics; scapular body fractures imply high-energy trauma — look for associated thoracic injury." },
      { id: "clavicle", name: "Clavicle", layer: "bone", label: [110, 72],
        d: "M60,95 C90,78 130,92 170,88 C205,84 235,80 262,92 L260,104 C232,96 205,100 170,102 C128,106 92,96 64,108Z",
        term: "S-shaped long bone; medial end at the sternoclavicular joint, lateral end at the acromioclavicular (AC) joint.",
        detail: "The only bony strut connecting the upper limb to the axial skeleton.",
        clinical: "Most fractures occur in the middle third; check skin tenting and the subclavian vessels / brachial plexus lying beneath." },
      { id: "acromion", name: "Acromion", layer: "bone", label: [300, 78],
        d: "M255,88 C275,78 305,80 318,96 C312,110 290,112 262,108Z",
        term: "Lateral projection of the scapular spine; forms the roof of the subacromial space.",
        detail: "Articulates with the clavicle at the AC joint and gives origin to the middle deltoid.",
        clinical: "Narrowing of the subacromial space is associated with impingement and supraspinatus tendinopathy." },
      { id: "glenoid", name: "Glenoid cavity", layer: "bone", label: [222, 162],
        d: ell(247, 160, 9, 26),
        term: "Shallow, pear-shaped articular fossa on the lateral scapula, deepened by the glenoid labrum.",
        detail: "Its small size relative to the humeral head trades stability for range of motion.",
        clinical: "Anterior-inferior labral (Bankart) lesions accompany anterior dislocation and predict recurrence." },
      { id: "humeral-head", name: "Humeral head", layer: "bone", label: [300, 145],
        d: ell(284, 162, 36, 38) + " M262,195 L306,195 L300,370 L272,370Z",
        term: "Hemispherical articular end of the proximal humerus; greater and lesser tubercles separated by the intertubercular groove.",
        detail: "Articulates with the glenoid to form the glenohumeral joint.",
        clinical: "Anterior dislocation is most common; a posterolateral impaction (Hill-Sachs) lesion may follow. Check axillary nerve sensation over the lateral deltoid." },
      { id: "supraspinatus", name: "Supraspinatus", layer: "muscle", label: [190, 128],
        d: "M150,112 C185,110 225,112 262,128 C266,136 258,140 250,138 C215,132 182,130 152,128Z",
        term: "Rotator cuff muscle; supraspinous fossa → superior facet of the greater tubercle. Suprascapular nerve.",
        detail: "Initiates abduction and compresses the humeral head into the glenoid.",
        clinical: "The most commonly torn cuff tendon; weakness on the empty-can (Jobe) test." },
      { id: "deltoid", name: "Deltoid", layer: "muscle", label: [340, 210],
        d: "M250,96 C300,80 340,105 336,170 C333,215 315,250 300,268 L290,262 C300,220 298,175 280,140 C268,122 255,112 250,96Z",
        term: "Clavicle, acromion and scapular spine → deltoid tuberosity of the humerus. Axillary nerve (C5–C6).",
        detail: "Prime abductor beyond the first ~15°; anterior fibres flex, posterior fibres extend.",
        clinical: "Loss of the rounded deltoid contour suggests dislocation; test 'regimental badge' sensation for axillary nerve injury." },
      { id: "pec-major", name: "Pectoralis major", layer: "muscle", label: [100, 200],
        d: "M62,110 C110,112 170,120 210,160 C240,190 262,210 280,228 L276,244 C230,250 170,262 110,270 C80,240 64,180 62,110Z",
        term: "Clavicular and sternocostal heads → lateral lip of the intertubercular groove. Medial and lateral pectoral nerves.",
        detail: "Adducts and medially rotates the arm; clavicular head assists flexion.",
        clinical: "Rupture (often during bench press) produces axillary-fold asymmetry and ecchymosis over the proximal arm." },
      { id: "rotator-cuff", name: "Rotator cuff", layer: "ligament", label: [330, 120], stroke: true,
        d: "M252,128 C262,110 300,108 318,130 C328,148 326,180 314,196",
        term: "Musculotendinous cuff of supraspinatus, infraspinatus, teres minor and subscapularis (SITS) blending with the joint capsule.",
        detail: "Acts as a dynamic stabiliser, centring the humeral head during elevation.",
        clinical: "Tears rise with age; in patients >40 with traumatic dislocation, assess cuff integrity at follow-up." },
      { id: "biceps-lh", name: "Long head biceps tendon", layer: "ligament", label: [210, 300], stroke: true,
        d: "M248,134 C262,140 280,160 284,196 C286,240 286,300 288,360",
        term: "Arises from the supraglenoid tubercle and labrum; intra-articular, then runs in the intertubercular (bicipital) groove.",
        detail: "Held in the groove by the transverse humeral ligament and the biceps pulley.",
        clinical: "Bicipital groove tenderness suggests tendinopathy; proximal rupture gives a 'Popeye' deformity. Associated with SLAP lesions." },
    ],
  },
  {
    id: "knee",
    name: "Knee",
    view: "Right knee, anterior view (lateral side on viewer's left)",
    structures: [
      { id: "femur", name: "Distal femur", layer: "bone", label: [205, 60],
        d: "M170,20 L230,20 L234,150 C270,160 282,190 270,212 C255,224 228,214 210,206 C192,214 165,224 150,212 C138,190 150,160 166,150Z",
        term: "Medial and lateral femoral condyles separated by the intercondylar notch; patellar (trochlear) groove anteriorly.",
        detail: "The medial condyle is larger and extends further distally.",
        clinical: "Supracondylar fractures risk popliteal artery injury — check distal pulses and ABI." },
      { id: "patella", name: "Patella", layer: "bone", label: [255, 150],
        d: ell(205, 160, 26, 32),
        term: "Largest sesamoid bone, embedded in the quadriceps mechanism.",
        detail: "Increases the extensor moment arm; articulates with the femoral trochlea.",
        clinical: "Lateral dislocation is common in young athletes (MPFL tear). Inability to straight-leg raise suggests extensor mechanism disruption." },
      { id: "tibia", name: "Tibia", layer: "bone", label: [250, 300],
        d: "M146,228 C170,220 250,220 274,228 L268,256 C250,262 240,268 236,290 L232,390 L190,390 L186,290 C182,268 170,262 152,256Z",
        term: "Tibial plateau (medial and lateral condyles), intercondylar eminence and tibial tuberosity.",
        detail: "Main weight-bearing bone of the leg.",
        clinical: "Lateral plateau fractures follow valgus load (bumper injury); watch for compartment syndrome." },
      { id: "fibula", name: "Fibular head", layer: "bone", label: [110, 280],
        d: ell(140, 270, 13, 15) + " M133,282 L147,282 L152,390 L138,390Z",
        term: "Proximal fibula, posterolateral and below the tibial plateau; not part of the knee joint proper.",
        detail: "Attachment of the LCL and biceps femoris tendon.",
        clinical: "The common fibular (peroneal) nerve wraps the fibular neck — check dorsiflexion and first web-space sensation." },
      { id: "quad", name: "Quadriceps / quadriceps tendon", layer: "muscle", label: [130, 70],
        d: "M168,24 C150,60 160,110 182,130 L228,130 C250,110 258,60 232,24Z",
        term: "Rectus femoris and vasti converge into the quadriceps tendon, inserting on the superior pole of the patella. Femoral nerve.",
        detail: "Extends the knee; rectus femoris also flexes the hip.",
        clinical: "Quadriceps tendon rupture (often >40 y) gives a suprapatellar gap and loss of active extension." },
      { id: "patellar-lig", name: "Patellar ligament", layer: "ligament", label: [255, 215],
        d: "M193,190 L217,190 L222,258 L188,258Z",
        term: "Continuation of the quadriceps tendon from the inferior pole of the patella to the tibial tuberosity.",
        detail: "Often called the patellar tendon; transmits extensor force to the tibia.",
        clinical: "Rupture yields patella alta; tenderness at the inferior pole suggests jumper's knee." },
      { id: "acl", name: "Anterior cruciate ligament (ACL)", layer: "ligament", label: [300, 186], stroke: true,
        d: "M190,176 L222,226",
        term: "Intracapsular, extrasynovial: posteromedial lateral femoral condyle → anterior intercondylar tibia.",
        detail: "Resists anterior tibial translation and rotational instability.",
        clinical: "Non-contact pivot with a 'pop' and rapid haemarthrosis; Lachman is the most sensitive exam." },
      { id: "pcl", name: "Posterior cruciate ligament (PCL)", layer: "ligament", label: [300, 210], stroke: true,
        d: "M226,178 L196,228",
        term: "Lateral surface of medial femoral condyle → posterior intercondylar tibia.",
        detail: "Primary restraint to posterior tibial translation; stronger than the ACL.",
        clinical: "Dashboard injury; posterior sag and posterior drawer tests. Consider knee dislocation if multiple ligaments fail." },
      { id: "mcl", name: "Medial collateral ligament (MCL)", layer: "ligament", label: [300, 250], stroke: true,
        d: "M268,176 C276,206 274,236 262,276",
        term: "Broad band from the medial femoral epicondyle to the medial tibia; deep fibres attach to the medial meniscus.",
        detail: "Resists valgus stress.",
        clinical: "Most commonly injured knee ligament; test valgus stress at 30° flexion." },
      { id: "lcl", name: "Lateral collateral ligament (LCL)", layer: "ligament", label: [100, 190], stroke: true,
        d: "M150,176 C142,206 138,236 140,258",
        term: "Cord-like, extracapsular: lateral femoral epicondyle → fibular head.",
        detail: "Resists varus stress; separate from the lateral meniscus.",
        clinical: "Varus stress at 30°; injury often accompanies posterolateral corner injury." },
    ],
  },
  {
    id: "lumbar",
    name: "Lumbar Spine",
    view: "Lumbar spine and sacrum, left lateral view (anterior on viewer's left)",
    structures: [
      ...[0, 1, 2, 3, 4].map((i): Structure => {
        const y = 30 + i * 60;
        return {
          id: `l${i + 1}`, name: `L${i + 1} vertebra`, layer: "bone", label: [92, y + 22],
          d: `M${130 + i * 2},${y} L${200 + i * 2},${y} L${202 + i * 2},${y + 42} L${128 + i * 2},${y + 42}Z M${202 + i * 2},${y + 10} L${240 + i * 2},${y + 6} L${282 + i * 2},${y + 18} L${284 + i * 2},${y + 32} L${244 + i * 2},${y + 34} L${202 + i * 2},${y + 30}Z`,
          term: `Lumbar vertebra ${i + 1}: body, pedicles, laminae, transverse and spinous processes${i === 4 ? "; wedge-shaped body" : ""}.`,
          detail: i === 4 ? "The largest lumbar vertebra; its body is taller anteriorly, contributing to lordosis." : "Large kidney-shaped bodies carry axial load; the lumbar canal holds the conus (≈L1–L2) and cauda equina.",
          clinical: i === 4 ? "L5 spondylolysis (pars defect) may lead to L5–S1 spondylolisthesis." : i === 0 ? "The thoracolumbar junction (T12–L1) is the most common site of burst fractures." : "Compression fractures in older adults — assess for osteoporosis and red flags of malignancy.",
        };
      }),
      { id: "sacrum", name: "Sacrum", layer: "bone", label: [110, 370],
        d: "M140,336 L214,334 C222,360 222,385 205,398 L175,398 C160,380 146,360 140,336Z",
        term: "Five fused sacral vertebrae; the sacral promontory projects anteriorly at S1.",
        detail: "Transmits load to the pelvis through the sacroiliac joints.",
        clinical: "Sacral insufficiency fractures cause low back/buttock pain in osteoporotic patients." },
      { id: "lumbosacral", name: "Lumbosacral junction (L5–S1)", layer: "bone", label: [310, 336],
        d: ell(178, 330, 52, 14),
        term: "Articulation of L5 with S1; transition from mobile lordotic spine to the fixed sacrum.",
        detail: "Subject to high shear forces due to the sacral slope.",
        clinical: "L5–S1 and L4–L5 are the most common levels for disc herniation; an L5–S1 herniation typically compresses the S1 root." },
      ...[0, 1, 2, 3, 4].map((i): Structure => ({
        id: `disc${i}`, name: i === 2 ? "Intervertebral disc" : `Disc ${i === 4 ? "L5–S1" : `L${i + 1}–L${i + 2}`}`,
        layer: "bone", label: [92, 80 + i * 60],
        d: `M${130 + i * 2},${74 + i * 60} L${202 + i * 2},${74 + i * 60} L${204 + i * 2},${88 + i * 60} L${132 + i * 2},${88 + i * 60}Z`,
        term: "Fibrocartilaginous joint: outer annulus fibrosus around a gelatinous nucleus pulposus.",
        detail: "Absorbs axial load and permits motion; avascular in adults.",
        clinical: "Posterolateral herniation compresses the traversing root (e.g. L4–L5 → L5). Saddle anaesthesia or retention = cauda equina emergency.",
      })),
      { id: "facets", name: "Facet (zygapophyseal) joints", layer: "bone", label: [320, 120],
        d: [0, 1, 2, 3].map((i) => ell(236 + i * 2, 66 + i * 60, 9, 11)).join(" "),
        term: "Synovial joints between inferior and superior articular processes; sagittally oriented in the lumbar spine.",
        detail: "Limit rotation and share axial load, especially in extension.",
        clinical: "Facet arthropathy causes axial pain worse with extension; hypertrophy contributes to lateral recess stenosis." },
      { id: "all", name: "Anterior longitudinal ligament", layer: "ligament", label: [60, 200], stroke: true,
        d: "M126,24 L124,330 L138,340",
        term: "Broad band on the anterior surfaces of vertebral bodies and discs.",
        detail: "Limits extension; strongest spinal ligament.",
        clinical: "Ossification (DISH) creates flowing anterior osteophytes; disruption implies an extension-type injury." },
      { id: "pll", name: "Posterior longitudinal ligament", layer: "ligament", label: [150, 16], stroke: true,
        d: "M205,24 L210,330",
        term: "Runs on the posterior vertebral bodies within the canal; narrows in the lumbar region.",
        detail: "Limits flexion; reinforces the disc centrally.",
        clinical: "Its lumbar narrowing helps explain why herniations tend to go posterolateral." },
      { id: "erector", name: "Erector spinae", layer: "muscle", label: [345, 200],
        d: "M292,20 C318,60 324,200 312,330 L288,340 C296,220 294,100 286,20Z",
        term: "Iliocostalis, longissimus and spinalis; dorsal rami innervation.",
        detail: "Extends and laterally flexes the trunk; controls flexion eccentrically.",
        clinical: "Paraspinal spasm is common in mechanical back pain; tenderness alone does not localise pathology." },
      { id: "multifidus", name: "Multifidus", layer: "muscle", label: [345, 290],
        d: "M262,40 C276,120 282,240 278,330 L262,334 C264,240 262,120 252,40Z",
        term: "Deep transversospinalis muscle spanning 2–4 segments; most developed in the lumbar spine.",
        detail: "Segmental stabiliser of the lumbar spine.",
        clinical: "Atrophy/fatty infiltration is associated with chronic low back pain; a focus of rehabilitation." },
    ],
  },
];

export const ROADMAP = [
  "Neuro", "Cardiopulmonary", "GI / GU", "Endocrine", "Hematology / Immunology", "Skin",
];

/**
 * Reconciles exact mesh names from the Z-Anatomy / BodyParts3D GLB files
 * to the atlas study entries (region id + structure id).
 */
type Rule = [RegExp, string];

const RULES: Record<string, Rule[]> = {
  shoulder: [
    [/^clavicle$/, "clavicle"], [/^scapula$/, "scapula"], [/^humerus$/, "humerus"],
    [/glenoid labrum/, "labrum"], [/articular capsule of glenohumeral/, "capsule"],
    [/glenohumeral ligament|coracohumeral/, "gh-ligs"],
    [/^acromioclavicular ligament/, "ac-lig"], [/acromioclavicular joint/, "ac-joint"],
    [/trapezoid ligament|conoid ligament|coracoclavicular/, "cc-lig"],
    [/coraco-?acromial/, "ca-lig"], [/sternoclavicular/, "sc-joint"],
    [/subacromial bursa|subdeltoid bursa/, "subacromial-bursa"],
    [/deltoid muscle/, "deltoid"], [/trapezius/, "trapezius"],
    [/pectoralis major/, "pec-major"], [/pectoralis minor/, "pec-minor"],
    [/latissimus/, "latissimus"], [/^supraspinatus/, "supraspinatus"], [/^infraspinatus/, "infraspinatus"],
    [/^teres minor/, "teres-minor"], [/^teres major/, "teres-major"], [/^subscapularis/, "subscapularis"],
    [/biceps brachii/, "biceps-lh"], [/triceps brachii/, "triceps-lh"],
    [/serratus anterior/, "serratus"], [/^coracobrachialis/, "coracobrachialis"],
    [/axillary nerve/, "axillary-n"], [/^suprascapular nerve/, "suprascapular-n"],
    [/musculocutaneous nerve/, "musculocutaneous-n"],
    [/posterior circumflex humeral artery/, "pcha"],
    [/^axillary artery|^brachial artery/, "axillary-a"], [/^axillary vein/, "axillary-v"],
  ],
  knee: [
    [/(prepatellar|infrapatellar|suprapatellar|semimembranosus|gastrocnemius muscle).*|.*bursa of (biceps femoris|gastrocnemius)/, "bursae"],
    [/^femur$/, "femur"], [/^patella$/, "patella"], [/^tibia$/, "tibia"], [/^fibula$/, "fibular-head"],
    [/^medial meniscus/, "med-meniscus"], [/^lateral meniscus/, "lat-meniscus"],
    [/anterior cruciate/, "acl"], [/posterior cruciate/, "pcl"],
    [/tibial collateral/, "mcl"], [/^fibular collateral/, "lcl"],
    [/medial patellofemoral/, "mpfl"], [/quadriceps tendon/, "quad-tendon"], [/patellar ligament/, "patellar-tendon"],
    [/iliotibial/, "itb"], [/popliteofibular|arcuate popliteal/, "plc"], [/oblique popliteal/, "opl"],
    [/rectus femoris/, "rectus-fem"], [/vastus lateralis/, "vastus-lat"], [/vastus medialis/, "vmo"],
    [/vastus intermedius/, "vastus-int"], [/^sartorius/, "sartorius"], [/biceps femoris/, "biceps-fem"],
    [/^semitendinosus/, "semitendinosus"], [/^semimembranosus muscle/, "semimembranosus"],
    [/^popliteus/, "popliteus"], [/medial head of gastrocnemius/, "gastroc-med"], [/lateral head of gastrocnemius/, "gastroc-lat"],
    [/^popliteal artery/, "pop-a"], [/^popliteal vein/, "pop-v"],
    [/^tibial nerve/, "tibial-n"], [/^common fibular nerve/, "cfn"], [/saphenous nerve/, "saphenous-n"],
  ],
  lumbar: [
    [/thoracolumbar fascia/, "tlf"],
    [/^vertebra l[1-5]$/, "body"], [/^nucleus pulposus (t12-l1|l)/, "nucleus"],
    [/^intervertebral disc (t12-l1|l)/, "disc"], [/^sacrum$/, "sacrum"],
    [/sacro-?iliac/, "si-joint"], [/^hip bone$/, "ilium"],
    [/anterior longitudinal ligament/, "all"], [/posterior longitudinal ligament/, "pll"],
    [/flav/, "flavum"], [/^interspinous ligament/, "interspinous"], [/^supraspinous ligament/, "supraspinous"],
    [/zygapophys/, "facet-capsule"],
    [/iliocostalis lumborum|longissimus thoracis|iliocostalis thoracis|spinalis thoracis/, "erector"],
    [/multifidus lumborum/, "multifidus"], [/quadratus lumborum/, "ql"], [/^psoas major/, "psoas"],
    [/cauda equina/, "cauda"], [/^spinal ganglion/, "drg"],
    [/^(anterior|posterior) root of spinal nerve|lumbar nerve|sacral nerve/, "roots"],
    [/abdominal aorta|common iliac artery/, "aorta"], [/inferior vena cava \(abdominal|common iliac vein/, "ivc"],
    [/^spinal dura/, "canal"],
  ],
};

export const baseName = (name: string) => name.replace(/\.(l|r)$/i, "").trim();
export const sideOf = (name: string) => (/\.r$/i.test(name) ? "Right" : /\.l$/i.test(name) ? "Left" : "Midline");

export function matchMesh(name: string, prefer?: string): { regionId: string; id: string } | null {
  const n = baseName(name).toLowerCase();
  if (/fascia/.test(n) && !/thoracolumbar/.test(n)) return null;
  const order = prefer && RULES[prefer] ? [prefer, ...Object.keys(RULES).filter((r) => r !== prefer)] : Object.keys(RULES);
  for (const r of order) for (const [re, id] of RULES[r]) if (re.test(n)) return { regionId: r, id };
  return null;
}

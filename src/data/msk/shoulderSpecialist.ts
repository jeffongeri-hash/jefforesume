import { shoulder } from './shoulder';
import type { Region } from './types';

export const SHOULDER_PATH = '/msk-anatomy-atlas/upper-extremity/shoulder';
export const shoulderSpecialist: Region = {
 ...shoulder,
 structures: shoulder.structures.map(s => s.id === 'biceps-lh' ? {...s, name:'Biceps brachii — long head', origin:'Supraglenoid tubercle and superior glenoid labrum.', relations:'Intra-articular but extrasynovial proximal tendon crosses the humeral head and exits through the bicipital groove. The reference mesh includes the whole long-head muscle/tendon, not an independently selectable proximal tendon.'} : s).concat([
  {id:'brachial-a',name:'Brachial artery — proximal course',tissue:'artery',course:'Begins at inferior border of teres major and runs in the medial arm.',supplies:'Arm through profunda brachii and muscular branches; divides into radial and ulnar arteries distally.',role:'Continues axillary arterial flow to the arm.',relations:'Median nerve travels beside it; proximal portion is shown in the shoulder crop.',clinical:'Compare distal pulse, capillary refill and neurologic findings after shoulder trauma; a palpable pulse does not exclude vascular injury.'},
  {id:'brachial-v',name:'Brachial veins — proximal course',tissue:'vein',course:'Paired deep veins accompanying the brachial artery; join basilic vein near inferior border of teres major to form axillary vein.',supplies:'Deep venous return from the arm.',role:'Drain the arm into the axillary venous system.',relations:'Venae comitantes, distinct from superficial cephalic and basilic veins.',clinical:'Reference mesh is continuous through the arm; only a proximal segment appears in regional mode.'},
 ]),
};
/** Named membership supplements spatial clipping; paired reference meshes are right-sided only. */
export function isRightShoulderMesh(name: string): boolean {
 if (!name.endsWith('.r')) return false;
 const n=name.slice(0,-2).toLowerCase();
 return /^(clavicle|scapula|humerus)$|glenohumeral|glenoid labrum|acromioclavicular|coracoclavicular|coraco.?acromial|coracohumeral|conoid ligament|trapezoid ligament|sternoclavicular|deltoid muscle|supraspinatus|infraspinatus|subscapularis|teres (minor|major)|biceps brachii|long head of triceps brachii|pectoralis (major|minor)|latissimus|serratus anterior|trapezius|coracobrachialis|subacromial bursa|subdeltoid bursa|axillary (nerve|artery|vein)|suprascapular nerve|musculocutaneous nerve|^brachial (artery|veins?)$|posterior circumflex humeral (artery|vein)/.test(n);
}
export function matchShoulderSpecialist(name: string) {
 const n=name.replace(/\.(l|r)$/i,'').toLowerCase();
 if (/^brachial artery$/.test(n)) return {regionId:'shoulder',id:'brachial-a'};
 if (/^brachial veins?$/.test(n)) return {regionId:'shoulder',id:'brachial-v'};
 if (/short head of biceps brachii/.test(n)) return null;
 return undefined;
}

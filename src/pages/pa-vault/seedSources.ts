export const DEFAULT_SOURCES = [
  {
    name: "Sutter Health",
    category: "hospital_system",
    platform: "manual_review",
    base_url: "https://jobs.sutterhealth.org/us/en/search-results?keywords=physician%20assistant&location=Sacramento%2C%20CA",
    config: {
      reason: "Sutter's Phenom tenant now renders search results through browser widget calls that do not expose listings to backend fetches",
    },
  },
  {
    name: "Dignity Health / CommonSpirit",
    category: "hospital_system",
    platform: "talentbrew",
    base_url: "https://www.commonspirit.careers",
    config: {
      query: "physician assistant",
      location: "Sacramento, CA",
    },
  },
  {
    name: "Kaiser Permanente",
    category: "hospital_system",
    platform: "talentbrew",
    base_url: "https://www.kaiserpermanentejobs.org",
    config: {
      query: "physician assistant per diem",
      location: "Sacramento, CA",
    },
  },
  {
    name: "UC Davis Health",
    category: "hospital_system",
    platform: "manual_review",
    base_url:
      "https://careerspub.universityofcalifornia.edu/psc/ucdmed/UCDMED/HCM/c/HRS_HRAM_FL.HRS_CG_SEARCH_FL.GBL",
    config: {
      reason: "UC Davis uses a PeopleSoft search page that requires browser rendering/session state",
    },
  },
  {
    name: "Vivian Health",
    category: "job_board",
    platform: "manual_review",
    base_url: "https://www.vivian.com/search/?search=physician%20assistant&location=Sacramento%2C%20CA",
    config: {
      reason: "Vivian renders listings client-side and does not include job cards in backend HTML responses",
    },
  },
  {
    name: "DocCafe",
    category: "job_board",
    platform: "manual_review",
    base_url: "https://www.doccafe.com/physician-assistant-jobs",
    config: {
      reason: "DocCafe blocks or removes direct regional listing URLs from backend fetches",
    },
  },
  {
    name: "ZipRecruiter",
    category: "job_board",
    platform: "generic_html",
    base_url: "https://www.ziprecruiter.com/candidate/search",
    config: {
      query_param: "search",
      query: "physician assistant per diem",
      location_param: "location",
      location: "Sacramento, CA",
      job_card_selector: ".job_content",
      title_selector: ".job_title",
      link_selector: "a",
    },
  },
  {
    name: "CompHealth",
    category: "locum_agency",
    platform: "comphealth",
    base_url: "https://comphealth.com/jobs/physician-assistant",
    config: {},
  },
  {
    name: "Weatherby Healthcare",
    category: "locum_agency",
    platform: "manual_review",
    base_url: "https://weatherbyhealthcare.com/locum-tenens-physician-assistant-jobs",
    config: {
      reason: "Weatherby returns gone/not-found responses to backend listing requests",
    },
  },
  {
    name: "LocumTenens.com",
    category: "locum_agency",
    platform: "manual_review",
    base_url: "https://www.locumtenens.com/Resources/JobSearch/QuickSearch",
    config: {
      reason: "LocumTenens search requires interactive browser/session navigation",
    },
  },
  {
    name: "Barton Associates",
    category: "locum_agency",
    platform: "barton",
    base_url: "https://www.bartonassociates.com/locum-tenens-jobs-open/?occupation=physician-assistant&state=california",
    config: {},
  },
  {
    name: "AMN Healthcare",
    category: "locum_agency",
    platform: "manual_review",
    base_url: "https://www.amnhealthcare.com/search/jobs/?q=physician%20assistant&profession=locum-tenens",
    config: {
      reason: "AMN is protected by bot mitigation and returns a challenge page to backend requests",
    },
  },
  {
    name: "Fusion Medical Staffing",
    category: "locum_agency",
    platform: "manual_review",
    base_url: "https://www.fusionmedstaff.com/jobs/",
    config: {
      reason: "Fusion restricts backend requests by geography/network and returns access denied",
    },
  },
  {
    name: "Aya Locums",
    category: "locum_agency",
    platform: "aya",
    base_url: "https://www.ayalocums.com/locum-tenens-jobs",
    config: {},
  },
];
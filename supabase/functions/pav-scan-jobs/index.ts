import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SourceRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  platform: string;
  base_url: string;
  config: Record<string, any>;
  active: boolean;
}

interface ScrapedJob {
  external_id: string;
  title: string;
  organization?: string;
  location?: string;
  pay_text?: string;
  posted_text?: string;
  url: string;
  is_per_diem?: boolean;
  raw?: Record<string, any>;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

class ManualReviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ManualReviewError";
  }
}

async function fetchText(url: string, accept = "text/html") {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: accept,
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return await res.text();
}

function absoluteUrl(href: string | undefined, baseUrl: string) {
  if (!href) return baseUrl;
  return href.startsWith("http") ? href : new URL(href, baseUrl).toString();
}

function cleanText(value: string | undefined | null) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function blockedSource(source: SourceRow, reason: string): never {
  throw new ManualReviewError(`${source.name}: ${reason}. Open the source link manually for current listings.`);
}

async function scrapePhenom(source: SourceRow): Promise<ScrapedJob[]> {
  const {
    api_path = "/api/apply/v2/jobs",
    domain,
    query = "",
    location = "",
  } = source.config;
  const url = new URL(source.base_url.replace(/\/$/, "") + api_path);
  url.searchParams.set("domain", domain ?? new URL(source.base_url).hostname);
  if (query) url.searchParams.set("query", query);
  if (location) url.searchParams.set("location", location);
  url.searchParams.set("start", "0");
  url.searchParams.set("num", "30");
  
  const res = await fetch(url.toString(), {
    headers: { 
      "User-Agent": UA, 
      "Accept": "application/json",
      "Referer": source.base_url,
      "X-Requested-With": "XMLHttpRequest"
    },
  });
  if (!res.ok) throw new Error(`Phenom API (${url.toString()}) responded ${res.status} for ${source.name}`);
  
  const data = await res.json();
  const list: any[] = data.jobs ?? data.data?.jobs ?? [];
  return list.map((j) => ({
    external_id: String(j.id ?? j.jobId ?? j.job_id ?? j.title),
    title: j.title,
    organization: j.company ?? source.name,
    location: j.location ?? (Array.isArray(j.locations) ? j.locations.join(", ") : undefined),
    pay_text: j.payRate ?? j.compensation ?? undefined,
    posted_text: j.postedDate ?? j.posted_on ?? undefined,
    url: j.applyUrl ?? j.url ?? `${source.base_url.replace(/\/$/, "")}/us/en/job/${j.id}`,
    is_per_diem: /per\s*diem/i.test(`${j.title} ${j.employmentType ?? ""}`),
    raw: j,
  }));
}

async function scrapeWorkday(source: SourceRow): Promise<ScrapedJob[]> {
  const { tenant, site, query = "" } = source.config;
  const endpoint = `${source.base_url.replace(/\/$/, "")}/wday/cxs/${tenant}/${site}/jobs`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": UA },
    body: JSON.stringify({
      appliedFacets: {},
      limit: 20,
      offset: 0,
      searchText: query,
    }),
  });
  if (!res.ok)
    throw new Error(
      `Workday endpoint responded ${res.status} for ${source.name} (tenant: ${tenant}, site: ${site})`
    );
  const data = await res.json();
  const postings: any[] = data.jobPostings ?? [];
  return postings.map((p) => ({
    external_id: String(p.bulletFields?.[0] ?? p.externalPath ?? p.title),
    title: p.title,
    organization: source.name,
    location: p.locationsText ?? p.location,
    posted_text: p.postedOn,
    url: `${source.base_url.replace(/\/$/, "")}${p.externalPath ?? ""}`,
    is_per_diem: /per\s*diem|prn/i.test(p.title ?? ""),
    raw: p,
  }));
}

async function scrapeTalentBrew(source: SourceRow): Promise<ScrapedJob[]> {
  const { query = "", location = "", records = 20 } = source.config;
  const url = new URL(`${source.base_url.replace(/\/$/, "")}/search-jobs/results`);
  url.searchParams.set("CurrentPage", "1");
  url.searchParams.set("RecordsPerPage", String(records));
  url.searchParams.set("SearchResultsModuleName", "Search Results");
  url.searchParams.set("SearchFiltersModuleName", "Search Filters");
  url.searchParams.set("SearchType", "5");
  url.searchParams.set("Keywords", query);
  url.searchParams.set("Location", location);
  url.searchParams.set("Distance", "50");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": UA, "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`${source.name} results endpoint responded ${res.status}`);

  const data = await res.json();
  const html = data.results ?? "";
  if (!html) return [];

  const $ = load(html);
  const jobs: ScrapedJob[] = [];
  $("a[data-job-id]").each((_, el) => {
    const link = $(el);
    const card = link.closest("li");
    const title = cleanText(link.find("h2").first().text() || link.text());
    if (!title) return;
    const href = link.attr("href") ?? "";
    const locationText = cleanText(
      link.find(".job-location, .job-location-list, [class*='location']").first().text() ||
        card.find(".job-location, .job-location-list, [class*='location']").first().text()
    );
    const jobId = link.attr("data-job-id") ?? href;

    jobs.push({
      external_id: String(jobId),
      title,
      organization: source.name,
      location: locationText || undefined,
      url: absoluteUrl(href, source.base_url),
      is_per_diem: /per\s*diem|prn|per-diem/i.test(`${title} ${locationText}`),
      raw: { jobId, locationText },
    });
  });
  return jobs;
}

async function scrapeGenericHtml(source: SourceRow): Promise<ScrapedJob[]> {
  const {
    query_param,
    query,
    location_param,
    location,
    job_card_selector,
    title_selector = "a",
    link_selector = "a",
    location_selector,
    pay_selector,
    posted_selector,
  } = source.config;
  
  const url = new URL(source.base_url);
  if (query_param && query) url.searchParams.set(query_param, query);
  if (location_param && location) url.searchParams.set(location_param, location);
  
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": UA, "Accept": "text/html" },
  });
  if (!res.ok) throw new Error(`${source.name} responded ${res.status}`);
  
  const html = await res.text();
  const $ = load(html);
  
  // Try to find JSON-LD first for robustness
  const jsonLd = $('script[type="application/ld+json"]');
  if (jsonLd.length > 0) {
    try {
      const data = JSON.parse(jsonLd.first().html() || "");
      const graph = Array.isArray(data) ? data : data["@graph"] ?? [data];
      const jobListings = graph.filter((item: any) => item["@type"] === "JobPosting");
      if (jobListings.length > 0) {
        return jobListings.map((j: any) => ({
          external_id: j.identifier?.value ?? j.url ?? j.title,
          title: j.title,
          organization: j.hiringOrganization?.name ?? source.name,
          location: j.jobLocation?.address?.addressLocality,
          pay_text: j.baseSalary?.value?.value ? `${j.baseSalary.value.value} ${j.baseSalary.value.unitText}` : undefined,
          posted_text: j.datePosted,
          url: j.url ?? source.base_url,
          is_per_diem: /per\s*diem|prn/i.test(j.title + (j.employmentType ?? "")),
          raw: j,
        }));
      }
    } catch (e) {
      console.warn("Failed to parse JSON-LD", e);
    }
  }

  const cards = $(job_card_selector);
  if (cards.length === 0) {
    throw new Error(`${source.name}: 0 cards matched "${job_card_selector}"`);
  }
  
  const jobs: ScrapedJob[] = [];
  cards.each((_, el) => {
    const card = $(el);
    const title = card.find(title_selector).first().text().trim();
    if (!title) return;
    const hrefRaw = card.find(link_selector).first().attr("href") ?? "";
    const jobUrl = hrefRaw.startsWith("http") ? hrefRaw : new URL(hrefRaw, source.base_url).toString();
    
    jobs.push({
      external_id: jobUrl,
      title,
      organization: source.name,
      location: location_selector ? card.find(location_selector).first().text().trim() : undefined,
      pay_text: pay_selector ? card.find(pay_selector).first().text().trim() : undefined,
      posted_text: posted_selector ? card.find(posted_selector).first().text().trim() : undefined,
      url: jobUrl,
      is_per_diem: /per\s*diem|prn/i.test(title),
      raw: { title },
    });
  });
  return jobs;
}

async function scrapeCompHealth(source: SourceRow): Promise<ScrapedJob[]> {
  const html = await fetchText(source.base_url);
  const $ = load(html);
  const jobs: ScrapedJob[] = [];
  $(".job-card-container").each((_, el) => {
    const card = $(el);
    const link = card.find('a[href^="/job/"]').first();
    const title = cleanText(link.find("h4").first().text() || link.text());
    if (!title) return;
    const href = link.attr("href") ?? "";
    const tags = card.find(".job-info-tag").map((__, tag) => cleanText($(tag).text())).get().filter(Boolean);
    jobs.push({
      external_id: card.attr("id") ?? href,
      title,
      organization: source.name,
      location: tags.find((tag) => /,/.test(tag) && !/\$|Locum|Posted/i.test(tag)),
      pay_text: tags.find((tag) => /\$/.test(tag)),
      posted_text: tags.find((tag) => /^Posted/i.test(tag)),
      url: absoluteUrl(href, source.base_url),
      is_per_diem: /per\s*diem|prn/i.test(title),
      raw: { tags },
    });
  });
  return jobs;
}

async function scrapeBarton(source: SourceRow): Promise<ScrapedJob[]> {
  const html = await fetchText(source.base_url);
  const $ = load(html);
  const jobs: ScrapedJob[] = [];
  $("li.specific-job").each((_, el) => {
    const card = $(el);
    const link = card.find("h4 a").first();
    const title = cleanText(link.text());
    if (!title) return;
    const providerType = cleanText(card.find(".provider-type a").first().text());
    const location = cleanText(card.find(".location a").first().text());
    const specialty = cleanText(card.find(".specialty a").first().text());
    const href = link.attr("href") ?? "";
    jobs.push({
      external_id: href || title,
      title,
      organization: source.name,
      location: location || undefined,
      url: absoluteUrl(href, source.base_url),
      is_per_diem: false,
      raw: { providerType, specialty, description: cleanText(card.find(".description").text()) },
    });
  });
  return jobs;
}

async function scrapeAya(source: SourceRow): Promise<ScrapedJob[]> {
  const html = await fetchText(source.base_url);
  const match = html.match(/var jobsData = (\[.*?\])\s*var /s);
  if (!match) return [];
  const list: any[] = JSON.parse(match[1]);
  const wanted = /physician assistant|\bpa\b/i;
  return list
    .filter((job) => wanted.test(`${job.professionText ?? ""} ${job.expertiseText ?? ""} ${job.title ?? ""}`))
    .map((job) => {
      const specialty = cleanText(job.expertiseText);
      const cityState = cleanText([job.city, job.stateAbbrev].filter(Boolean).join(", "));
      const title = specialty ? `Locum PA - ${specialty}` : "Locum Physician Assistant";
      return {
        external_id: String(job.jobID ?? title),
        title,
        organization: source.name,
        location: cityState || undefined,
        pay_text:
          job.regularPayLow || job.regularPayHigh
            ? `$${job.regularPayLow ?? "?"} - $${job.regularPayHigh ?? "?"}/hr`
            : undefined,
        posted_text: job.enteredTime,
        url: `${source.base_url.replace(/\/$/, "")}/?jobId=${job.jobID}`,
        is_per_diem: false,
        raw: job,
      };
    });
}

async function runOneSource(admin: any, userId: string, source: SourceRow) {
  const { data: run } = await admin
    .from("pav_scrape_runs")
    .insert({ user_id: userId, source_id: source.id, source_name: source.name })
    .select()
    .single();
  try {
    let jobs: ScrapedJob[] = [];
    switch (source.platform) {
      case "phenom":
        jobs = await scrapePhenom(source);
        break;
      case "workday":
        jobs = await scrapeWorkday(source);
        break;
      case "talentbrew":
        jobs = await scrapeTalentBrew(source);
        break;
      case "comphealth":
        jobs = await scrapeCompHealth(source);
        break;
      case "barton":
        jobs = await scrapeBarton(source);
        break;
      case "aya":
        jobs = await scrapeAya(source);
        break;
      case "manual_review":
        blockedSource(source, source.config?.reason ?? "this site blocks backend scraping or requires browser-only rendering");
        break;
      case "generic_html":
      case "json_api":
        jobs = await scrapeGenericHtml(source);
        break;
      default:
        throw new Error(`Unknown platform "${source.platform}"`);
    }
    
    let newCount = 0;
    for (const j of jobs) {
      const { error } = await admin.from("pav_jobs").upsert(
        {
          user_id: userId,
          source_id: source.id,
          source_name: source.name,
          external_id: j.external_id,
          title: j.title,
          organization: j.organization ?? source.name,
          location: j.location,
          pay_text: j.pay_text,
          posted_text: j.posted_text,
          url: j.url,
          is_per_diem: j.is_per_diem ?? false,
          raw: j.raw ?? {},
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,source_name,external_id", ignoreDuplicates: false }
      );
      if (!error) newCount += 1;
    }
    
    await admin.from("pav_scrape_runs").update({
      finished_at: new Date().toISOString(),
      status: "ok",
      jobs_found: jobs.length,
      jobs_new: newCount,
    }).eq("id", run!.id);
    
    await admin.from("pav_sources").update({
      last_scraped_at: new Date().toISOString(),
      last_status: "ok",
      last_error: null,
    }).eq("id", source.id);
    
    return { source: source.name, status: "ok", jobs_found: jobs.length };
  } catch (e: any) {
    const message = String(e?.message ?? e);
    await admin.from("pav_scrape_runs").update({ 
      finished_at: new Date().toISOString(), 
      status: "error", 
      error: message 
    }).eq("id", run!.id);
    
    await admin.from("pav_sources").update({
      last_scraped_at: new Date().toISOString(),
      last_status: "error",
      last_error: message,
    }).eq("id", source.id);
    
    return { source: source.name, status: "error", error: message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing Authorization header" }, 401);
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Not authenticated" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const body = await req.json().catch(() => ({}));
    const onlySourceId: string | undefined = body?.source_id;

    let q = admin.from("pav_sources").select("*").eq("user_id", user.id).eq("active", true);
    if (onlySourceId) q = q.eq("id", onlySourceId);
    const { data: sources, error: sourcesErr } = await q;
    if (sourcesErr) return json({ error: sourcesErr.message }, 500);

    const results = [];
    for (const source of (sources ?? []) as SourceRow[]) {
      results.push(await runOneSource(admin, user.id, source));
    }
    return json({ results });
  } catch (e: any) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

// prisma/fetch-university-images.mjs
// Finds a real photo for every university without one, using Wikidata's curated main image (P18),
// falling back to the linked Wikipedia/Commons pages. Images are free-licensed (Wikimedia Commons).
// Phases (run in order):
//   node --env-file=.env.local prisma/fetch-university-images.mjs plan      -> prisma/university-images-plan.json
//   node --env-file=.env.local prisma/fetch-university-images.mjs download  -> public/images/universities/<slug>.jpg + CREDITS.json
//   node --env-file=.env.local prisma/fetch-university-images.mjs apply     -> sets University.coverImageUrl
// Slugs listed in prisma/university-images-reject.json are skipped by `apply`.
import { PrismaClient } from '@prisma/client'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { execFileSync } from 'child_process'

const PHASE = process.argv[2] || 'plan'
const UA = 'YildizFoundationSite/1.0 (yildiz2020t@gmail.com)'
const OUT_DIR = 'public/images/universities'
const PLAN = 'prisma/university-images-plan.json'
const prisma = new PrismaClient()
const sleep = ms => new Promise(r => setTimeout(r, ms))

const COUNTRY_NAMES = {
  turkey: ['turkey', 'turkiye', 'turk', 'تركيا'],
  'northern-cyprus': ['northern cyprus', 'trnc', 'kuzey kibris', 'شمال قبرص', 'قبرص التركية'],
  georgia: ['georgia', 'gurcistan', 'جورجيا'],
  germany: ['germany', 'almanya', 'deutschland', 'ألمانيا'],
  spain: ['spain', 'ispanya', 'espana', 'إسبانيا'],
  hungary: ['hungary', 'macaristan', 'magyar', 'هنغاريا'],
  romania: ['romania', 'romanya', 'رومانيا'],
  syria: ['syria', 'suriye', 'سوريا', 'سورية'],
}
const norm = s => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const BAD = /(logo|seal|emblem|flag|map|coat|crest|icon|signature|symbol|wordmark|diagram|chart|poster|banner|portrait|statue|stamp|medal|ribbon|ranking|infobox|commons-|people|student|professor|rector|president|dean|award|ceremony|protest|meeting|conference|bust|monument|memorial|coin|screenshot|mosaic|montage|collage|\.svg|\.png|\.gif|\.pdf|\.tif)/i
const BAD_LOOSE = /(logo|seal|emblem|flag|map|coat|crest|icon|signature|wordmark|diagram|\.svg|\.png|\.gif|\.pdf|\.tif|portrait|poster)/i

async function api(host, params) {
  const url = `https://${host}/w/api.php?format=json&${new URLSearchParams(params)}`
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } })
    if (r.status === 429) { await sleep(2500 * (i + 1)); continue }
    return r.json()
  }
  throw new Error('rate limited')
}
const WD = 'www.wikidata.org', COMMONS = 'commons.wikimedia.org'

function plausible(desc, uni) {
  const d = norm(desc)
  if (!d) return false
  if (/united states|abd|الولايات المتحدة/.test(d)) return false
  const cities = [uni.cityEn, uni.cityTr, uni.cityAr].map(norm).filter(Boolean)
  if (cities.some(c => d.includes(c))) return true
  if (uni.country === 'georgia') return false
  return COUNTRY_NAMES[uni.country].some(c => d.includes(norm(c)))
}

async function findQid(uni) {
  for (const [lang, name] of [['en', uni.nameEn], ['tr', uni.nameTr], ['ar', uni.nameAr]]) {
    const res = await api(WD, { action: 'wbsearchentities', search: name, language: lang, uselang: lang, type: 'item', limit: '8' })
    for (const h of res.search || []) {
      if (!/univers|üniversite|جامعة|institute|enstitü|معهد|college/i.test((h.description || '') + ' ' + (h.label || ''))) continue
      if (plausible(h.description, uni)) return h.id
    }
    await sleep(150)
  }
  return null
}

function fileScore(title, tokens) {
  const n = title.replace(/^File:/i, '').toLowerCase()
  if (!/\.(jpe?g)$/.test(n) || BAD.test(n)) return -1
  let s = 0
  if (/campus|kampus|kampüs/.test(n)) s += 3
  if (/building|facade|entrance|gate|rectorate|library|hall|aerial|main|faculty|fakulte|fakülte|bina/.test(n)) s += 2
  if (/universit|college|institute|school|üniversite/.test(n)) s += 2
  s += tokens.filter(t => n.includes(t)).length
  return s
}

async function imageInfo(fileTitle) {
  const res = await api(COMMONS, { action: 'query', titles: fileTitle, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '900' })
  const ii = Object.values(res.query?.pages || {})[0]?.imageinfo?.[0]
  if (!ii) return null
  const m = ii.extmetadata || {}
  return {
    file: fileTitle, thumb: ii.thumburl, width: ii.width, height: ii.height, page: ii.descriptionurl,
    license: m.LicenseShortName?.value || '', author: (m.Artist?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 120),
  }
}
const goodShape = i => i && i.width >= 700 && i.width / i.height >= 1.15 && i.width / i.height <= 2.6

async function imageFromQid(qid, uni) {
  const ent = await api(WD, { action: 'wbgetentities', ids: qid, props: 'claims|sitelinks', sitefilter: 'enwiki|trwiki|arwiki' })
  const e = ent.entities?.[qid]
  const tokens = norm(uni.nameEn).split(' ').filter(t => t.length > 3)
  // 1) curated main image(s)
  for (const c of (e?.claims?.P18 || []).slice(0, 3)) {
    const name = c.mainsnak?.datavalue?.value
    if (!name || BAD_LOOSE.test(name)) continue
    const info = await imageInfo('File:' + name)
    if (goodShape(info)) return { ...info, via: `wikidata:${qid}:P18` }
  }
  // 2) wikipedia page images
  for (const [site, host] of [['enwiki', 'en.wikipedia.org'], ['trwiki', 'tr.wikipedia.org'], ['arwiki', 'ar.wikipedia.org']]) {
    const title = e?.sitelinks?.[site]?.title
    if (!title) continue
    const res = await api(host, { action: 'query', titles: title, prop: 'images', imlimit: '120' })
    const imgs = Object.values(res.query?.pages || {})[0]?.images || []
    const cands = imgs.map(i => ({ t: i.title, s: fileScore(i.title, tokens) })).filter(c => c.s >= 2).sort((a, b) => b.s - a.s)
    for (const c of cands.slice(0, 4)) {
      const info = await imageInfo(c.t)
      if (goodShape(info)) return { ...info, via: `${site}:${title}` }
    }
  }
  // 3) commons category from P373
  const cat = e?.claims?.P373?.[0]?.mainsnak?.datavalue?.value
  if (cat) {
    const mem = await api(COMMONS, { action: 'query', list: 'categorymembers', cmtitle: 'Category:' + cat, cmtype: 'file', cmlimit: '80' })
    const cands = (mem.query?.categorymembers || []).map(m => ({ t: m.title, s: fileScore(m.title, tokens) })).filter(c => c.s >= 2).sort((a, b) => b.s - a.s)
    for (const c of cands.slice(0, 4)) {
      const info = await imageInfo(c.t)
      if (goodShape(info)) return { ...info, via: `commons-category:${cat}` }
    }
  }
  return null
}

async function plan() {
  const unis = await prisma.university.findMany({ where: { coverImageUrl: null }, orderBy: [{ country: 'asc' }, { nameEn: 'asc' }] })
  console.log(`${unis.length} universities without an image`)
  const out = []
  for (const u of unis) {
    let res = null, qid = null
    try { qid = await findQid(u); if (qid) res = await imageFromQid(qid, u) } catch (e) { console.log(`  ! ${u.slug}: ${e.message}`) }
    out.push({ slug: u.slug, name: u.nameEn, country: u.country, qid, ...(res || {}) })
    console.log(`${res ? 'OK  ' : 'MISS'} ${u.slug} [${qid || 'no-qid'}] ${res ? res.via + ' | ' + res.file.slice(5, 70) : ''}`)
    await sleep(200)
  }
  writeFileSync(PLAN, JSON.stringify(out, null, 2))
}

async function download() {
  const items = JSON.parse(readFileSync(PLAN, 'utf8')).filter(x => x.thumb)
  mkdirSync(OUT_DIR, { recursive: true })
  const creditsPath = `${OUT_DIR}/CREDITS.json`
  const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {}
  for (const p of items) {
    const dest = `${OUT_DIR}/${p.slug}.jpg`
    if (!existsSync(dest)) {
      let ok = false
      for (let i = 0; i < 5 && !ok; i++) {
        try { execFileSync('curl', ['-sfL', '-A', UA, '-o', dest, p.thumb]); ok = true } catch { await sleep(3000 * (i + 1)) }
      }
      if (!ok) { console.log(`download failed: ${p.slug}`); continue }
      await sleep(500)
    }
    credits[p.slug] = { source: p.page, license: p.license, author: p.author }
  }
  writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
  console.log(`downloaded ${items.length}`)
}

// Fallback for universities with no free-licensed photo: use the og:image of their official website.
const MANUAL_SITES = {
  'akaki-tsereteli-state-university': 'https://atsu.edu.ge', 'corvinus-university-of-budapest': 'https://www.uni-corvinus.hu',
  'cyprus-science-university': 'https://www.csu.edu.tr', 'metu-northern-cyprus-campus': 'https://ncc.metu.edu.tr',
  'alexandru-ioan-cuza-university-of-iasi': 'https://www.uaic.ro', 'george-emil-palade-university-of-medicine-pharmacy-science-and-technology-of-targu-mures': 'https://www.umfst.ro',
  'grigore-t-popa-university-of-medicine-and-pharmacy-iasi': 'https://www.umfiasi.ro', 'transilvania-university-of-brasov': 'https://www.unitbv.ro',
  'autonomous-university-of-madrid': 'https://www.uam.es', 'ie-university': 'https://www.ie.edu', 'university-of-stuttgart': 'https://www.uni-stuttgart.de',
  'university-of-georgia-tbilisi': 'https://www.ug.edu.ge', 'david-tvildiani-medical-university': 'https://www.dtmu.edu.ge',
  'caucasus-university': 'https://cu.edu.ge', 'bau-international-university-batumi': 'https://bau.edu.ge', 'tbilisi-state-medical-university': 'https://www.tsmu.edu',
  'final-international-university': 'https://www.final.edu.tr', 'arkin-university-of-creative-arts-and-design': 'https://arucad.edu.tr', 'rauf-denktas-university': 'https://www.rdu.edu.tr',
  'university-of-granada': 'https://www.ugr.es', 'university-of-navarra': 'https://www.unav.edu', 'al-baath-university': 'https://albaath-univ.edu.sy',
  'syrian-virtual-university': 'https://svuonline.org', 'arab-international-university': 'https://aiu.edu.sy', 'international-university-for-science-and-technology': 'https://iust.edu.sy',
  'afyon-kocatepe-university': 'https://www.aku.edu.tr', 'antalya-bilim-university': 'https://www.antalya.edu.tr', 'firat-university': 'https://www.firat.edu.tr',
  'gebze-technical-university': 'https://www.gtu.edu.tr', 'istanbul-aydin-university': 'https://www.aydin.edu.tr', 'istanbul-gelisim-university': 'https://www.gelisim.edu.tr',
  'kahramanmaras-sutcu-imam-university': 'https://www.ksu.edu.tr', 'mugla-sitki-kocman-university': 'https://www.mu.edu.tr', 'necmettin-erbakan-university': 'https://www.erbakan.edu.tr',
  'sivas-cumhuriyet-university': 'https://www.cumhuriyet.edu.tr',
}
async function ogImage(slug, site) {
  const html = (() => { try { return execFileSync('curl', ['-sL', '-m', '25', '-A', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36', site], { encoding: 'utf8', maxBuffer: 20e6 }) } catch { return '' } })()
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => m[0]).filter(t => /["'](?:og:image|twitter:image)(?::secure_url)?["']/i.test(t))
  const urls = metas.map(m => (m.match(/content=["']([^"']+)["']/i) || [])[1]).filter(Boolean)
  for (const u of urls) {
    let abs; try { abs = new URL(u.replace(/&amp;/g, '&'), site).href } catch { continue }
    if (/logo|icon|favicon|\.svg/i.test(abs)) continue
    const tmp = `/tmp/og-${slug}`
    try { execFileSync('curl', ['-sfL', '-m', '40', '-A', 'Mozilla/5.0', '-o', tmp, abs]) } catch { continue }
    let w = 0, h = 0
    try {
      const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', tmp], { encoding: 'utf8' })
      w = +out.match(/pixelWidth: (\d+)/)[1]; h = +out.match(/pixelHeight: (\d+)/)[1]
    } catch { continue }
    if (w < 600 || w / h < 1.2 || w / h > 2.6) continue
    mkdirSync(OUT_DIR, { recursive: true })
    try { execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1000', tmp, '--out', `${OUT_DIR}/${slug}.jpg`], { stdio: 'ignore' }) } catch { continue }
    return { page: site, source: abs }
  }
  return null
}

// Second pass for the remaining misses: every language edition of the Wikipedia article + Commons file search.
async function relax() {
  const items = JSON.parse(readFileSync(PLAN, 'utf8'))
  const unis = Object.fromEntries((await prisma.university.findMany()).map(u => [u.slug, u]))
  for (const m of items.filter(x => !x.thumb && !x.localOnly)) {
    const u = unis[m.slug]
    const tokens = norm(u.nameEn).split(' ').filter(t => t.length > 3)
    let found = null
    try {
      if (m.qid) {
        const ent = await api(WD, { action: 'wbgetentities', ids: m.qid, props: 'sitelinks' })
        const links = Object.entries(ent.entities?.[m.qid]?.sitelinks || {}).filter(([k]) => /^[a-z]{2,3}wiki$/.test(k) && !/^(commons|wikidata|species|meta)/.test(k)).slice(0, 12)
        for (const [site, l] of links) {
          const host = `${site.replace(/wiki$/, '').replace(/_/g, '-')}.wikipedia.org`
          const res = await api(host, { action: 'query', titles: l.title, prop: 'images', imlimit: '120' }).catch(() => null)
          const imgs = Object.values(res?.query?.pages || {})[0]?.images || []
          const cands = imgs.map(i => ({ t: i.title, s: fileScore(i.title, tokens) })).filter(c => c.s >= 1).sort((a, b) => b.s - a.s)
          for (const c of cands.slice(0, 3)) {
            const info = await imageInfo(c.t)
            if (goodShape(info)) { found = { ...info, via: `${site}:${l.title}` }; break }
          }
          if (found) break
        }
      }
      if (!found) {
        const res = await api(COMMONS, { action: 'query', list: 'search', srsearch: u.nameEn, srnamespace: '6', srlimit: '15' })
        const cands = (res.query?.search || []).map(h => ({ t: h.title, s: fileScore(h.title, tokens), hit: tokens.filter(t => norm(h.title).includes(t)).length })).filter(c => c.s >= 1 && c.hit >= Math.min(2, tokens.length)).sort((a, b) => b.s - a.s)
        for (const c of cands.slice(0, 4)) {
          const info = await imageInfo(c.t)
          if (goodShape(info)) { found = { ...info, via: 'commons-search' }; break }
        }
      }
    } catch (e) { console.log(`  ! ${m.slug}: ${e.message}`) }
    if (found) Object.assign(m, found)
    console.log(`${found ? 'OK  ' : 'MISS'} ${m.slug} ${found ? found.via + ' | ' + found.file.slice(5, 70) : ''}`)
    await sleep(200)
  }
  writeFileSync(PLAN, JSON.stringify(items, null, 2))
}


Object.assign(MANUAL_SITES, {
  'ege-university': 'https://www.ege.edu.tr', 'hacettepe-university': 'https://www.hacettepe.edu.tr', 'karadeniz-technical-university': 'https://www.ktu.edu.tr',
  'pamukkale-university': 'https://www.pau.edu.tr', 'selcuk-university': 'https://www.selcuk.edu.tr', 'van-yuzuncu-yil-university': 'https://www.yyu.edu.tr',
  'szechenyi-istvan-university': 'https://www.sze.hu', 'akaki-tsereteli-state-university': 'https://atsu.edu.ge',
})
// Last resort: pick the largest landscape photo found on the official homepage.
async function scrapeSite(slug, site) {
  const html = (() => { try { return execFileSync('curl', ['-sL', '-m', '25', '-A', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36', site], { encoding: 'utf8', maxBuffer: 30e6 }) } catch { return '' } })()
  if (!html) return null
  const raw = new Set()
  for (const m of html.matchAll(/(?:src|data-src|data-lazy-src|data-original|content)=["']([^"']+\.jpe?g[^"']*)["']/gi)) raw.add(m[1])
  for (const m of html.matchAll(/url\(["']?([^"')]+\.jpe?g[^"')]*)["']?\)/gi)) raw.add(m[1])
  const urls = []
  for (const u of raw) {
    let abs; try { abs = new URL(u.replace(/&amp;/g, '&'), site).href } catch { continue }
    if (/logo|icon|sprite|avatar|flag|button|btn|arrow|pattern|social|thumb|small|150x|100x|banner-?ad/i.test(abs)) continue
    urls.push(abs)
  }
  let best = null
  for (const abs of [...new Set(urls)].slice(0, 14)) {
    const tmp = `/tmp/sc-${slug}`
    try { execFileSync('curl', ['-sfL', '-m', '30', '-A', 'Mozilla/5.0', '-o', tmp, abs]) } catch { continue }
    let w = 0, h = 0
    try { const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', tmp], { encoding: 'utf8' }); w = +out.match(/pixelWidth: (\d+)/)[1]; h = +out.match(/pixelHeight: (\d+)/)[1] } catch { continue }
    if (w < 900 || w / h < 1.3 || w / h > 2.4) continue
    if (!best || w * h > best.area) { best = { abs, area: w * h }; execFileSync('cp', [tmp, `/tmp/sc-best-${slug}`]) }
  }
  if (!best) return null
  mkdirSync(OUT_DIR, { recursive: true })
  try { execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1000', `/tmp/sc-best-${slug}`, '--out', `${OUT_DIR}/${slug}.jpg`], { stdio: 'ignore' }) } catch { return null }
  return { page: site, source: best.abs }
}

async function scrape() {
  const items = JSON.parse(readFileSync(PLAN, 'utf8'))
  const misses = items.filter(x => !x.thumb && !x.localOnly)
  const qids = misses.map(m => m.qid).filter(Boolean)
  const sites = {}
  for (let i = 0; i < qids.length; i += 40) {
    const ent = await api(WD, { action: 'wbgetentities', ids: qids.slice(i, i + 40).join('|'), props: 'claims' })
    for (const [id, e] of Object.entries(ent.entities || {})) { const v = e.claims?.P856?.[0]?.mainsnak?.datavalue?.value; if (v) sites[id] = v }
  }
  const creditsPath = `${OUT_DIR}/CREDITS.json`
  const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {}
  for (const m of misses) {
    const tried = [MANUAL_SITES[m.slug], sites[m.qid]].filter(Boolean)
    let r = null
    for (const site of [...new Set(tried)]) { r = await scrapeSite(m.slug, site); if (r) break }
    if (r) { m.localOnly = true; m.via = 'site-scrape'; m.page = r.page; m.license = 'Official university website image'; credits[m.slug] = { source: r.source, license: m.license, author: '' } }
    console.log(`${r ? 'OK  ' : 'MISS'} ${m.slug} ${r ? r.source.slice(0, 90) : tried.join(' ') || 'no-site'}`)
  }
  writeFileSync(PLAN, JSON.stringify(items, null, 2))
  writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
}

async function og() {
  const items = JSON.parse(readFileSync(PLAN, 'utf8'))
  const misses = items.filter(x => !x.thumb && !x.localOnly)
  const qids = misses.map(m => m.qid).filter(Boolean)
  const sites = {}
  for (let i = 0; i < qids.length; i += 40) {
    const ent = await api(WD, { action: 'wbgetentities', ids: qids.slice(i, i + 40).join('|'), props: 'claims' })
    for (const [id, e] of Object.entries(ent.entities || {})) { const v = e.claims?.P856?.[0]?.mainsnak?.datavalue?.value; if (v) sites[id] = v }
  }
  const creditsPath = `${OUT_DIR}/CREDITS.json`
  const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {}
  for (const m of misses) {
    const site = MANUAL_SITES[m.slug] || sites[m.qid]
    let r = null
    if (site) r = await ogImage(m.slug, site)
    if (!r && sites[m.qid] && MANUAL_SITES[m.slug] && sites[m.qid] !== MANUAL_SITES[m.slug]) r = await ogImage(m.slug, sites[m.qid])
    if (r) { m.localOnly = true; m.via = 'og-image'; m.page = r.page; m.license = 'Official university website image'; credits[m.slug] = { source: r.source, license: m.license, author: '' } }
    console.log(`${r ? 'OK  ' : 'MISS'} ${m.slug} ${site || 'no-site'}`)
  }
  writeFileSync(PLAN, JSON.stringify(items, null, 2))
  writeFileSync(creditsPath, JSON.stringify(credits, null, 2))
}

async function apply() {
  const reject = existsSync('prisma/university-images-reject.json') ? JSON.parse(readFileSync('prisma/university-images-reject.json', 'utf8')) : []
  const items = JSON.parse(readFileSync(PLAN, 'utf8')).filter(x => (x.thumb || x.localOnly) && !reject.includes(x.slug) && existsSync(`${OUT_DIR}/${x.slug}.jpg`))
  for (const p of items) await prisma.university.update({ where: { slug: p.slug }, data: { coverImageUrl: `/images/universities/${p.slug}.jpg` } })
  console.log(`applied ${items.length}, rejected ${reject.length}`)
}

const phases = { plan, download, relax, og, scrape, apply }
phases[PHASE]().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())

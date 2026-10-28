import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path('/tmp/browser/mechanics')
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True)
  for width,height,reduced in [(1280,1800,False),(390,844,False),(390,844,True)]:
   context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
   page=await context.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   await page.goto('http://localhost:8080/msk-anatomy-atlas/movement-injury')
   await page.locator('[data-scene-ready]').wait_for(timeout=90000)
   panel=page.get_by_role('region',name='Animation panel')
   play=page.get_by_role('button',name='Play animation',exact=True)
   assert await play.count()==1
   if reduced: assert await play.is_disabled()
   else: assert await play.is_enabled()
   await page.get_by_role('button',name='Shoulder abduction & controlled lowering',exact=True).click()
   await page.get_by_role('button',name='Middle deltoid',exact=True).click()
   await page.get_by_test_id('selected-mesh-label').wait_for()
   assert 'Acromial part of deltoid' in await page.get_by_role('region',name='Selected anatomy').inner_text()
   await page.get_by_role('button',name='Step forward',exact=True).click()
   assert 'Controlled lowering' in await page.get_by_role('complementary',name='Phase anatomy').inner_text()
   await page.get_by_role('button',name='Step back',exact=True).click()
   timeline=page.get_by_role('slider',name='Animation timeline',exact=True)
   await timeline.fill('4.5');assert float(await timeline.input_value())==4.5
   await page.get_by_role('button',name='1.5×',exact=True).click();assert await page.get_by_role('button',name='1.5×',exact=True).get_attribute('aria-pressed')=='true'
   if not reduced:
    await play.click();await page.get_by_role('button',name='Pause animation',exact=True).wait_for();await page.wait_for_timeout(1200)
    await page.get_by_role('button',name='Pause animation',exact=True).click()
    await page.get_by_role('button',name='Replay animation',exact=True).click();await page.get_by_role('button',name='Pause animation',exact=True).click()
   await panel.screenshot(path=str(ROOT/f'movement-{width}-{reduced}.png'))
   await page.get_by_role('button',name='Injury mechanism',exact=True).click()
   await page.get_by_role('button',name='Lateral ankle inversion mechanism',exact=True).click()
   await page.get_by_role('button',name='Step forward',exact=True).click()
   await page.get_by_role('button',name='Anterior talofibular / calcaneofibular ligaments',exact=True).click()
   assert 'Index only — no separate mesh in this reference model' in await page.get_by_role('region',name='Index-only anatomy').inner_text()
   await page.get_by_test_id('relationship-label').wait_for()
   assert await page.get_by_text('Mechanism animation — educational anatomy, not a diagnosis.',exact=True).count()==1
   await panel.screenshot(path=str(ROOT/f'injury-{width}-{reduced}.png'))
   assert await page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'overflow'
   assert not errors,errors
   print('PASS mechanics',width,'reduced',reduced)
   if width==1280:
    await page.get_by_role('button',name='Movement',exact=True).click()
    await page.get_by_role('searchbox',name='Search mechanics').fill('squat')
    await page.get_by_role('navigation',name='Mechanics library').get_by_role('button',name='Squat descent / ascent',exact=True).wait_for()
    await page.goto('http://localhost:8080/msk-anatomy-atlas')
    await page.locator('a[href="/msk-anatomy-atlas/movement-injury"]').first.wait_for()
    for route,name in [('upper-extremity/shoulder','Supraspinatus'),('lower-extremity/knee','Anterior cruciate ligament'),('lower-extremity/ankle-foot','Talus')]:
     await page.goto('http://localhost:8080/msk-anatomy-atlas/'+route)
     await page.locator('canvas').first.wait_for(timeout=60000)
     await page.locator('[data-scene-ready]').wait_for(timeout=90000)
     await page.get_by_role('button').filter(has_text=name).first.click(timeout=60000)
     await page.get_by_test_id('selected-mesh-label').wait_for(timeout=60000)
     print('PASS regression',route)
   await context.close()
  await browser.close()
asyncio.run(main())

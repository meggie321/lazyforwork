import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { build } = createRequire(require.resolve('vite'))('esbuild')
import { JSDOM } from 'jsdom'
import assert from 'node:assert/strict'
const compiled=await build({stdin:{contents:`import React from 'react'; import {createRoot} from 'react-dom/client'; import Game from './src/BusyGame'; createRoot(document.getElementById('root')).render(<Game/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',loader:{'.css':'empty'},jsx:'automatic'})
const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost:5180/',runScripts:'dangerously',pretendToBeVisual:true})
dom.window.eval(compiled.outputFiles[0].text)
const wait=ms=>new Promise(r=>setTimeout(r,ms))
await wait(150)
const doc=dom.window.document
assert.ok(doc.querySelector('.entry-panel'))
assert.match(doc.querySelector('.start-shift').textContent,/常态打工/)
const before=doc.querySelector('.countdown strong').textContent
await wait(1100)
assert.equal(doc.querySelector('.countdown strong').textContent,before)
doc.querySelector('.option-2').click()
await wait(50)
assert.match(doc.querySelector('.start-shift').textContent,/魔鬼周五/)
doc.querySelector('.start-shift').click()
await wait(150)
assert.equal(doc.querySelector('.entry-panel'),null)
assert.match(doc.querySelector('.mode').textContent,/魔鬼周五.*2/)
assert.match(doc.querySelector('.player-state').textContent,/摸鱼时光/)
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Space',bubbles:true}))
await wait(50)
assert.ok(doc.querySelector('.spreadsheet'))
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Digit1',bubbles:true}))
await wait(50)
assert.ok(doc.querySelector('.drawer.closed'))
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Digit2',bubbles:true}))
await wait(50)
assert.ok(doc.querySelector('.equipped'))
const points=()=>Number(doc.querySelector('.score strong').textContent)
const itemCases=[['.noodles',5],['.spicy',5],['.chips',5],['.fish',10],['.tea',5],['.cola',5],['.coffee',5]]
for(const [selector] of itemCases){
 const item=doc.querySelector(selector)
 assert.ok(item.closest('.snack-tray.is-hidden'), `${selector} stored in drawer`)
 assert.equal(item.disabled,true)
 const previous=points(); item.click(); await wait(10); assert.equal(points(),previous)
}
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Digit1',bubbles:true}))
await wait(50)
for(const [selector,base] of itemCases){
 const item=doc.querySelector(selector); const previous=points()
 assert.equal(item.disabled,false)
 item.click();await wait(20)
 assert.equal(points()-previous,base*2*2,`${selector} awards mode multiplier and double glasses points`)
}
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Digit2',bubbles:true}))
await wait(50)
for(const [selector,base] of itemCases){
 const previous=points();doc.querySelector(selector).click();await wait(20)
 assert.equal(points()-previous,base*2,`${selector} normal points after removing glasses`)
}
dom.window.dispatchEvent(new dom.window.KeyboardEvent('keydown',{code:'Escape',bubbles:true}))
await wait(50)
const pausedScore=points()
for(const [selector] of itemCases){assert.equal(doc.querySelector(selector).disabled,true);doc.querySelector(selector).click()}
await wait(50)
assert.equal(points(),pausedScore,'paused items award no points')
console.log('PASS: entry, mode selection, keyboard controls, all 7 item rewards, glasses double points, all items stored, hidden/paused clicks blocked')
dom.window.close()


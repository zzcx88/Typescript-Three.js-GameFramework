/**
 * 순환참조 구조 점검 — SCC(강결합 요소) 기준
 *
 * madge --circular 은 "순환 경로"를 나열한다. 덩어리 하나에서도 경로는 수십 개가 나오고,
 * 간선 하나만 바뀌어도 숫자가 출렁여서 추세를 못 본다.
 *
 * 여기서는 대신 **SCC** 를 센다.
 *   SCC = 서로가 서로에게 도달 가능한 모듈들의 최대 집합.
 *         크기 2 이상이면 그 모듈들은 영원히 함께 로드되고, 따로 떼어낼 수 없다.
 *
 * 기준선(cycles-baseline.json)보다 나빠지면 실패한다. 같거나 나아지면 통과.
 * → 감축은 ROADMAP P1-E / P4-B. 여기서는 "더 나빠지지 않게" 막는다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import madge from 'madge';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');          // JWFramework/
const BASELINE_PATH = path.join(HERE, 'cycles-baseline.json');
const ENTRY = path.join(ROOT, 'Main.ts');

/** Tarjan 강결합 요소 */
function findSccs(graph)
{
    let counter = 0;
    const index = new Map(), low = new Map(), onStack = new Set(), stack = [], sccs = [];

    const strongconnect = (v) =>
    {
        index.set(v, counter); low.set(v, counter); counter++;
        stack.push(v); onStack.add(v);

        for (const w of (graph[v] || []))
        {
            if (!index.has(w)) { strongconnect(w); low.set(v, Math.min(low.get(v), low.get(w))); }
            else if (onStack.has(w)) low.set(v, Math.min(low.get(v), index.get(w)));
        }

        if (low.get(v) === index.get(v))
        {
            const component = [];
            let w;
            do { w = stack.pop(); onStack.delete(w); component.push(w); } while (w !== v);
            sccs.push(component);
        }
    };

    for (const v of Object.keys(graph)) if (!index.has(v)) strongconnect(v);

    // 크기 1 이면서 자기참조도 없으면 순환이 아니다
    return sccs.filter(c => c.length > 1 || (graph[c[0]] || []).includes(c[0]));
}

const result = await madge(ENTRY, {
    fileExtensions: ['ts'],
    detectiveOptions: { ts: { skipTypeImports: true } },   // import type 은 런타임 의존이 아니다
});
const graph = result.obj();

const sccs = findSccs(graph).sort((a, b) => b.length - a.length);
const countEdges = (scc) =>
{
    const set = new Set(scc);
    return scc.reduce((n, v) => n + (graph[v] || []).filter(w => set.has(w)).length, 0);
};

const current = {
    sccCount: sccs.length,
    largestScc: sccs.length ? sccs[0].length : 0,
    modulesInCycles: sccs.reduce((n, c) => n + c.length, 0),
    internalEdges: sccs.reduce((n, c) => n + countEdges(c), 0),
};
const totalModules = Object.keys(graph).length;

console.log(`총 모듈 ${totalModules}개`);
console.log(`순환 덩어리(SCC) ${current.sccCount}개 · 얽힌 모듈 ${current.modulesInCycles}개 · 내부 간선 ${current.internalEdges}개`);
sccs.forEach((c, i) => console.log(`  [SCC ${i + 1}] 모듈 ${c.length} / 간선 ${countEdges(c)}`));

if (process.argv.includes('--verbose'))
{
    sccs.forEach((c, i) =>
    {
        console.log(`\n[SCC ${i + 1}]`);
        c.slice().sort().forEach(m => console.log(`    ${m}`));
    });
}

if (!fs.existsSync(BASELINE_PATH))
{
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + '\n');
    console.log(`\n기준선 생성: ${path.relative(ROOT, BASELINE_PATH)}`);
    process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
const worse = Object.keys(current).filter(k => current[k] > baseline[k]);
const better = Object.keys(current).filter(k => current[k] < baseline[k]);

console.log('');
if (worse.length)
{
    console.log('✖ 순환이 악화되었습니다. 기준선 대비:');
    for (const k of worse) console.log(`    ${k}: ${baseline[k]} → ${current[k]}`);
    console.log('\n  새 순환을 만들지 않는 방법은 CLAUDE.md §3 참조.');
    console.log(`  상세: npm run check:cycles -- --verbose`);
    console.log(`  의도적으로 늘린 것이라면 ${path.relative(ROOT, BASELINE_PATH)} 를 갱신할 것.`);
    process.exit(1);
}

if (better.length)
{
    console.log('✔ 기준선보다 개선되었습니다:');
    for (const k of better) console.log(`    ${k}: ${baseline[k]} → ${current[k]}`);
    console.log(`\n  ${path.relative(ROOT, BASELINE_PATH)} 를 갱신해 새 기준선으로 삼으세요.`);
}
else
{
    console.log('✔ 기준선 유지 (악화 없음)');
}
process.exit(0);

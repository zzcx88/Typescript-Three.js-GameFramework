import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'docs/**', 'JWFramework/Lib/**', '**/*.d.ts', '**/*.js', '**/*.mjs'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['JWFramework/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
        },
        rules: {
            /* ── ESM 전환의 핵심 ───────────────────────────────────────
               타입 위치에서만 쓰이는 import 를 `import type` 으로 승격한다.
               스코프 분석 기반이라 `get X(): X` 같은 게터-타입 동명 패턴도
               정확히 구분한다. 런타임 의존이 사라져야 순환참조가 끊긴다.
               → docs/ESM전환-설계.md §3.4                                */
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],

            /* ── CLAUDE.md §7.1 (any 금지 · 우회 금지) 자동 강제 ──────── */
            '@typescript-eslint/ban-ts-comment': 'error',   // @ts-ignore 금지 — 신규 위반 0건이므로 즉시 error

            /* any 는 기존 코드에 3건 남아 있다.
               ESM 전환의 비목표(로직 변경 없음) 때문에 지금 못 고친다 → warn 유지.
                 GameObject.ts:164,165  CollisionActive/DeActive(value: any = 0)
                                        ← 시그니처 불일치 우회. ROADMAP P1-B 에서 통일
                 ModelLoadManager.ts:114 (n as any)
               ROADMAP P1-B 에서 error 로 승격한다. 신규 코드에는 예외 없이 금지(§7.1). */
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off', // 타입 정보 필요 — P1-B 에서 활성

            /* ── 레거시 코드베이스라 아직 못 켜는 것들 (ROADMAP P1-B) ── */
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unused-expressions': 'off', // ModelLoadManager 의 부작용 게터
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-namespace': 'off',
            'prefer-const': 'off',      // CLAUDE.md §6 — 이 코드베이스는 let 위주
            'no-useless-assignment': 'off',
            'no-empty': 'off',
            'no-undef': 'off',          // TS 가 담당
        },
    },
);

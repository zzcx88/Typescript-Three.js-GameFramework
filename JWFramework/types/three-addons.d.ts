/**
 * 서드파티 타입 보강 — CLAUDE.md §7.1 "라이브러리 타입이 부족하면 보강 선언"
 *
 * `as any` 로 덮지 않는다. 여기에 올바른 선언을 적는다.
 */

/**
 * @types/three@0.134 의 SkeletonUtils 선언이 실제 런타임과 어긋난다.
 *
 *   타입 정의 : export namespace SkeletonUtils { function clone(...) }
 *   실제 r134 : export { retarget, ..., clone }   ← named export
 *
 * 정의대로 `SkeletonUtils.clone` 을 쓰면 런타임에 undefined 다.
 * 실제 모듈 형태에 맞춰 재선언한다.
 *
 * three 업그레이드(ROADMAP P1-A) 시 최신 @types/three 에서 고쳐졌는지 확인하고,
 * 고쳐졌다면 이 선언을 지울 것.
 */
declare module 'three/examples/jsm/utils/SkeletonUtils.js' {
    import type { AnimationClip, Bone, Matrix4, Object3D, Skeleton, SkeletonHelper } from 'three';

    export function clone(source: Object3D): Object3D;
    export function retarget(target: Object3D | Skeleton, source: Object3D | Skeleton, options?: object): void;
    export function retargetClip(
        target: Skeleton | Object3D,
        source: Skeleton | Object3D,
        clip: AnimationClip,
        options?: object,
    ): AnimationClip;
    export function getHelperFromSkeleton(skeleton: Skeleton): SkeletonHelper;
    export function getSkeletonOffsets(target: Object3D | Skeleton, source: Object3D | Skeleton, options?: object): Matrix4[];
    export function getBones(skeleton: Skeleton | Bone[]): Bone[];
    export function getBoneByName(name: string, skeleton: Skeleton): Bone;
    export function getNearestBone(bone: Bone, names: object): Bone;
    export function getEqualsBonesNames(skeleton: Skeleton, targetSkeleton: Skeleton): string[];
}

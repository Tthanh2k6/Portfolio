declare module "three" {
  export type Color = any;
  export type Group = any;
  export type MeshStandardMaterial = any;
  export type MeshBasicMaterial = any;
  const THREE: any;
  export = THREE;
}
declare module "three/addons/postprocessing/EffectComposer.js";
declare module "three/addons/postprocessing/RenderPass.js";
declare module "three/addons/postprocessing/UnrealBloomPass.js";
declare module "three/addons/lines/LineSegments2.js";
declare module "three/addons/lines/LineSegmentsGeometry.js";
declare module "three/addons/lines/LineMaterial.js" {
  export class LineMaterial {
    constructor(params?: any);
    [key: string]: any;
  }
}

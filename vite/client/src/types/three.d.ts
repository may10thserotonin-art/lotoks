import { JSX } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      videoTexture: any;
      perspectiveCamera: any;
      suspense: any;
    }
  }
}
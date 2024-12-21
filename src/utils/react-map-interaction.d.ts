declare module "react-map-interaction" {
  import { CSSProperties, ReactNode } from "react";

  export interface MapInteractionCSSProps {
    value?: {
      scale: number;
      translation: { x: number; y: number };
    };
    onChange?: (value: { scale: number; translation: { x: number; y: number } }) => void;
    defaultValue?: {
      scale: number;
      translation: { x: number; y: number };
    };
    minScale?: number;
    maxScale?: number;
    showControls?: boolean;
    style?: CSSProperties;
    translationBounds?: {
      xMin?: number;
      xMax?: number;
      yMin?: number;
      yMax?: number;
    };
    children?: ReactNode;
  }

  export const MapInteractionCSS: React.FC<MapInteractionCSSProps>;
}

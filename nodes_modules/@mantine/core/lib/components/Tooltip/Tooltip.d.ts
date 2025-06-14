import { Factory } from '../../core';
import { ArrowPosition, FloatingAxesOffsets, FloatingPosition, FloatingStrategy } from '../Floating';
import { TransitionOverride } from '../Transition';
import { TooltipBaseProps, TooltipCssVariables, TooltipStylesNames } from './Tooltip.types';
import { TooltipFloating } from './TooltipFloating/TooltipFloating';
import { TooltipGroup } from './TooltipGroup/TooltipGroup';
export interface TooltipProps extends TooltipBaseProps {
    /** Called when tooltip position changes */
    onPositionChange?: (position: FloatingPosition) => void;
    /** Open delay in ms */
    openDelay?: number;
    /** Close delay in ms, `0` by default */
    closeDelay?: number;
    /** Controlled opened state */
    opened?: boolean;
    /** Uncontrolled tooltip initial opened state */
    defaultOpened?: boolean;
    /** Space between target element and tooltip in px, `5` by default */
    offset?: number | FloatingAxesOffsets;
    /** Determines whether the tooltip should have an arrow, `false` by default */
    withArrow?: boolean;
    /** Arrow size in px, `4` by default */
    arrowSize?: number;
    /** Arrow offset in px, `5` by default */
    arrowOffset?: number;
    /** Arrow `border-radius` in px, `0` by default */
    arrowRadius?: number;
    /** Arrow position relative to the tooltip, `side` by default */
    arrowPosition?: ArrowPosition;
    /** Props passed down to the `Transition` component that used to animate tooltip presence, use to configure duration and animation type, `{ duration: 100, transition: 'fade' }` by default */
    transitionProps?: TransitionOverride;
    /** Determines which events will be used to show tooltip, `{ hover: true, focus: false, touch: false }` by default */
    events?: {
        hover: boolean;
        focus: boolean;
        touch: boolean;
    };
    /** @deprecated: Do not use, will be removed in 9.0 */
    positionDependencies?: any[];
    /** Must be set if the tooltip target is an inline element */
    inline?: boolean;
    /** If set, the tooltip will not be unmounted from the DOM when it is hidden, `display: none` styles will be applied instead */
    keepMounted?: boolean;
    /** Changes floating ui [position strategy](https://floating-ui.com/docs/usefloating#strategy), `'absolute'` by default */
    floatingStrategy?: FloatingStrategy;
    /** Determines whether tooltip text color should depend on `background-color`. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. */
    autoContrast?: boolean;
}
export type TooltipFactory = Factory<{
    props: TooltipProps;
    ref: HTMLDivElement;
    stylesNames: TooltipStylesNames;
    vars: TooltipCssVariables;
    staticComponents: {
        Floating: typeof TooltipFloating;
        Group: typeof TooltipGroup;
    };
}>;
export declare const Tooltip: import("../../core").MantineComponent<{
    props: TooltipProps;
    ref: HTMLDivElement;
    stylesNames: TooltipStylesNames;
    vars: TooltipCssVariables;
    staticComponents: {
        Floating: typeof TooltipFloating;
        Group: typeof TooltipGroup;
    };
}>;

import SVG from 'react-inlinesvg';
import React, {CSSProperties} from 'react';

export interface SvgIconProps {

    // defuatl: current font size
    size?: number;

    // default: currentColor
    color?: string;

    src: string;

    style?: CSSProperties;

    className?: string
}

const SvgIcon = (props: SvgIconProps) => {
    const {size, color, src, style, className} = props;
    return <i style={{fontSize: size, width: size, height: size, color, ...style}} className={className}>
        <SVG width="1em"
             height="1em"
             fill="currentColor"
             src={src}/>
    </i>

};

export default SvgIcon;

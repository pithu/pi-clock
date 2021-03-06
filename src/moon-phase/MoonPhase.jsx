import React from 'react';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CircleIcon from '@mui/icons-material/Circle';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import * as PIXI from 'pixi.js';
import { Moon } from "lunarphase-js";
import './moon-phase.css';

const UPDATE_INTERVAL = 60 * 1000;

const calculateMoonPhase = () => Math.PI + 2 * (Moon.lunarAgePercent()) * Math.PI;
const moonPhaseInfo = () => ({
    lunarAgePercent: Moon.lunarAgePercent(),
    isWaxing: Moon.isWaxing(),
    isWaning: Moon.isWaning(),
    lunarAge: Moon.lunarAge(),
    lunationNumber: Moon.lunationNumber(),
    lunarDistance: Moon.lunarDistance(),
});

const formatNumber = (number) =>
    number.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const calculateLunarAge = (lunarAgePercent) => {
    const percentageOfFull = 2 * lunarAgePercent * 100;
    const percentageOfFullFormatted = formatNumber(percentageOfFull);

    if (percentageOfFullFormatted === formatNumber(100)) {
        return {
            percentageOfFull: percentageOfFullFormatted,
            dest: 'full',
        }
    } else if (percentageOfFullFormatted === formatNumber(0)) {
        return {
            percentageOfFull: percentageOfFullFormatted,
            dest: 'new',
        }
    } else if (percentageOfFull > 100) {
        return {
            percentageOfFull: formatNumber(200 - percentageOfFull),
            dest: 'down',
        }
    }
    return {
        percentageOfFull: percentageOfFullFormatted,
        dest: 'up',
    }
}

const calculateLunarDistance = (lunarDistance) => {
    const distanceInOneHour = Moon.lunarDistance(new Date(new Date().getTime() + (60*60*1000)));
    return {
        earthRadii: formatNumber(lunarDistance),
        dest: lunarDistance > distanceInOneHour ? 'up' : 'down',
    }
}

const getLunarDestIcon = (dest) => {
    switch(dest) {
        case 'down': return ArrowCircleDownIcon;
        case 'up': return ArrowCircleUpIcon;
        case 'full': return CircleIcon;
        case 'new': return CheckBoxOutlineBlankIcon;
        default: throw new Error(`unknown dest ${dest}`)
    }
}
export default class MoonPhase extends React.Component {
    constructor(props) {
        super(props);

        this.updateMoonPhase = this.updateMoonPhase.bind(this);
        console.log(moonPhaseInfo())

        this.moon = null;
        this.radius = 100.5;

        // width: 228, height: 215
        this.center = new PIXI.Point(214 / 2, 214 / 2);
        this.state = {
            ...moonPhaseInfo(),
            moonPhase: calculateMoonPhase(),
        }
    }

    componentDidMount() {
        const that = this;
        this.app = new PIXI.Application({
            width: this.center.x * 2,
            height: this.center.y * 2,
            forceCanvas: true
        });
        this.el.appendChild(this.app.view);

        this.app.loader.add('moon', 'images/moon.png');

        this.app.loader.load((loader, resources) => {
            that.moon = resources.moon;
            that.draw();
        });
        this.updateInterval = setInterval(this.updateMoonPhase, UPDATE_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    updateMoonPhase() {
        // console.log(moonPhaseInfo())
        this.setState({
            ...moonPhaseInfo(),
            moonPhase: calculateMoonPhase(),
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.leftShade && prevState.moonPhase !== this.state.moonPhase) {
            this.drawPhase(this.leftShade, this.rightShade,
                           this.convertPhase(this.state.moonPhase));
        }
    }

    draw() {
        this.drawMoon(this.app);
        this.drawShades(this.app);
        this.drawPhase(this.leftShade, this.rightShade,
                       this.convertPhase(this.state.moonPhase));
    }
    drawMoon(app) {
        const moon = new PIXI.Sprite(this.moon.texture);
        app.stage.addChild(moon);
    }
    drawShades(app) {
        this.leftShade = new PIXI.Graphics();
        this.leftShade.pivot = this.center;
        this.rightShade = new PIXI.Graphics();
        this.rightShade.pivot = this.center;

        this.leftShade.beginFill(0x000000, 0.7);
        this.leftShade.arc(this.center.x * 2, this.center.y * 2,
                           this.radius, Math.PI / 2, -Math.PI / 2);
        this.leftShade.endFill();
        app.stage.addChild(this.leftShade);

        this.rightShade.beginFill(0x000000, 0.7);
        this.rightShade.arc(this.center.x * 2, this.center.y * 2,
                            this.radius, -Math.PI / 2, Math.PI / 2);
        this.rightShade.endFill();
        app.stage.addChild(this.rightShade);

        // When the moon is a crescent, use the opposite shade to
        // create a mask, with only the shade part of the moon clearly
        // visible. So, sometimes there are actually two moons on the
        // screen, you just can't tell.
        const hiddenMoon = new PIXI.Sprite(this.moon.texture);
        hiddenMoon.visible = false;
        app.stage.addChild(hiddenMoon);
        this.hiddenMoon = hiddenMoon;
    }
    drawPhase(leftShade, rightShade, phase) {
        if (phase <= 0.5) {
            const scale = 1 - (phase * 4);
            leftShade.scale.x = 1;
            leftShade.position.x = 0;
            rightShade.scale.x = scale;
            rightShade.position.x = this.center.x - (scale * this.center.x);

            if (phase > 0.25) {
                this.hiddenMoon.mask = this.rightShade;
                this.hiddenMoon.visible = true;
            } else {
                this.hiddenMoon.mask = null;
                this.hiddenMoon.visible = false;
            }
        } else {
            const scale = -phase * 4 + 3;

            rightShade.scale.x = 1;
            rightShade.position.x = 0;

            if (phase < 0.75) {
                this.hiddenMoon.mask = this.leftShade;
                this.hiddenMoon.visible = true;
                leftShade.scale.x = -scale;
                leftShade.position.x = this.center.x - (-scale * this.center.x);
            } else {
                this.hiddenMoon.mask = null;
                this.hiddenMoon.visible = false;
                leftShade.scale.x = -scale;
                leftShade.position.x =  this.center.x - (-scale * this.center.x);
                rightShade.scale.x = 1;
                rightShade.position.x = 0;
            }
        }
    }
    /**
     * Get the moonPhase value that's used by the rest of the system
     * ready for the moon phase painter.
     *
     * moonPhase is offset by pi (its initial value is Math.PI, see
     * initial state in main.jsx), and also divide it by 2 * pi
     * because moonPhase is in radians and the moon phase painter
     * expects the phase to be a number between 0 and 1.
     */
    convertPhase(moonPhase) {
        const phase = (moonPhase - Math.PI) / (Math.PI * 2);
        if (phase > 1) {
            return 0;
        }
        if (phase < 0) {
            return phase + 1;
        }
        return phase;
    }

    render() {
        const lunarAge = calculateLunarAge(this.state.lunarAgePercent)
        const LunarDestIcon = getLunarDestIcon(lunarAge.dest);
        const lunarDistance = calculateLunarDistance(this.state.lunarDistance)
        const LunarDistIcon = getLunarDestIcon(lunarDistance.dest);
        return (
            <div className="moon-scaled">
                <div className="moonPhase" ref={(thisDiv) => {this.el = thisDiv}} />
                <div>
                    <div><LunarDestIcon /> {lunarAge.percentageOfFull} %</div>
                    <div><LunarDistIcon /> {lunarDistance.earthRadii} er</div>
                </div>
            </div>
        );
    }
}

import { useRef, useEffect } from 'react';


import '../styles/Canvas.css';


function Canvas(props) {

    const ctxVisualRef = useRef(null);
    const cursorRef = useRef(null);


    useEffect(() => {

        const ctxVisual = props.visualRef.current.getContext('2d', {willReadFrequently: true});
        ctxVisualRef.current = ctxVisual;

        let rect = props.visualRef.current.getBoundingClientRect();
        const scaleX =  rect.width / props.visualRef.current.width;
        const scaleY = rect.height / props.visualRef.current.height;
        cursorRef.current.style.width = `${props.size * scaleX}px`;
        cursorRef.current.style.height = `${props.size * scaleY}px`;
        

    }, [props.size, props.visualRef]);

    function addHistoryEvent(ctx, x, y, color, size) {
        props.undoStack.current.push({
            ctx: ctx,
            action: props.action.current,
            color: color,
            size: size,
            points: determinePoints(ctx, x, y, size)
        });
    };

    function determinePoints(ctx, x, y, size) {
        let points = new Map();
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j ++) {
                const xCoord = x + i;
                const yCoord = y + j;
                if ((xCoord < props.visualRef.current.width) && (yCoord < props.visualRef.current.height)){
                    points.set(`${xCoord},${yCoord}`, {x: xCoord, y: yCoord, replacedColor: ctx.getImageData(xCoord, yCoord, 1, 1).data});
                }
            }
        }
        return points;
    }


    function mousePosition(e) {
        let rect = props.visualRef.current.getBoundingClientRect();

        const scaleX = props.visualRef.current.width / rect.width;
        const scaleY = props.visualRef.current.height / rect.height;

        let x = Math.floor((e.clientX - rect.left) * scaleX);
        let y = Math.floor((e.clientY - rect.top) * scaleY);

        return {x, y};
    }

    function handleMouseMove(e) {
        const ctxVisual = ctxVisualRef.current;
        let mousePos = mousePosition(e);

        if ((mousePos.x === props.pos.current.x && mousePos.y === props.pos.current.y) || (mousePos.x < 0 || mousePos.y < 0) || (props.isMouseDown.current && props.action.current === 'fill')) {
            return;
        }
        if(props.isMouseDown.current && (mousePos.x >= 0) && (mousePos.y >= 0) && props.action.current !== 'eyeDropper') {
            let newPoints = determinePoints(ctxVisual, mousePos.x, mousePos.y, props.size);
            newPoints.forEach((value, key) => {
                const history = props.undoStack.current[props.historyIndex.current].points;
                if (!history.has(key)) {
                    history.set(key, value);
                }

            });
            props.handleAction(ctxVisual, newPoints, props.color.current);
        }
        if (props.isMouseDown.current && props.action.current === 'eyeDropper') {
            props.handleAction(ctxVisual, determinePoints(ctxVisual, mousePos.x, mousePos.y, props.size), props.color.current);
        }
        props.setPos({x: mousePos.x, y: mousePos.y});
        let rect = props.visualRef.current.getBoundingClientRect();

        const scaleX =  rect.width / props.visualRef.current.width;
        const scaleY = rect.height / props.visualRef.current.height;
        

        cursorRef.current.style.backgroundColor = `${props.color.current}`;
        cursorRef.current.style.left = `${mousePos.x * scaleX}px`;
        cursorRef.current.style.top = `${mousePos.y * scaleY}px`;
    }

    function handleMouseDown(e) {
        const ctxVisual = ctxVisualRef.current;
        let mousePos = mousePosition(e);
        let color = props.color.current;
        if (props.action.current === "erase") {
            color = null
        }
        if (props.action.current === 'eyeDropper') {
            props.handleAction(ctxVisual, determinePoints(ctxVisual, mousePos.x, mousePos.y, props.size), color);
            return;
        }
        props.redoStack.current = [];
        props.undoStack.current = props.undoStack.current.slice(0, props.historyIndex.current + 1);
        addHistoryEvent(ctxVisual, mousePos.x, mousePos.y, color, props.size);
        props.increaseIndex();
        props.handleAction(ctxVisual, props.undoStack.current[props.historyIndex.current].points, color);

    }

    function handleMouseLeave() {
        props.setPos({x: -1, y: -1});
        cursorRef.current.style.backgroundColor = 'transparent';
    }

    function handleMouseEnter(e) {
        let mousePos = mousePosition(e);
        props.setPos({x: mousePos.x, y: mousePos.y});
        cursorRef.current.style.backgroundColor = `${props.color.current}`;
        let rect = props.visualRef.current.getBoundingClientRect();

        const scaleX =  rect.width / props.visualRef.current.width;
        const scaleY = rect.height / props.visualRef.current.height;

        cursorRef.current.style.backgroundColor = `${props.color.current}`;
        cursorRef.current.style.left = `${mousePos.x * scaleX}px`;
        cursorRef.current.style.top = `${mousePos.y * scaleY}px`;
    }

    return (
        <div id='canvas-container'>
            <div id='cursor' ref={cursorRef} size={props.size}></div>
            <canvas id='visual-canvas' ref={props.visualRef} width={props.width} height={props.height}>Drawing space for pixel art</canvas>
            <canvas id='interact-canvas' width={props.width} height={props.height} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>Canvas for interaction</canvas>
        </div>
    )
}

export default Canvas;
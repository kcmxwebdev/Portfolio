import { useEffect, useRef, useState } from 'react';

import '../styles/Settings.css';

function Settings(props) {

    useEffect(() => {
        function stopTextUndo(e) {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
            }
        }
        // function handleSetting(e) {
        //     if (!fileRef.current.contains(e.target) || !toolRef.current.contains(e.target)) {
        //         setSettingOpen(false);
        //     }
        // }

        window.addEventListener('keydown', stopTextUndo);
        // window.addEventListener('click', handleSetting)

        return () => {
        window.removeEventListener('keydown', stopTextUndo)
        // window.removeEventListener('click', handleSetting)
        };
    }, []);

    const sizeInputRef = useRef(null);
    // const fileRef = useRef(null);
    // const toolRef = useRef(null);

    // const [isSettingOpen, setSettingOpen] = useState(false);

    function sizeChange(e) {
        if (e.target.value > 64) {
            props.setSize(64);
            return;
        }
        else if (e.target.value === '') {
            props.setSize(1);
            return;
        }
        props.setSize(e.target.value);
    }

    function sizeKeyDown(e) {
        if (e.key === 'e' || e.key === '+' || e.key === '.' || e.ctrlKey && e.key === 'z') {
            e.preventDefault();
        }
        if (e.key === "Enter") {
            sizeInputRef.current.value = props.size;
        }
    }

    function sizeBlur(e) {
        if (e.target.value === '') {
            e.target.value = 1;
            props.setSize(1);
        }
        if (e.target.value > 64) {
            e.target.value = 64;
            props.setSize(64);   
        }
    }

    function handleColorInput(e) {
        props.setColorInput(e.target.value);
        props.setColorRef(e.target.value);
    }


    return (
        <div id='settings-container'>
            <select name='file-dropdown' className='setting-button dropdown' onChange={(e) => props.fileSettingOnChange(e.target.value)} value={props.fileState} aria-label='File Select Dropdown'>
                <option>File</option>
                <option value='load'>Load</option>
                <option value='save'>Save</option>
            </select>
            <select name='tool-dropdown' className='setting-button dropdown' onChange={(e) => props.toolSettingOnChange(e.target.value)} value={props.toolState} aria-label='Tool Select Dropdown'>
                <option>Tools</option>
                <option value='undo'>Undo</option>
                <option value='redo'>Redo</option>
                <option value='draw'>Draw</option>
                <option value='fill'>Fill</option>
                <option value='erase'>Erase</option>
                <option value='eye'>Eye Dropper</option>
            </select>
            <input id='color-picker' type='color' className='setting-button' onInput={handleColorInput} value={props.color} alpha='true' aria-label='Color Picker'></input>
            <div id='pixel-size' className='setting-button'> 
                <label htmlFor='size-input' id='size-label'>Size: </label>
                <input type='number' name='size-input' id='size-input' onChange={sizeChange} onKeyDown={sizeKeyDown} onBlur={sizeBlur} defaultValue={1} ref={sizeInputRef}></input>
            </div>
        </div>
    )
}

export default Settings;
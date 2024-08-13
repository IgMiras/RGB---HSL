import React, { useState } from 'react';

function App() {
  const [rgb, setRgb] = useState({ red: '', green: '', blue: '' });
  const [hsl, setHsl] = useState({ hue: '', saturation: '', light: '' });

  const rgbToHsl = ({ red, green, blue }) => {
    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let hue, saturation, light = (max + min) / 2;

    if (max === min) {
      hue = saturation = 0; // achromatic
    } else {
      const delta = max - min;
      saturation = light > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      switch (max) {
        case red: hue = (green - blue) / delta + (green < blue ? 6 : 0); break;
        case green: hue = (blue - red) / delta + 2; break;
        case blue: hue = (red - green) / delta + 4; break;
        default: break;
      }
      hue *= 60;
    }

    return { hue: Math.round(hue), saturation: Math.round(saturation * 100), light: Math.round(light * 100) };
  };

  const hslToRgb = ({ hue, saturation, light }) => {
    let red, green, blue;

    saturation /= 100;
    light /= 100;

    if (saturation === 0) {
      red = green = blue = light; // achromatic
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = light < 0.5 ? light * (1 + saturation) : light + saturation - light * saturation;
      const p = 2 * light - q;
      red = hueToRgb(p, q, hue / 360 + 1 / 3);
      green = hueToRgb(p, q, hue / 360);
      blue = hueToRgb(p, q, hue / 360 - 1 / 3);
    }

    return { red: Math.round(red * 255), green: Math.round(green * 255), blue: Math.round(blue * 255) };
  };

  const handleRgbChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || (value >= 0 && value <= 255)) {
      setRgb({ ...rgb, [name]: value === '' ? '' : Number(value) });
    }
  };

  const handleHslChange = (e) => {
    const { name, value } = e.target;
    const ranges = {
      hue: [0, 360],
      saturation: [0, 100],
      light: [0, 100],
    };

    if (value === '' || (value >= ranges[name][0] && value <= ranges[name][1])) {
      setHsl({ ...hsl, [name]: value === '' ? '' : Number(value) });
    }
  };

  const convertRgbToHsl = () => {
    setHsl(rgbToHsl(rgb));
  };

  const convertHslToRgb = () => {
    setRgb(hslToRgb(hsl));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>RGB &lt;-&gt; HSL</h1>
      <h2>By IgMiras</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
        <div style={{ marginRight: '20px' }}>
          <label>
            Red (0-255):
            <br />
            <input type="number" min="0" max="255" name="red" value={rgb.red} onChange={handleRgbChange} />
          </label>
          <br />
          <label>
            Green (0-255):
            <br />
            <input type="number" min="0" max="255" name="green" value={rgb.green} onChange={handleRgbChange} />
          </label>
          <br />
          <label>
            Blue (0-255):
            <br />
            <input type="number" min="0" max="255" name="blue" value={rgb.blue} onChange={handleRgbChange} />
          </label>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 20px' }}>
          <button onClick={convertRgbToHsl} style={{ fontSize: '24px', padding: '10px', border: '2px solid #000', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer' }}>&rarr;</button>
          <button onClick={convertHslToRgb} style={{ fontSize: '24px', padding: '10px', border: '2px solid #000', borderRadius: '5px', cursor: 'pointer' }}>&larr;</button>
        </div>
        
        <div style={{ marginLeft: '20px' }}>
          <label>
            Hue (0-360):
            <br />
            <input type="number" min="0" max="360" name="hue" value={hsl.hue} onChange={handleHslChange} />
            °
          </label>
          <br />
          <label>
            Saturation (0-100):
            <br />
            <input type="number" min="0" max="100" name="saturation" value={hsl.saturation} onChange={handleHslChange} />
            %
          </label>
          <br />
          <label>
            Light (0-100):
            <br />
            <input type="number" min="0" max="100" name="light" value={hsl.light} onChange={handleHslChange} />
            %
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    try {
      //write file to wasm memory system
      ffmpeg.FS('writefile', 'test.mp4', await fetchFile(video));
      // run ffmpeg convert command
      await ffmpeg.run(
        '-i',
        'test.mp4',
        '-t',
        '2.5',
        '-ss',
        '2.0',
        '-f',
        'gif',
        'out.gif',
      );
      //read file
      const data = ffmpeg.FS('readFile', 'out.gif');
      //create url of out.gif readable by browser
      const url = URL.createObjectURL(new Blob(data.buffer), {
        type: 'image.gif',
      });
      setGif(url);
    } catch (error) {
      console.error(error);
    }
  };

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}

      <input
        type="file"
        onChange={(e) => setVideo(e.target.files?.item(0))}
      ></input>
      <h3>Result</h3>
      <button onClick={() => convertToGif()}>Convert</button>
      {gif && <img src={gif} />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
